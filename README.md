# Lazorkit Wallet Example

A simple Next.js app showing how to use Lazorkit SDK to build a Solana wallet with passkeys.

## What This Does

- Creates wallets using biometric login (no seed phrases)
- Sends SOL and USDC without gas fees
- Shows transaction history
- Works in any browser

## What You'll Learn

- How to set up Lazorkit in Next.js
- How to connect users with passkeys
- How to send gasless transactions
- How to check wallet balances

## Quick Start

```bash
git clone https://github.com/lazor-labs/lazorpass.git
cd lazorpass
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

- `app/page.tsx`: Landing page with simpler "Connect" flow
- `components/PasskeyConnect.tsx`: Handles biometric auth
- `components/SendUSDC.tsx`: Handles gasless transfers
