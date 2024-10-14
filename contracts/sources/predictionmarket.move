module prediction_market {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_std::table::{Self, Table};

    struct Market has key {
        live_phase_duration: u64,
        resolution_phase_duration: u64,
        current_market_id: u64,
        markets: Table<u64, MarketInfo>,
        user_bets: Table<address, Table<u64, UserBet>>,
    }

    struct MarketInfo has store {
        start_time: u64,
        locked_price: u64,
        closed_price: u64,
        total_up_amount: u64,
        total_down_amount: u64,
        is_resolved: bool,
    }

    struct UserBet has store {
        amount: u64,
        position: bool, // true for UP, false for DOWN
    }

    const E_MARKET_NOT_INITIALIZED: u64 = 1;
    const E_MARKET_ALREADY_INITIALIZED: u64 = 2;
    const E_INVALID_PHASE: u64 = 3;
    const E_INSUFFICIENT_BALANCE: u64 = 4;

    public fun initialize(account: &signer) {
        assert!(!exists<Market>(signer::address_of(account)), E_MARKET_ALREADY_INITIALIZED);
        
        move_to(account, Market {
            live_phase_duration: 5 * 60, // 5 minutes
            resolution_phase_duration: 60, // 1 minute
            current_market_id: 0,
            markets: table::new(),
            user_bets: table::new(),
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
        coin::transfer<AptosCoin>(account, @prediction_market, amount);

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
    }

    public fun resolve_market(oracle_price: u64) acquires Market {
        let market = borrow_global_mut<Market>(@prediction_market);
        let current_time = timestamp::now_seconds();
        let market_info = table::borrow_mut(&mut market.markets, market.current_market_id);

        assert!(
            current_time >= market_info.start_time + market.live_phase_duration &&
            current_time < market_info.start_time + market.live_phase_duration + market.resolution_phase_duration,
            E_INVALID_PHASE
        );

        market_info.closed_price = oracle_price;
        market_info.is_resolved = true;

        // Start a new market
        market.current_market_id = market.current_market_id + 1;
        table::add(&mut market.markets, market.current_market_id, MarketInfo {
            start_time: current_time,
            locked_price: oracle_price,
            closed_price: 0,
            total_up_amount: 0,
            total_down_amount: 0,
            is_resolved: false,
        });
    }

    public fun claim_winnings(account: &signer, market_id: u64) acquires Market {
        let market = borrow_global_mut<Market>(@prediction_market);
        let account_addr = signer::address_of(account);
        let market_info = table::borrow(&market.markets, market_id);

        assert!(market_info.is_resolved, E_INVALID_PHASE);

        let user_bets = table::borrow_mut(&mut market.user_bets, account_addr);
        let user_bet = table::remove(user_bets, market_id);

        let winning_position = market_info.closed_price > market_info.locked_price;
        if (user_bet.position == winning_position) {
            let total_pool = market_info.total_up_amount + market_info.total_down_amount;
            let winning_pool = if (winning_position) { market_info.total_up_amount } else { market_info.total_down_amount };
            let payout = (user_bet.amount * total_pool) / winning_pool;
            let fee = (payout * 3) / 10000; // 0.03% fee
            let net_payout = payout - fee;

            coin::transfer<AptosCoin>(@prediction_market, account_addr, net_payout);
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
}