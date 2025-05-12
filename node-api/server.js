import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  Account,
  AleoNetworkClient,
  NetworkRecordProvider,
  ProgramManager,
  AleoKeyProvider
} from '@provablehq/sdk';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TESTNET_URL = "https://api.explorer.provable.com/v1";


app.post('/mint', async (req, res) => {
  try {
    const { walletAddress, kycLevel } = req.body;
    console.log("walletAddress:", walletAddress);
    console.log("kycLevel:", kycLevel);
    console.log("Program ID:", process.env.PUBLIC_PROGRAM_ID);
    console.log("Private Key:", process.env.PROVABLE_PRIVATE_KEY);
    
    if (!walletAddress || typeof kycLevel !== 'number') {
      return res.status(400).json({ error: 'walletAddress and kycLevel are required' });
    }
    if (!process.env.PROVABLE_PRIVATE_KEY) {
      return res.status(500).json({ error: 'PROVABLE_PRIVATE_KEY is not set in environment variables' });
    }
    if (!process.env.PUBLIC_PROGRAM_ID) {
      return res.status(500).json({ error: 'PUBLIC_PROGRAM_ID is not set in environment variables' });
    }

    const programId = process.env.PUBLIC_PROGRAM_ID;
    const aleoFunction = "mint";
    const privateKey = process.env.PROVABLE_PRIVATE_KEY;



    // const keyProvider = new AleoKeyProvider();
    // keyProvider.useCache = true;
    const account = new Account({ privateKey: privateKey });
    // const privateKeyObject = PrivateKey.from_string(privateKey);
    
    const networkClient = new AleoNetworkClient(TESTNET_URL);
    // const recordProvider = new NetworkRecordProvider(account, networkClient);
    // const keyProvider = new AleoKeyProvider();
    // keyProvider.useCache = true;
    const programManager = new ProgramManager(TESTNET_URL);
    programManager.setHost(TESTNET_URL);
    programManager.setAccount(account);

    // For example: "cacheKey": "hello_hello:hello"
    const cacheKey = `${programId}:${aleoFunction}`;
    // const keySearchParams = new AleoKeyProviderParams({ "cacheKey": cacheKey });


    const inputs = [
      walletAddress,
      `${kycLevel}u8`
    ];

    const executionResponse = await programManager.execute({
      programName: programId,
      functionName: aleoFunction,
      priorityFee: 0.1,
      privateFee: false,
      inputs: inputs,
      // keySearchParams: keySearchParams
    });


    const transaction = await programManager.networkClient.getTransaction(executionResponse);





    res.json({ success: true, transactionId: transaction });
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