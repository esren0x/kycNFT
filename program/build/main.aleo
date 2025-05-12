program nftonaleokyc_v12.aleo;

struct KYCData:
    metadata as [field; 4u32];
    kyc_level as u8;
    expiry_date as u64;
    name as [field; 4u32];

record NFT:
    owner as address.private;
    edition as scalar.private;
    data as KYCData.private;
    mint_height as u64.private;

struct TokenData:
    holder as address;
    edition as scalar;
    kyc_level as u8;
    expiry_date as u64;
    is_verified as boolean;
    name as [field; 4u32];
    mint_height as u64;

mapping nft_commits:
    key as field.public;
    value as boolean.public;

mapping nft_owners:
    key as field.public;
    value as address.public;

mapping token_count:
    key as address.public;
    value as u64.public;

mapping kyc_expiry_date:
    key as field.public;
    value as u64.public;

mapping kyc_level_map:
    key as field.public;
    value as u8.public;

mapping all_tokens:
    key as u64.public;
    value as field.public;

mapping total_supply:
    key as u8.public;
    value as u64.public;

mapping address_token_validity:
    key as field.public;
    value as boolean.public;

mapping token_mint_heights:
    key as field.public;
    value as u64.public;

mapping latest_token:
    key as address.public;
    value as field.public;

function mint:
    input r0 as address.public;
    input r1 as u8.public;
    assert.eq self.caller aleo1tj9u8djylrzjgp9ekte6t06246wggu04vtuyu2jwmu74vwym6ugse0akzr;
    is.eq r1 1u8 into r2;
    is.eq r1 2u8 into r3;
    or r2 r3 into r4;
    is.eq r1 3u8 into r5;
    or r4 r5 into r6;
    assert.eq r6 true;
    cast  75field 89field 67field 0field into r7 as [field; 4u32];
    cast  75field 89field 67field 0field into r8 as [field; 4u32];
    cast r7 r1 0u64 r8 into r9 as KYCData;
    cast r0 0scalar r9 0u64 into r10 as NFT.record;
    async mint r0 r1 into r11;
    output r10 as NFT.record;
    output r11 as nftonaleokyc_v12.aleo/mint.future;

finalize mint:
    input r0 as address.public;
    input r1 as u8.public;
    cast block.height into r2 as u64;
    add r2 5184000u64 into r3;
    get.or_use total_supply[0u8] 0u64 into r4;
    lt r4 1000000000u64 into r5;
    assert.eq r5 true;
    cast r4 into r6 as scalar;
    cast r1 into r7 as u64;
    cast  r7 r3 into r8 as [u64; 2u32];
    hash.bhp256 r8 into r9 as field;
    commit.bhp256 r9 r6 into r10 as field;
    get.or_use nft_commits[r10] false into r11;
    not r11 into r12;
    assert.eq r12 true;
    set true into nft_commits[r10];
    set r0 into nft_owners[r10];
    set r3 into kyc_expiry_date[r10];
    set r1 into kyc_level_map[r10];
    set true into address_token_validity[r10];
    set r2 into token_mint_heights[r10];
    set r10 into latest_token[r0];
    get.or_use token_count[r0] 0u64 into r13;
    add r13 1u64 into r14;
    set r14 into token_count[r0];
    add r4 1u64 into r15;
    set r15 into total_supply[0u8];
    set r10 into all_tokens[r4];

function verify_kyc:
    input r0 as address.public;
    async verify_kyc r0 into r1;
    output true as boolean.private;
    output r1 as nftonaleokyc_v12.aleo/verify_kyc.future;

finalize verify_kyc:
    input r0 as address.public;
    cast block.height into r1 as u64;
    get.or_use token_count[r0] 0u64 into r2;
    gt r2 0u64 into r3;
    assert.eq r3 true;
    get latest_token[r0] into r4;
    get address_token_validity[r4] into r5;
    assert.eq r5 true;
    get kyc_expiry_date[r4] into r6;
    lte r1 r6 into r7;
    assert.eq r7 true;

function get_total_supply:
    async get_total_supply into r0;
    output 0u64 as u64.private;
    output r0 as nftonaleokyc_v12.aleo/get_total_supply.future;

finalize get_total_supply:
    get.or_use total_supply[0u8] 0u64 into r0;
    lte r0 1000000000u64 into r1;
    assert.eq r1 true;
    get total_supply[0u8] into r2;
    assert.eq r0 r2;

function get_token_data:
    input r0 as field.private;
    cast  75field 89field 67field 0field into r1 as [field; 4u32];
    cast self.caller 0scalar 0u8 0u64 false r1 0u64 into r2 as TokenData;
    async get_token_data r0 into r3;
    output r2 as TokenData.private;
    output r3 as nftonaleokyc_v12.aleo/get_token_data.future;

finalize get_token_data:
    input r0 as field.public;
    get.or_use nft_commits[r0] false into r1;
    assert.eq r1 true;
    contains nft_owners[r0] into r2;
    assert.eq r2 true;
    contains kyc_level_map[r0] into r3;
    assert.eq r3 true;
    contains kyc_expiry_date[r0] into r4;
    assert.eq r4 true;

function get_token_by_index:
    input r0 as u64.private;
    async get_token_by_index r0 into r1;
    output 0field as field.private;
    output r1 as nftonaleokyc_v12.aleo/get_token_by_index.future;

finalize get_token_by_index:
    input r0 as u64.public;
    get.or_use total_supply[0u8] 0u64 into r1;
    lt r0 r1 into r2;
    assert.eq r2 true;
    get all_tokens[r0] into r3;
    get.or_use nft_commits[r3] false into r4;
    assert.eq r4 true;

function get_holder_token_count:
    input r0 as address.private;
    async get_holder_token_count r0 into r1;
    output 0u64 as u64.private;
    output r1 as nftonaleokyc_v12.aleo/get_holder_token_count.future;

finalize get_holder_token_count:
    input r0 as address.public;
    get.or_use token_count[r0] 0u64 into r1;
    gte r1 0u64 into r2;
    assert.eq r2 true;

function transfer:
    input r0 as NFT.record;
    input r1 as address.public;
    async transfer self.caller into r2;
    output r0 as NFT.record;
    output r2 as nftonaleokyc_v12.aleo/transfer.future;

finalize transfer:
    input r0 as address.public;
    assert.eq false true;
