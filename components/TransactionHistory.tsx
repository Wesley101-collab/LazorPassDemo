"use client";
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { Connection, ConfirmedSignatureInfo } from '@solana/web3.js';
import { LAZORKIT_CONFIG } from '@/lib/lazorkit-config';
import { truncateAddress } from '@/lib/utils';
import { ExternalLink, ArrowRightLeft } from 'lucide-react';

export default function TransactionHistory() {
    const { smartWalletPubkey } = useWallet();
    const [history, setHistory] = useState<ConfirmedSignatureInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const isFetchingRef = useRef(false);

    const fetchHistory = useCallback(async () => {
        if (!smartWalletPubkey || isFetchingRef.current) return;

        isFetchingRef.current = true;
        setLoading(true);
        try {
            const connection = new Connection(LAZORKIT_CONFIG.rpcUrl);
            const signatures = await connection.getSignaturesForAddress(
                smartWalletPubkey,
                { limit: 10 }
            );
            setHistory(signatures);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [smartWalletPubkey]);

    useEffect(() => {
        // Delay initial fetch to avoid rate limiting during mount
        const initialTimeout = setTimeout(fetchHistory, 500);
        // Poll every 30 seconds to avoid rate limiting
        const interval = setInterval(fetchHistory, 30000);
        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [fetchHistory]);

    if (!smartWalletPubkey) return null;

    return (
        <div className="mt-12">
            <h2 className="text-lg font-medium text-white mb-6">Your Transactions</h2>

            <div className="space-y-1">
                {loading && history.length === 0 ? (
                    <div className="py-12 text-center text-zinc-600 text-sm">Checking network...</div>
                ) : history.length === 0 ? (
                    <div className="py-12 border border-zinc-800 border-dashed rounded-xl text-center space-y-2">
                        <p className="text-zinc-500 text-sm">Send your first transaction to see it here</p>
                    </div>
                ) : (
                    history.map((tx) => (
                        <a
                            key={tx.signature}
                            href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                                    <ArrowRightLeft className="w-3 h-3" />
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-white mb-0.5">
                                        {tx.err ? 'Failed' : 'Confirmed'}
                                    </div>
                                    <div className="text-xs text-zinc-500 font-mono">
                                        {tx.blockTime ? (
                                            <span suppressHydrationWarning>
                                                {new Date(tx.blockTime * 1000).toLocaleDateString()}
                                            </span>
                                        ) : ''}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${tx.err ? 'border-red-900/50 text-red-700' : 'border-emerald-900/30 text-emerald-600'}`}>
                                    {tx.err ? 'Failed' : 'Confirmed'}
                                </span>

                                <div className="hidden sm:block text-right">
                                    <div className="text-xs font-mono text-zinc-600 group-hover:text-white transition-colors">
                                        {truncateAddress(tx.signature, 6)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-emerald-400 transition-colors">
                                    <span className="hidden sm:inline">View on Explorer</span>
                                    <ExternalLink className="w-3 h-3" />
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}
