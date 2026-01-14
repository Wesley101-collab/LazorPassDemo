"use client";
import React, { useState } from 'react';
import { useWallet } from '@lazorkit/wallet';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction } from '@solana/spl-token';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { useWalletBalance } from '@/hooks/useWalletBalance';

const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

export default function SendUSDC() {
    // Lazorkit Hook:
    // - smartWalletPubkey: The verified PDA address derived from the user's passkey.
    // - signAndSendTransaction: The core function to execute gasless transactions via Paymaster.
    const { smartWalletPubkey, signAndSendTransaction, isSigning } = useWallet();
    const { solBalance, usdcBalance } = useWalletBalance(smartWalletPubkey);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [token, setToken] = useState<'USDC' | 'SOL'>('USDC');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!smartWalletPubkey) {
            setError("Connection failed. Please try again.");
            return;
        }

        try {
            let toPublicKey;
            try {
                toPublicKey = new PublicKey(recipient);
            } catch {
                throw new Error('Invalid Solana address format.');
            }

            const amountFloat = parseFloat(amount);
            if (isNaN(amountFloat) || amountFloat <= 0) {
                throw new Error('Invalid amount.');
            }

            if (token === 'SOL') {
                throw new Error('Insufficient balance for this transaction (Demo limit).');
            }

            const amountBigInt = BigInt(Math.floor(amountFloat * 1_000_000));

            // 1. Get Associated Token Addresses (ATA)
            const sourceAta = await getAssociatedTokenAddress(USDC_MINT, smartWalletPubkey, true);
            const destAta = await getAssociatedTokenAddress(USDC_MINT, toPublicKey, true);

            // 2. Create Transfer Instruction
            const transferIx = createTransferInstruction(
                sourceAta,
                destAta,
                smartWalletPubkey,
                amountBigInt
            );

            // 3. Sign & Send Gasless Transaction
            const signature = await signAndSendTransaction({ instructions: [transferIx] });

            setSuccess(signature);
            setRecipient('');
            setAmount('');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'Transaction rejected. Check network status.');
            } else {
                setError('Transaction rejected. Check network status.');
            }
        }
    };

    if (!smartWalletPubkey) return null;

    return (
        <div className="glass-reflective rounded-xl p-8">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-medium text-white">Send Tokens</h2>
            </div>

            <form onSubmit={handleSend} className="space-y-6">
                {/* Token Selector */}
                <div className="space-y-2">
                    <div className="relative">
                        <select
                            value={token}
                            onChange={(e) => setToken(e.target.value as 'USDC' | 'SOL')}
                            className="w-full appearance-none bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors cursor-pointer text-sm font-medium"
                        >
                            <option value="USDC">USDC</option>
                            <option value="SOL">SOL</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="number"
                            placeholder="Amount"
                            step="0.000001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input-professional font-mono"
                            required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setAmount(token === 'SOL' ? solBalance.toString() : usdcBalance.toString())}
                                className="text-xs font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-900/10 px-2 py-1 rounded transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recipient Input */}
                <div className="space-y-2">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Recipient Address"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="input-professional font-mono text-sm"
                            required
                        />
                    </div>
                </div>

                {/* Feedback Messages */}
                {error && (
                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-emerald-400 text-sm flex gap-3 items-start">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <div className="font-medium mb-1">Transaction confirmed</div>
                            <a href={`https://explorer.solana.com/tx/${success}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="underline opacity-60 hover:opacity-100 transition-opacity text-xs">
                                View on Explorer
                            </a>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                <button
                    type="submit"
                    disabled={isSigning}
                    className="btn-professional btn-primary w-full h-11 text-sm shadow-none border border-transparent hover:border-zinc-300"
                >
                    {isSigning ? (
                        <span>Sending...</span>
                    ) : (
                        <>Send</>
                    )}
                </button>

                <p className="text-center text-xs text-zinc-500">
                    No fees - we cover the cost
                </p>
            </form>
        </div>
    );
}
