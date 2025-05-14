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

export const fetchAllMappingValues = async (
  mapping: string
): Promise<MappingItem[]> => {
  try {
    const response = await fetch(
      `/api/aleoscan?path=mapping&programId=${PROGRAM_ID}&mapping=${mapping}&all=true`
    );
    const data = await response.json();
    return Array.isArray(data.result) ? data.result : [];
  } catch (error) {
    console.error(`Error fetching all ${mapping} mapping values:`, error);
    return [];
  }
};

export const getOwnerIdFromMapping = async (walletAddress: string) => {
  const data = await fetchAllMappingValues("nft_owners");
  return data.find((item: MappingItem) => item.value === walletAddress)?.key;
};

export const checkIfHasNFT = async (ownerId: string) => {
  const data = await fetchAllMappingValues("address_token_validity");
  const item = data.find((item: MappingItem) => item.key === ownerId);
  return item?.value === "true";
};

export const getNFTExpirationBlock = async (ownerId: string) => {
  const data = await fetchAllMappingValues("kyc_expiry_date");
  const value = data.find((item: MappingItem) => item.key === ownerId)?.value;
  if (!value) return null;
  // Remove 'u64' suffix and convert to integer
  return parseInt(value.replace("u64", ""));
};

export const getAllOwnersInformation = async (): Promise<
  OwnerInformation[]
> => {
  try {
    const owners = await fetchAllMappingValues("nft_owners");
    const expirationDates = await fetchAllMappingValues("kyc_expiry_date");
    const tokenValidities = await fetchAllMappingValues(
      "address_token_validity"
    );
    if (!owners.length) return [];

    const ownersWithInformation = await Promise.all(
      owners.map(async (owner: MappingItem) => {
        const ownerId = owner.key;
        const hasNFT =
          tokenValidities.find((item: MappingItem) => item.key === ownerId)
            ?.value === "true";
        const expiryValue = expirationDates.find(
          (item: MappingItem) => item.key === ownerId
        )?.value;
        const expirationBlock = expiryValue
          ? parseInt(expiryValue.replace("u64", ""))
          : null;
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
  } catch (error) {
    console.error("Error getting all owners information:", error);
    return [];
  }
};
