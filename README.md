# Lazorkit Wallet Demo

🔗 **Live Demo:** [lazor-pass-demo.vercel.app](https://lazor-pass-demo.vercel.app)

A Next.js starter template demonstrating Lazorkit SDK integration for building passkey-native Solana applications.

## Overview

This project shows how to integrate Lazorkit SDK into a web application to enable:
- Passkey-based wallet creation (no seed phrases)
- Gasless token transfers using paymaster
- Smart wallet management on Solana Devnet

Built for the Lazorkit Bounty Program as a practical reference for developers.

## Features

- ✅ **Biometric Authentication** - Create wallets using Face ID, Touch ID, or Windows Hello
- ✅ **Gasless Transactions** - Send SOL and USDC without holding SOL for fees
- ✅ **Smart Wallets** - PDA-based accounts with session persistence
- ✅ **Transaction History** - View past transactions with Solana Explorer links
- ✅ **Devnet Testing** - Request test tokens via airdrop

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **SDK:** @lazorkit/wallet
- **Blockchain:** Solana Devnet

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Wesley101-collab/LazorPassDemo.git
cd LazorPassDemo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Setup

The project uses hardcoded Devnet configuration. No environment variables are required for local development.

Default configuration:
- RPC: `https://api.devnet.solana.com`
- Portal: `https://portal.lazor.sh`
- Paymaster: `https://kora.devnet.lazorkit.com`

## Project Structure
```
LazorPassDemo/
├── app/
│   ├── page.tsx              # Landing page
│   ├── wallet/page.tsx       # Main wallet interface
│   ├── providers.tsx         # Lazorkit provider setup
│   └── layout.tsx            # Root layout
├── components/
│   ├── PasskeyConnect.tsx    # Passkey connection component
│   ├── WalletDisplay.tsx     # Balance and address display
│   ├── SendUSDC.tsx          # Token transfer form
│   └── TransactionHistory.tsx # Transaction list
├── lib/
│   ├── lazorkit-config.ts    # SDK configuration
│   └── utils.ts              # Helper functions
├── hooks/
│   └── useWalletBalance.ts   # Balance fetching hook
└── tutorials/
    ├── 01-create-passkey-wallet.md  # Creating passkey wallets
    └── 02-gasless-usdc-transfer.md  # Sending gasless transactions
```

## How It Works

### 1. Passkey Authentication
Users create a wallet by clicking "Create Wallet" which triggers their device's biometric prompt. The wallet credentials are stored in the device's secure hardware.

### 2. Smart Wallet Creation
Lazorkit creates a Program Derived Address (PDA) on Solana that serves as the user's wallet. This smart wallet enables features like key rotation and recovery.

### 3. Gasless Transactions
When sending tokens, the transaction is routed through Lazorkit's paymaster service which covers the SOL network fees. Users can transact without holding SOL.

## Key Code Examples

### Setting Up Provider
```tsx
import { LazorkitProvider } from '@lazorkit/wallet';

export function Providers({ children }) {
  return (
    <LazorkitProvider
      rpcUrl="https://api.devnet.solana.com"
      portalUrl="https://portal.lazor.sh"
      paymasterConfig={{
        paymasterUrl: "https://kora.devnet.lazorkit.com"
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

### Connecting with Passkey
```tsx
import { useWallet } from '@lazorkit/wallet';

export function ConnectButton() {
  const { connect, isConnecting } = useWallet();

  return (
    <button onClick={connect} disabled={isConnecting}>
      {isConnecting ? 'Connecting...' : 'Create Wallet'}
    </button>
  );
}
```

### Sending Gasless Transaction
```tsx
import { useWallet } from '@lazorkit/wallet';
import { SystemProgram, PublicKey } from '@solana/web3.js';

const { smartWalletPubkey, signAndSendTransaction } = useWallet();

// Create transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey(recipientAddress),
  lamports: amount
});

// Sign and send (paymaster covers fees)
const signature = await signAndSendTransaction(instruction);
```

## Tutorials

Detailed step-by-step guides are available in the `/tutorials` folder:

1. **[Creating a Passkey Wallet](./tutorials/01-create-passkey-wallet.md)** - Learn how to set up Lazorkit provider and implement passkey authentication
2. **[Sending Gasless Transactions](./tutorials/02-gasless-usdc-transfer.md)** - Understand paymaster integration and transaction signing

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Follow the prompts and your app will be live at a `vercel.app` URL.

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

## Testing

1. **Create Wallet**: Click "Create Wallet" on the homepage
2. **Request Airdrop**: Get test SOL and USDC from the wallet page
3. **Send Transaction**: Transfer tokens to another address
4. **View History**: Check transaction status and view on Solana Explorer

### Test Addresses (for sending tokens)

You can send test transactions to these addresses:
```
9vHyR8tNp2Xs4Lm6Kj3Qw1Zc5Yt7Bn9Df2Gu4Sv8Wx6Rk1
7xKzL3kVkqmP3aT9Wn2Yd1Rf5Hs8Jt6Uv4Bw9Cx2Gp1Mq3
```

## Resources

- **Lazorkit Documentation:** https://docs.lazorkit.com
- **Solana Documentation:** https://docs.solana.com
- **WebAuthn Guide:** https://webauthn.guide
- **Passkeys Overview:** https://passkeys.dev

## Bounty Submission

This project was created for the Lazorkit Bounty Program (December 2024 - January 2025).

**Submission includes:**
- ✅ Working example repository
- ✅ Live demo on Devnet
- ✅ Clear README with setup instructions
- ✅ Two step-by-step tutorials
- ✅ Well-documented code with comments
- ✅ Clean project structure

## Contributing

This is a reference implementation for educational purposes. Feel free to:
- Fork and modify for your own projects
- Submit issues for bugs or improvements
- Use as a starting point for Lazorkit integration

## License

MIT License - feel free to use this code in your own projects.

## Contact

- **GitHub:** [@Wesley101-collab](https://github.com/Wesley101-collab)

## Acknowledgments

Built with [Lazorkit SDK](https://lazorkit.com) for the Solana ecosystem.
