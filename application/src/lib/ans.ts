import { ANS_API_URL } from "../app/constants";

export const convertANSDomainToWalletAddress = async (name: string) => {
  console.log("Converting ANS domain to wallet address:", name);
  try {
    const response = await fetch(`${ANS_API_URL}address/${name}`);
    const { address } = await response.json();
    return address;
  } catch (error) {
    console.error("Error converting ANS domain to wallet address:", error);
    return undefined;
  }
};

export const convertLeoAddressToANSDomain = async (address: string) => {
  console.log("Converting Leo address to ANS domain:", address);
  try {
    const response = await fetch(`${ANS_API_URL}primary_name/${address}`);
    if (!response.ok) {
      console.debug("No ANS domain found for the given address:", address);
      return undefined;
    }
    const body = await response.json();
    return body.name;
  } catch (error) {
    console.debug("No ANS domain found for the given address:", error);
    return undefined;
  }
};
