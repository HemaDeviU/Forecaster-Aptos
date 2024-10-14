module prediction_market {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};

    struct Market has key {
        live_phase_duration: u64,
        resolution_phase_duration: u64,
        current_market_id: u64,
        markets: Table<u64, MarketInfo>,
        user_bets: Table<address, Table<u64, UserBet>>,
        treasury: Coin<AptosCoin>,
        market_created_events: EventHandle<MarketCreatedEvent>,
        bet_placed_events: EventHandle<BetPlacedEvent>,
        market_resolved_events: EventHandle<MarketResolvedEvent>,
    }

    struct MarketInfo has store {
        start_time: u64,
        locked_price: u64,
        closed_price: u64,
        total_up_amount: u64,
        total_down_amount: u64,
        is_resolved: bool,
    }

    struct UserBet has store, drop {
        amount: u64,
        position: bool, // true for UP, false for DOWN
    }

    struct MarketCreatedEvent has drop, store {
        market_id: u64,
        start_time: u64,
        locked_price: u64,
    }

    struct BetPlacedEvent has drop, store {
        market_id: u64,
        user: address,
        amount: u64,
        position: bool,
    }

    struct MarketResolvedEvent has drop, store {
        market_id: u64,
        closed_price: u64,
    }

    const E_MARKET_NOT_INITIALIZED: u64 = 1;
    const E_MARKET_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_PHASE: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;
    const E_UNAUTHORIZED: u64 = 5;
    const E_MARKET_ALREADY_RESOLVED: u64 = 6;

    public fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);
        assert!(!exists<Market>(account_addr), E_MARKET_ALREADY_INITIALIZED);
        assert!(account_addr == @prediction_market, E_UNAUTHORIZED);
        
        move_to(account, Market {
            live_phase_duration: 5 * 60, // 5 minutes
            resolution_phase_duration: 60, // 1 minute
            current_market_id: 0,
            markets: table::new(),
            user_bets: table::new(),
            treasury: coin::zero<AptosCoin>(),
            market_created_events: account::new_event_handle<MarketCreatedEvent>(account),
            bet_placed_events: account::new_event_handle<BetPlacedEvent>(account),
            market_resolved_events: account::new_event_handle<MarketResolvedEvent>(account),
        });

        // Create the first market
        create_new_market(timestamp::now_seconds(), 0); // Initial price set to 0, should be updated immediately
    }

    fun create_new_market(start_time: u64, initial_price: u64) acquires Market {
        let market = borrow_global_mut<Market>(@prediction_market);
        let new_market_id = market.current_market_id + 1;
        
        table::add(&mut market.markets, new_market_id, MarketInfo {
            start_time,
            locked_price: initial_price,
            closed_price: 0,
            total_up_amount: 0,
            total_down_amount: 0,
            is_resolved: false,
        });

        market.current_market_id = new_market_id;

        event::emit_event(&mut market.market_created_events, MarketCreatedEvent {
            market_id: new_market_id,
            start_time,
            locked_price: initial_price,
        });
    }

    public fun place_bet(account: &signer, amount: u64, position: bool) acquires Market {
        let market = borrow_global_mut<Market>(@prediction_market);
        let current_time = timestamp::now_seconds();
        let market_info = table::borrow_mut(&mut market.markets, market.current_market_id);

        assert!(
            current_time < market_info.start_time + market.live_phase_duration,
            E_INVALID_PHASE
        );

        let account_addr = signer::address_of(account);
        
        // Transfer coins from user to the market contract
        let bet_coins = coin::withdraw<AptosCoin>(account, amount);
        coin::merge(&mut market.treasury, bet_coins);

        if (position) {
            market_info.total_up_amount = market_info.total_up_amount + amount;
        } else {
            market_info.total_down_amount = market_info.total_down_amount + amount;
        }

        if (!table::contains(&market.user_bets, account_addr)) {
            table::add(&mut market.user_bets, account_addr, table::new());
        }

        let user_bets = table::borrow_mut(&mut market.user_bets, account_addr);
        table::upsert(user_bets, market.current_market_id, UserBet { amount, position });

        event::emit_event(&mut market.bet_placed_events, BetPlacedEvent {
            market_id: market.current_market_id,
            user: account_addr,
            amount,
            position,
        });
    }

    public fun resolve_market(oracle_account: &signer, oracle_price: u64) acquires Market {
        assert!(signer::address_of(oracle_account) == @prediction_market, E_UNAUTHORIZED);

        let market = borrow_global_mut<Market>(@prediction_market);
        let current_time = timestamp::now_seconds();
        let market_info = table::borrow_mut(&mut market.markets, market.current_market_id);

        assert!(!market_info.is_resolved, E_MARKET_ALREADY_RESOLVED);
        assert!(
            current_time >= market_info.start_time + market.live_phase_duration &&
            current_time < market_info.start_time + market.live_phase_duration + market.resolution_phase_duration,
            E_INVALID_PHASE
        );

        market_info.closed_price = oracle_price;
        market_info.is_resolved = true;

        event::emit_event(&mut market.market_resolved_events, MarketResolvedEvent {
            market_id: market.current_market_id,
            closed_price: oracle_price,
        });

        // Start a new market
        create_new_market(current_time, oracle_price);
    }

    public fun claim_winnings(account: &signer, market_id: u64) acquires Market {
        let market = borrow_global_mut<Market>(@prediction_market);
        let account_addr = signer::address_of(account);
        let market_info = table::borrow(&market.markets, market_id);

        assert!(market_info.is_resolved, E_INVALID_PHASE);

        let user_bets = table::borrow_mut(&mut market.user_bets, account_addr);
        assert!(table::contains(user_bets, market_id), E_INSUFFICIENT_BALANCE);

        let user_bet = table::remove(user_bets, market_id);

        let winning_position = market_info.closed_price > market_info.locked_price;
        if (user_bet.position == winning_position) {
            let total_pool = market_info.total_up_amount + market_info.total_down_amount;
            let winning_pool = if (winning_position) { market_info.total_up_amount } else { market_info.total_down_amount };
            let payout = (user_bet.amount * total_pool) / winning_pool;
            let fee = (payout * 3) / 10000; // 0.03% fee
            let net_payout = payout - fee;

            let payout_coins = coin::extract(&mut market.treasury, net_payout);
            coin::deposit(account_addr, payout_coins);
        }
    }

    public fun get_market_info(market_id: u64): (u64, u64, u64, u64, u64, bool) acquires Market {
        let market = borrow_global<Market>(@prediction_market);
        let market_info = table::borrow(&market.markets, market_id);

        (
            market_info.start_time,
            market_info.locked_price,
            market_info.closed_price,
            market_info.total_up_amount,
            market_info.total_down_amount,
            market_info.is_resolved
        )
    }

    public fun get_current_market_id(): u64 acquires Market {
        borrow_global<Market>(@prediction_market).current_market_id
    }

    public fun is_market_live(market_id: u64): bool acquires Market {
        let market = borrow_global<Market>(@prediction_market);
        let market_info = table::borrow(&market.markets, market_id);
        let current_time = timestamp::now_seconds();

        current_time >= market_info.start_time && 
        current_time < market_info.start_time + market.live_phase_duration &&
        !market_info.is_resolved
    }
}