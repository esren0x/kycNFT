// KYC NFT Program - ARC721 Compliant with KYC Verification
program nftonaleokyc_v12.aleo {
    // Authorized minter address - only this address can mint KYC NFTs
    const AUTHORIZED_MINTER: address = aleo1tj9u8djylrzjgp9ekte6t06246wggu04vtuyu2jwmu74vwym6ugse0akzr;
    const TOTAL_SUPPLY: u128 = 1000000000u128;
    const SOULBOUND_ERROR: field = 1field;

    // Default metadata strings (ASCII encoded)
    const DEFAULT_NAME: [field; 4] = [
        75field, // K
        89field, // Y
        67field, // C
        0field   // null terminator
    ];

    // Standardized ARC721 data structures
    struct KYCData {
        metadata: [field; 4],  // Standard ARC721 metadata field
        kyc_level: u8,         // KYC specific attributes
        expiry_date: u64,
        name: [field; 4]
    }

    // NFT Record Structure (ARC721 compliant)
    record NFT {
        owner: address,
        edition: scalar,
        data: KYCData,
        mint_height: u64  // Add mint height tracking
    }

    // Public NFT View Structure
    struct TokenData {
        holder: address,
        edition: scalar,
        kyc_level: u8,
        expiry_date: u64,
        is_verified: bool,
        name: [field; 4],
        mint_height: u64  // Add mint height to public view
    }

    // ARC721 Required Mappings with commitment-based tracking
    mapping nft_commits: field => bool;      // NFT commit => NFT exists
    mapping nft_owners: field => address;    // NFT commit => Owner
    mapping token_count: address => u64;     // Owner => Token Count
    
    // KYC Status Mappings
    mapping kyc_expiry_date: field => u64;   // Commit => Expiry Block Height
    mapping kyc_level_map: field => u8;      // Commit => KYC Level (1,2,3)

    // Token Enumeration Mappings
    mapping all_tokens: u64 => field;        // Index => NFT Commit
    mapping total_supply: u8 => u64;         // 0 => Current Total Supply

    // Constants for expiry calculation
    const BLOCKS_PER_MONTH: u64 = 864000u64;  // At 3s per block: (30 days * 24 hours * 60 minutes * 60 seconds) / 3
    const KYC_EXPIRY_BLOCKS: u64 = BLOCKS_PER_MONTH * 6u64;  // 6 months in blocks

    // Replace array tracking with mapping-based tracking
    mapping address_token_validity: field => bool;  // Token commit => Is Valid
    mapping token_mint_heights: field => u64;      // Token commit => Mint height
    mapping latest_token: address => field;        // Address => Latest token commit

    // Commitment-based tracking function (ARC721 standard)
    inline commit_nft(
        kyc_level: u8,
        expiry_date: u64,
        edition: scalar
    ) -> field {
        let kyc_level_u64: u64 = kyc_level as u64;
        let data_hash: field = BHP256::hash_to_field([kyc_level_u64, expiry_date]);
        let commitment: field = BHP256::commit_to_field(data_hash, edition);
        return commitment;
    }

    // Mint new KYC NFT (only by authorized KYC provider)
    async transition mint(
        public receiver: address,
        public kyc_level_input: u8
    ) -> (NFT, Future) {
        // Ensure caller is authorized
        assert_eq(self.caller, AUTHORIZED_MINTER);
        
        // Validate KYC level must be exactly 1, 2, or 3
        assert(kyc_level_input == 1u8 || kyc_level_input == 2u8 || kyc_level_input == 3u8);
        
        // Create temporary NFT record (heights will be set in finalize)
        let kyc_data: KYCData = KYCData {
            metadata: DEFAULT_NAME,
            kyc_level: kyc_level_input,
            expiry_date: 0u64, // Will be set in finalize
            name: DEFAULT_NAME
        };
        
        let nft: NFT = NFT {
            owner: receiver,
            edition: 0scalar, // Will be updated with actual edition in finalize
            data: kyc_data,
            mint_height: 0u64 // Will be set in finalize
        };

        // Create the future for finalization
        let future: Future = finalize_mint(receiver, kyc_level_input);

        return (nft, future);
    }

    async function finalize_mint(
        receiver: address,
        kyc_level_input: u8
    ) {
        // Get current block height and calculate expiry
        let current_height: u64 = block.height as u64;
        let expiry_height: u64 = current_height + KYC_EXPIRY_BLOCKS;
        
        // Get and validate the next edition number
        let current_supply: u64 = total_supply.get_or_use(0u8, 0u64);
        assert(current_supply < (TOTAL_SUPPLY as u64));
        let edition: scalar = current_supply as scalar;
        
        // Create commitment using the edition
        let nft_commit: field = commit_nft(kyc_level_input, expiry_height, edition);
        
        // Ensure NFT doesn't already exist
        assert(!nft_commits.get_or_use(nft_commit, false));
        
        // Update mappings
        nft_commits.set(nft_commit, true);
        nft_owners.set(nft_commit, receiver);
        kyc_expiry_date.set(nft_commit, expiry_height);
        kyc_level_map.set(nft_commit, kyc_level_input);
        
        // Set token as valid and update latest token for address
        address_token_validity.set(nft_commit, true);
        token_mint_heights.set(nft_commit, current_height);
        latest_token.set(receiver, nft_commit);
        
        // Update token count for receiver
        let current_count: u64 = token_count.get_or_use(receiver, 0u64);
        token_count.set(receiver, current_count + 1u64);
        
        // Update total supply
        let new_supply: u64 = current_supply + 1u64;
        total_supply.set(0u8, new_supply);
        
        // Add token to enumeration
        all_tokens.set(current_supply, nft_commit);
    }

    // Verify if an address has valid KYC
    async transition verify_kyc(public address_to_check: address) -> (bool, Future) {
        // Create the future for finalization
        let future: Future = finalize_verify_kyc(address_to_check);
        
        // Return initial result and future - will be updated in finalize
        return (true, future);
    }

    async function finalize_verify_kyc(address_to_check: address) {
        // Get current block height
        let current_height: u64 = block.height as u64;
        
        // Get token count for address
        let count: u64 = token_count.get_or_use(address_to_check, 0u64);
        
        // Must have at least one token
        assert(count > 0u64);

        // Get latest token for address
        let token: field = latest_token.get(address_to_check);
        
        // Check if token is valid
        let is_valid: bool = address_token_validity.get(token);
        assert(is_valid);
        
        // Get expiry height for this token
        let expiry_height: u64 = kyc_expiry_date.get(token);
        
        // Check if token is still valid
        assert(current_height <= expiry_height);
    }

    // Get total supply - returns the current number of minted tokens
    async transition get_total_supply() -> (u64, Future) {
        // Create future for finalization
        let future: Future = finalize_get_total_supply();
        
        // Return 0 initially, actual value will be verified in finalize
        return (0u64, future);
    }

    async function finalize_get_total_supply() {
        // Get and verify the supply
        let supply: u64 = total_supply.get_or_use(0u8, 0u64);
        assert(supply <= (TOTAL_SUPPLY as u64));
        
        // Verify the supply matches what's in storage
        assert_eq(supply, total_supply.get(0u8));
    }

    // Get token data by commitment
    async transition get_token_data(nft_commit: field) -> (TokenData, Future) {
        // Ensure token exists
        let token_data: TokenData = TokenData {
            holder: self.caller,
            edition: 0scalar,
            kyc_level: 0u8,
            expiry_date: 0u64,
            is_verified: false,
            name: DEFAULT_NAME,
            mint_height: 0u64
        };
        return (token_data, finalize_get_token_data(nft_commit));
    }

    async function finalize_get_token_data(nft_commit: field) {
        // Ensure token exists
        assert(nft_commits.get_or_use(nft_commit, false));
        
        // Verify the data exists
        assert(nft_owners.contains(nft_commit));
        assert(kyc_level_map.contains(nft_commit));
        assert(kyc_expiry_date.contains(nft_commit));
    }

    // Get token by index (for enumeration)
    async transition get_token_by_index(index: u64) -> (field, Future) {
        let nft_commit: field = 0field;
        return (nft_commit, finalize_get_token_by_index(index));
    }

    async function finalize_get_token_by_index(index: u64) {
        let total: u64 = total_supply.get_or_use(0u8, 0u64);
        assert(index < total);
        let nft_commit: field = all_tokens.get(index);
        assert(nft_commits.get_or_use(nft_commit, false));
    }

    // Get holder's token count
    async transition get_holder_token_count(holder: address) -> (u64, Future) {
        let count: u64 = 0u64;
        return (count, finalize_get_holder_token_count(holder));
    }

    async function finalize_get_holder_token_count(holder: address) {
        let count: u64 = token_count.get_or_use(holder, 0u64);
        assert(count >= 0u64);
    }

    // Transfer functions (blocked - soulbound NFT)
    async transition transfer(
        private nft: NFT,
        public to: address
    ) -> (NFT, Future) {
        // Return the original NFT - transfers are not allowed
        return (nft, finalize_transfer(self.caller));
    }

    async function finalize_transfer(caller: address) {
        // Assert that this function is never successfully called
        assert(false);
    }
}
