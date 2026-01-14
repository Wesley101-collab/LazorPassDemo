export const LAZORKIT_CONFIG = {
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com',
  portalUrl: process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.lazor.sh',
  paymasterConfig: {
    paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || 'https://kora.devnet.lazorkit.com'
  }
};
