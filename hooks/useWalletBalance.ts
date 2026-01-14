import { useState, useEffect, useCallback, useRef } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { LAZORKIT_CONFIG } from '@/lib/lazorkit-config';

// Note: This is the mainnet USDC address - may not have tokens on devnet
const USDC_MINT_DEVNET = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

export function useWalletBalance(publicKey: PublicKey | null) {
    const [solBalance, setSolBalance] = useState<number>(0);
    const [usdcBalance, setUsdcBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const isFetchingRef = useRef(false);
    const hasLoadedRef = useRef(false);

    const fetchBalances = useCallback(async () => {
        if (!publicKey) {
            setSolBalance(0);
            setUsdcBalance(0);
            setIsLoading(false);
            hasLoadedRef.current = true;
            return;
        }

        // Prevent duplicate fetches
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        // Only show loading on very first fetch
        if (!hasLoadedRef.current) {
            setIsLoading(true);
        }
        setError(null);

        try {
            const connection = new Connection(LAZORKIT_CONFIG.rpcUrl, 'confirmed');

            // Fetch SOL Balance first (this is more reliable)
            try {
                const balance = await connection.getBalance(publicKey);
                setSolBalance(balance / LAMPORTS_PER_SOL);
            } catch (solErr) {
                console.warn('Failed to fetch SOL balance:', solErr);
                // Keep previous balance on error
            }

            // Wait a bit before USDC fetch to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));

            // Fetch USDC Balance (may fail on devnet if no tokens exist)
            try {
                const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
                    publicKey,
                    { mint: new PublicKey(USDC_MINT_DEVNET) }
                );

                let totalUsdc = 0;
                for (const { account } of tokenAccounts.value) {
                    const parsedInfo = account.data.parsed.info;
                    const uiAmount = parsedInfo.tokenAmount.uiAmount;
                    if (uiAmount) {
                        totalUsdc += uiAmount;
                    }
                }
                setUsdcBalance(totalUsdc);
            } catch (usdcErr) {
                console.warn('Failed to fetch USDC balance (may not exist on devnet):', usdcErr);
                // Keep USDC at 0 or previous value - this is expected on devnet
            }

            hasLoadedRef.current = true;
        } catch (err) {
            console.error('Failed to fetch balances:', err);
            setError('Network error');
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, [publicKey]);

    // Initial fetch with delay to avoid rate limiting during mount
    useEffect(() => {
        const timeout = setTimeout(fetchBalances, 500);
        return () => clearTimeout(timeout);
    }, [fetchBalances]);

    return { solBalance, usdcBalance, isLoading, error, refetch: fetchBalances };
}

