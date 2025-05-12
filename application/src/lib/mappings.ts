import { PROGRAM_ID } from "../app/constants";

interface MappingItem {
  key: string;
  value: string;
}

export type OwnerInformation = {
  ownerId: string;
  hasNFT: boolean;
  expirationBlock: number | null;
  walletAddress: string;
  kycProvider: string;
};

export const getOwnerIdFromMapping = async (walletAddress: string) => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/nft_owners`
  );
  const data = await response.json();

  //response: {"result":[{"key":"2279379920989854330923140866036463803122508934459349902748446721113771297556field","value":"aleo1xjq48lapjm8mnklr97clfktsl7ddh23jjvjkznl8e9qdajf0lc9q3w5ea3"},{"key":"7716021543827584735088846097352185901935192404164267147972454864599550586848field","value":"aleo1xjq48lapjm8mnklr97clfktsl7ddh23jjvjkznl8e9qdajf0lc9q3w5ea3"}],"cursor":3208318}

  return data.result.find((item: MappingItem) => item.value === walletAddress)
    ?.key;
};

export const checkIfHasNFT = async (ownerId: string) => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/address_token_validity`
  );

  // Response: {"result":[{"key":"2279379920989854330923140866036463803122508934459349902748446721113771297556field","value":"true"},{"key":"7716021543827584735088846097352185901935192404164267147972454864599550586848field","value":"true"}],"cursor":3208321}

  const data = await response.json();
  return data.result.find((item: MappingItem) => item.key === ownerId)?.value;
};

export const getNFTExpirationBlock = async (ownerId: string) => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/kyc_expiry_date`
  );
  const data = await response.json();
  const value = data.result.find(
    (item: MappingItem) => item.key === ownerId
  )?.value;
  if (!value) return null;
  // Remove 'u64' suffix and convert to integer
  return parseInt(value.replace("u64", ""));
};

export const getAllOwnersInformation = async (): Promise<
  OwnerInformation[]
> => {
  const response = await fetch(
    `https://api.testnet.aleoscan.io/v2/mapping/list_program_mapping_values/${PROGRAM_ID}/nft_owners`
  );
  const data = await response.json();
  const owners = data.result;

  const ownersWithInformation = await Promise.all(
    owners.map(async (owner: MappingItem) => {
      const ownerId = owner.key;
      const hasNFT = await checkIfHasNFT(ownerId);
      const expirationBlock = await getNFTExpirationBlock(ownerId);
      return {
        ownerId,
        hasNFT,
        expirationBlock,
        walletAddress: owner.value,
        kycProvider: "Sumsub",
      };
    })
  );

  return ownersWithInformation;
};
