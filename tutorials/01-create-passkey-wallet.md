# Tutorial 1: Implementing Passkey Authentication with Lazorkit

This tutorial explains how to set up the Lazorkit SDK and create a passkey-based smart wallet on Solana.

## 1. Provider Setup

Wrap your application with `LazorkitProvider`. This handles the context for all wallet interactions.

```tsx
// app/providers.tsx
"use client";
import { LazorkitProvider } from '@lazorkit/wallet';

const LAZORKIT_CONFIG = {
  rpcUrl: 'https://api.devnet.solana.com',
  portalUrl: 'https://portal.lazor.sh',
  paymasterConfig: {
    paymasterUrl: 'https://kora.devnet.lazorkit.com'
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazorkitProvider
      rpcUrl={LAZORKIT_CONFIG.rpcUrl}
      portalUrl={LAZORKIT_CONFIG.portalUrl}
      paymasterConfig={LAZORKIT_CONFIG.paymasterConfig}
    >
      {children}
    </LazorkitProvider>
  );
}
```

## 2. The `useWallet` Hook

The SDK exposes a simple hook to manage the wallet state.

```tsx
import { useWallet } from '@lazorkit/wallet';

export default function ConnectButton() {
  const { 
    connect,          // Function to trigger passkey creation/login
    isConnecting,     // Loading state
    smartWalletPubkey // The resulting wallet address (PublicKey)
  } = useWallet();

  return (
    <button onClick={() => connect()} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect with Passkey"}
    </button>
  );
}
```

## 3. Architecture

1.  **WebAuthn Integration**: `connect()` triggers the browser's credential API.
2.  **Key Generaton**: A key pair is generated in the Secure Enclave.
3.  **PDA Derivation**: Lazorkit derives a deterministic Smart Account address from the public key.
4.  **Session Management**: The SDK maintains a local session for signing until expiration.
