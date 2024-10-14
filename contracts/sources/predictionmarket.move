module BitcoinPredictionMarket {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use std::vector;
    use std::option::{Self, Option};

    /// Errors
    const ERROR_NOT_INITIALIZED: u64 = 1;
    const ERROR_NOT_ADMIN: u64 = 2;
    const ERROR_NOT_OPERATOR: u64 = 3;
    const ERROR_ALREADY_INITIALIZED: u64 = 4;
    const ERROR_ROUND_NOT_BETTABLE: u64 = 5;
    const ERROR_INSUFFICIENT_BET: u64 = 6;
    const ERROR_ALREADY_BET: u64 = 7;
    const ERROR_ROUND_NOT_ENDED: u64 = 8;
    const ERROR_ROUND_ENDED: u64 = 9;
    const ERROR_NOT_CLAIMABLE: u64 = 10;
    const ERROR_ALREADY_CLAIMED: u64 = 11;
    const ERROR_INVALID_EPOCH: u64 = 12;

    /// Constants
    const MAX_TREASURY_FEE: u64 = 1000; // 10%

    /// Main struct to hold the prediction market state
    struct PredictionMarket has key {
        admin: address,
        operator: address,
        oracle: address,
        current_epoch: u64,
        interval_seconds: u64,
        min_bet_amount: u64,
        treasury_fee: u64,
        treasury_amount: u64,
        rounds: vector<Round>,
        paused: bool,
    }

    /// Struct to represent a single round
    struct Round has store {
        epoch: u64,
        start_timestamp: u64,
        lock_timestamp: u64,
        close_timestamp: u64,
        lock_price: u64,
        close_price: u64,
        total_amount: u64,
        bull_amount: u64,
        bear_amount: u64,
        reward_amount: u64,
        reward_base_cal_amount: u64,
        oracle_called: bool,
    }

    /// Struct to represent a user's bet
    struct UserBet has store, drop {
        epoch: u64,
        position: bool, // true for Bull, false for Bear
        amount: u64,
        claimed: bool,
    }

    /// Resource to store a user's bets
    struct UserBets has key {
        bets: vector<UserBet>,
    }

    /// Initialize the prediction market
    public fun initialize(admin: &signer, operator: address, oracle: address, interval_seconds: u64, min_bet_amount: u64, treasury_fee: u64) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<PredictionMarket>(admin_addr), ERROR_ALREADY_INITIALIZED);
        assert!(treasury_fee <= MAX_TREASURY_FEE, ERROR_INVALID_EPOCH);

        move_to(admin, PredictionMarket {
            admin: admin_addr,
            operator,
            oracle,
            current_epoch: 0,
            interval_seconds,
            min_bet_amount,
            treasury_fee,
            treasury_amount: 0,
            rounds: vector::empty(),
            paused: false,
        });
    }

    /// Start a new round
    public fun start_round(operator: &signer) acquires PredictionMarket {
        let operator_addr = signer::address_of(operator);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(operator_addr == market.operator, ERROR_NOT_OPERATOR);
        assert!(!market.paused, ERROR_NOT_INITIALIZED);

        let current_timestamp = timestamp::now_seconds();
        let new_epoch = market.current_epoch + 1;

        let new_round = Round {
            epoch: new_epoch,
            start_timestamp: current_timestamp,
            lock_timestamp: current_timestamp + market.interval_seconds,
            close_timestamp: current_timestamp + (2 * market.interval_seconds),
            lock_price: 0,
            close_price: 0,
            total_amount: 0,
            bull_amount: 0,
            bear_amount: 0,
            reward_amount: 0,
            reward_base_cal_amount: 0,
            oracle_called: false,
        };

        vector::push_back(&mut market.rounds, new_round);
        market.current_epoch = new_epoch;
    }

    /// Lock the current round
    public fun lock_round(operator: &signer, price: u64) acquires PredictionMarket {
        let operator_addr = signer::address_of(operator);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(operator_addr == market.operator, ERROR_NOT_OPERATOR);
        assert!(!market.paused, ERROR_NOT_INITIALIZED);

        let current_round = vector::borrow_mut(&mut market.rounds, market.current_epoch - 1);
        assert!(timestamp::now_seconds() >= current_round.lock_timestamp, ERROR_ROUND_NOT_ENDED);
        assert!(timestamp::now_seconds() < current_round.close_timestamp, ERROR_ROUND_ENDED);

        current_round.lock_price = price;
    }

    /// End the previous round and calculate rewards
    public fun end_round(operator: &signer, price: u64) acquires PredictionMarket {
        let operator_addr = signer::address_of(operator);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(operator_addr == market.operator, ERROR_NOT_OPERATOR);
        assert!(!market.paused, ERROR_NOT_INITIALIZED);

        let previous_round = vector::borrow_mut(&mut market.rounds, market.current_epoch - 2);
        assert!(timestamp::now_seconds() >= previous_round.close_timestamp, ERROR_ROUND_NOT_ENDED);

        previous_round.close_price = price;
        previous_round.oracle_called = true;

        // Calculate rewards
        let reward_amount = if (previous_round.close_price > previous_round.lock_price) {
            // Bull wins
            previous_round.reward_base_cal_amount = previous_round.bull_amount;
            previous_round.total_amount - (previous_round.total_amount * market.treasury_fee / 10000)
        } else if (previous_round.close_price < previous_round.lock_price) {
            // Bear wins
            previous_round.reward_base_cal_amount = previous_round.bear_amount;
            previous_round.total_amount - (previous_round.total_amount * market.treasury_fee / 10000)
        } else {
            // House wins
            previous_round.reward_base_cal_amount = 0;
            0
        };

        previous_round.reward_amount = reward_amount;
        market.treasury_amount = market.treasury_amount + (previous_round.total_amount - reward_amount);
    }

    /// Place a bull bet
    public fun bet_bull(user: &signer, amount: Coin<AptosCoin>) acquires PredictionMarket, UserBets {
        bet_internal(user, amount, true)
    }

    /// Place a bear bet
    public fun bet_bear(user: &signer, amount: Coin<AptosCoin>) acquires PredictionMarket, UserBets {
        bet_internal(user, amount, false)
    }

    /// Internal function to handle betting
    fun bet_internal(user: &signer, amount: Coin<AptosCoin>, is_bull: bool) acquires PredictionMarket, UserBets {
        let user_addr = signer::address_of(user);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(!market.paused, ERROR_NOT_INITIALIZED);
        let current_round = vector::borrow_mut(&mut market.rounds, market.current_epoch - 1);
        
        assert!(is_round_bettable(current_round), ERROR_ROUND_NOT_BETTABLE);
        assert!(coin::value(&amount) >= market.min_bet_amount, ERROR_INSUFFICIENT_BET);

        // Update round data
        let bet_amount = coin::value(&amount);
        current_round.total_amount = current_round.total_amount + bet_amount;
        if (is_bull) {
            current_round.bull_amount = current_round.bull_amount + bet_amount;
        } else {
            current_round.bear_amount = current_round.bear_amount + bet_amount;
        };

        // Update user data
        if (!exists<UserBets>(user_addr)) {
            move_to(user, UserBets { bets: vector::empty() });
        };
        let user_bets = borrow_global_mut<UserBets>(user_addr);
        vector::push_back(&mut user_bets.bets, UserBet {
            epoch: current_round.epoch,
            position: is_bull,
            amount: bet_amount,
            claimed: false,
        });

        // Transfer the bet amount to the contract
        coin::deposit(@admin, amount);
    }

    /// Claim rewards for a specific epoch
    public fun claim(user: &signer, epoch: u64) acquires PredictionMarket, UserBets {
        let user_addr = signer::address_of(user);
        let market = borrow_global<PredictionMarket>(@admin);
        
        assert!(epoch < market.current_epoch - 1, ERROR_ROUND_NOT_ENDED);
        let round = vector::borrow(&market.rounds, epoch - 1);
        assert!(round.oracle_called, ERROR_ROUND_NOT_ENDED);

        let user_bets = borrow_global_mut<UserBets>(user_addr);
        let user_bet_opt = find_user_bet(&mut user_bets.bets, epoch);
        assert!(option::is_some(&user_bet_opt), ERROR_NOT_CLAIMABLE);

        let user_bet = option::borrow_mut(&mut user_bet_opt);
        assert!(!user_bet.claimed, ERROR_ALREADY_CLAIMED);

        let reward_amount = if ((round.close_price > round.lock_price && user_bet.position) ||
                                (round.close_price < round.lock_price && !user_bet.position)) {
            (user_bet.amount * round.reward_amount) / round.reward_base_cal_amount
        } else {
            0
        };

        user_bet.claimed = true;

        if (reward_amount > 0) {
            let reward_coins = coin::withdraw<AptosCoin>(&market.admin, reward_amount);
            coin::deposit(user_addr, reward_coins);
        };
    }

    /// Claim treasury
    public fun claim_treasury(admin: &signer) acquires PredictionMarket {
        let admin_addr = signer::address_of(admin);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(admin_addr == market.admin, ERROR_NOT_ADMIN);

        let amount = market.treasury_amount;
        market.treasury_amount = 0;

        let treasury_coins = coin::withdraw<AptosCoin>(&market.admin, amount);
        coin::deposit(admin_addr, treasury_coins);
    }

    /// Pause the contract
    public fun pause(admin: &signer) acquires PredictionMarket {
        let admin_addr = signer::address_of(admin);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(admin_addr == market.admin, ERROR_NOT_ADMIN);
        market.paused = true;
    }

    /// Unpause the contract
    public fun unpause(admin: &signer) acquires PredictionMarket {
        let admin_addr = signer::address_of(admin);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(admin_addr == market.admin, ERROR_NOT_ADMIN);
        market.paused = false;
    }

    /// Set minimum bet amount
    public fun set_min_bet_amount(admin: &signer, amount: u64) acquires PredictionMarket {
        let admin_addr = signer::address_of(admin);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(admin_addr == market.admin, ERROR_NOT_ADMIN);
        market.min_bet_amount = amount;
    }

    /// Set treasury fee
    public fun set_treasury_fee(admin: &signer, fee: u64) acquires PredictionMarket {
        let admin_addr = signer::address_of(admin);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(admin_addr == market.admin, ERROR_NOT_ADMIN);
        assert!(fee <= MAX_TREASURY_FEE, ERROR_INVALID_EPOCH);
        market.treasury_fee = fee;
    }

    /// Set operator
    public fun set_operator(admin: &signer, new_operator: address) acquires PredictionMarket {
        let admin_addr = signer::address_of(admin);
        let market = borrow_global_mut<PredictionMarket>(@admin);
        
        assert!(admin_addr == market.admin, ERROR_NOT_ADMIN);
        market.operator = new_operator;
    }

    /// Helper function to check if a round is bettable
    fun is_round_bettable(round: &Round): bool {
        let current_timestamp = timestamp::now_seconds();
        current_timestamp > round.start_timestamp && current_timestamp < round.lock_timestamp
    }

    /// Helper function to find a user's bet for a specific epoch
    fun find_user_bet(bets: &mut vector<UserBet>, epoch: u64): Option<UserBet> {
        let i = 0;
        let len = vector::length(bets);
        while (i < len) {
            let bet = vector::borrow(bets, i);
            if (bet.epoch == epoch) {
                return option::some(*bet)
            };
            i = i + 1;
        };
        option::none<UserBet>()
    }

    // Add any additional helper functions or public views as needed
}