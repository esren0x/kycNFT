# Verifaleo

A decentralized KYC verification system built on the Aleo blockchain, enabling secure and reusable identity verification across the Aleo ecosystem.

https://verifaleo.vercel.app/

## Quick Links

- [Demo](https://verifaleo.vercel.app/)
- [Testnet Deployment](#program)
- [Application](#application)
- [Node API](#node-api)

## Program

The Aleo program that handles the KYC NFT minting and verification logic.

### Contract Addresses
- Mainnet: https://beta.explorer.provable.com/program/nftonaleokyc_v12.aleo
- Testnet: https://testnet.explorer.provable.com/program/nftonaleokyc_v12.aleo

### Setup
```bash
cd program
leo build
```

## Application

The full-stack application consisting of a Next.js frontend and API endpoints for KYC verification.

### Live Demo
Visit [https://verifaleo.vercel.app/](https://verifaleo.vercel.app/)

### Local Development
```bash
cd application

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_PROGRAM_ID=your_program_id
NODE_API_URL=your_node_api_url
```

## Node API

A separate Node.js API service that handles the minting and proving operations for the KYC NFTs.

### Setup
```bash
cd node-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the server
npm start
```

### Environment Variables
```env
PROVABLE_PRIVATE_KEY=your_private_key
PUBLIC_PROGRAM_ID=your_program_id
PORT=3001
```

### API Endpoints

#### POST /mint
Mints a new KYC NFT for a verified wallet.
Demo of the API: https://verifaleo.vercel.app/api/verify?wallet=aleo1zl0lc5806yykafjvnmr2u0te3pztwran387rxf40r5uem9e7puzsljpsu3


Request:
```json
{
  "walletAddress": "aleo1...",
  "kycLevel": 1
}
```

Response:
```json
{
  "success": true,
  "transactionId": "tx_id..."
}
```


