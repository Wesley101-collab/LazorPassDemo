"use client";
import React from 'react';
import { useWallet } from '@lazorkit/wallet';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { formatAmount } from '@/lib/utils';
import { CircleDollarSign, Coins } from 'lucide-react';

export default function WalletDisplay() {
    const { smartWalletPubkey } = useWallet();
    const { solBalance, usdcBalance, isLoading } = useWalletBalance(smartWalletPubkey);

    if (!smartWalletPubkey) return null;

    return (
        <div className="space-y-6">
            {/* Section Label */}
            <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium text-zinc-400">Your Balance</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Testnet
                </span>
            </div>

            {/* SOL Balance - Obsidian Card */}
            <div className="h-40 rounded-xl relative overflow-hidden bg-black border border-white/10 flex flex-col justify-center p-8 group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-zinc-500">
                        <Coins className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-wider uppercase">SOL</span>
                    </div>

                    <div className="text-3xl font-medium text-white tracking-tight mb-1 font-mono">
                        {isLoading ? '...' : formatAmount(solBalance, 4)} <span className="text-zinc-600 text-lg">SOL</span>
                    </div>
                </div>
            </div>

            {/* USDC Balance - Frost Card */}
            <div className="h-40 rounded-xl relative overflow-hidden bg-white/5 border border-white/10 flex flex-col justify-center p-8 group">
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-30 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-zinc-400">
                        <CircleDollarSign className="w-4 h-4 text-zinc-300" />
                        <span className="text-xs font-semibold tracking-wider uppercase text-zinc-300">USDC</span>
                    </div>

                    <div className="text-3xl font-medium text-white tracking-tight mb-1 font-mono">
                        {isLoading ? '...' : formatAmount(usdcBalance, 2)} <span className="text-zinc-500 text-lg">USDC</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
