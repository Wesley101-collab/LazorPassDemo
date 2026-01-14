"use client";
import React, { useEffect, useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { useRouter } from 'next/navigation';
import WalletDisplay from '@/components/WalletDisplay';
import SendUSDC from '@/components/SendUSDC';
import TransactionHistory from '@/components/TransactionHistory';
import { Copy, Check, ChevronLeft } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';

export default function WalletPage() {
    const { isConnected, isConnecting, smartWalletPubkey, disconnect } = useWallet();
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    // Mark as mounted after hydration
    useEffect(() => {
        const timer = setTimeout(() => {
            setHasMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    // Handle redirect when not connected (after mount)
    useEffect(() => {
        if (hasMounted && !isConnected && !isConnecting && !smartWalletPubkey) {
            const timer = setTimeout(() => {
                if (!isConnected && !smartWalletPubkey) {
                    router.push('/');
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [hasMounted, isConnected, isConnecting, smartWalletPubkey, router]);

    const copyAddress = () => {
        if (smartWalletPubkey) {
            navigator.clipboard.writeText(smartWalletPubkey.toBase58());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!hasMounted) return null;

    if (!isConnected && !smartWalletPubkey) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-zinc-500">
                <div className="text-sm tracking-widest uppercase mb-4 animate-pulse">Establishing Session</div>
                <div className="w-8 h-px bg-zinc-800"></div>
            </div>
        );
    }

    const handleDisconnect = async () => {
        await disconnect();
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            {/* Micro-Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Back / Logo */}
                    <button
                        className="flex items-center gap-2 group text-zinc-500 hover:text-white transition-colors"
                        onClick={() => router.push('/')}
                    >
                        <ChevronLeft className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                        <span className="font-medium text-sm">LazorPass</span>
                    </button>

                    {/* Address Pill (Minimal) */}
                    <button
                        onClick={copyAddress}
                        className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                        <div className="text-xs font-mono text-zinc-300">
                            {truncateAddress(smartWalletPubkey?.toBase58() || '')}
                        </div>
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />}
                    </button>

                    {/* Disconnect */}
                    <button
                        onClick={handleDisconnect}
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        Exit
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Balances & Info - 5 cols */}
                    <div className="lg:col-span-5 space-y-8">
                        <WalletDisplay />

                        <div className="pt-6 border-t border-dashed border-zinc-900">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-2 font-semibold">Environment</p>
                            <div className="flex items-center justify-between text-sm text-zinc-500 bg-zinc-900/30 p-3 rounded-lg border border-white/5">
                                <span>Solana Devnet</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                    <span className="text-emerald-500/80">Operational</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions - 7 cols */}
                    <div className="lg:col-span-7 space-y-12">
                        <SendUSDC />
                        <TransactionHistory />
                    </div>
                </div>
            </div>
        </main>
    );
}
