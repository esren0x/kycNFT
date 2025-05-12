import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager
} from '@provablehq/sdk';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TESTNET_URL = "https://api.explorer.provable.com/v1/";


app.post('/mint', async (req, res) => {
  try {
    const { walletAddress, kycLevel } = req.body;
    console.log("walletAddress:", walletAddress);
    console.log("kycLevel:", kycLevel);
    if (!walletAddress || typeof kycLevel !== 'number') {
      return res.status(400).json({ error: 'walletAddress and kycLevel are required' });
    }
    if (!process.env.PROVABLE_PRIVATE_KEY) {
      return res.status(500).json({ error: 'PROVABLE_PRIVATE_KEY is not set in environment variables' });
    }
    if (!process.env.PUBLIC_PROGRAM_ID) {
      return res.status(500).json({ error: 'PUBLIC_PROGRAM_ID is not set in environment variables' });
    }
    console.log("Program ID:", process.env.PUBLIC_PROGRAM_ID);
    console.log("Private Key:", process.env.PROVABLE_PRIVATE_KEY);
    const account = new Account({ privateKey: process.env.PROVABLE_PRIVATE_KEY });
    const networkClient = new AleoNetworkClient(TESTNET_URL);
    const recordProvider = new NetworkRecordProvider(account, networkClient);
    const programManager = new ProgramManager(TESTNET_URL, undefined, recordProvider);
    programManager.setHost(TESTNET_URL);
    programManager.setAccount(account);
    const inputs = [
      walletAddress,
      `${kycLevel}u8`
    ];
    const tx_id = await programManager.execute({
      programName: process.env.PUBLIC_PROGRAM_ID,
      functionName: "mint",
      priorityFee: 0.1,
      privateFee: false,
      inputs: inputs
    });
    res.json({ success: true, transactionId: tx_id });
  } catch (error) {
    console.error("Full error:", error);
    console.error("Error as JSON:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ success: false, error: error.message, details: error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Node API listening on port ${PORT}`);
});