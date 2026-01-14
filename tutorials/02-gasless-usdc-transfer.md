# Tutorial 2: Building Gasless Transactions on Solana

This tutorial demonstrates how to send a sponsored gasless transaction using the Lazorkit SDK.

## 1. Paymaster Integration

Lazorkit's **Paymaster** infrastructure allows you (the developer) to sponsor transaction fees.

## 2. Creating the Instruction

We use standard `@solana/spl-token` and `@solana/web3.js`.

```tsx
import { createTransferInstruction, getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';

// ... inside your component
const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'); // Devnet USDC

// 1. Get Source and Destination ATAs
const sourceAta = await getAssociatedTokenAddress(USDC_MINT, smartWalletPubkey, true);
const destAta = await getAssociatedTokenAddress(USDC_MINT, recipientPubkey, true);

// 2. Create Instruction (Standard SPL)
const transferIx = createTransferInstruction(
    sourceAta,
    destAta,
    smartWalletPubkey, // Owner is the Smart Wallet
    amountBigInt
);
```

## 3. Signing & Sending

Use `signAndSendTransaction` from `useWallet()`.

```tsx
const { signAndSendTransaction } = useWallet();

try {
    // The SDK automatically:
    // 1. Builds the transaction
    // 2. Proxies to Paymaster for sponsorship
    // 3. Signs with session key
    // 4. Submits to RPC
    const signature = await signAndSendTransaction({ 
        instructions: [transferIx] 
    });
    
    console.log("Transaction confirmed:", signature);
} catch (error) {
    console.error("Transaction rejected:", error);
}
```
