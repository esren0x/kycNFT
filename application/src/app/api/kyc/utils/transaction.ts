import axios from 'axios';

const NODE_API_URL = process.env.NODE_API_URL || 'http://localhost:3001';

export async function executeMintTransaction(
  walletAddress: string,
  kycLevel: number
): Promise<string> {
  try {
    const response = await axios.post(`${NODE_API_URL}/mint`, {
      walletAddress,
      kycLevel
    });
    if (response.data && response.data.success && response.data.transactionId) {
      return response.data.transactionId;
    } else {
      throw new Error(response.data?.error || 'Unknown error from node-api');
    }
  } catch (error) {
    console.error('Failed to call node-api /mint:', error);
    throw error;
  }
} 