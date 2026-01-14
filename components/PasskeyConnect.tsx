"use client";
import { useWallet } from '@lazorkit/wallet';
/**
 * PasskeyConnect Component
 * 
 * This component handles the initial wallet connection flow using WebAuthn.
 * It uses the `useWallet` hook from Lazorkit SDK to trigger the passkey prompt.
 */
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Loader2, Fingerprint, Wallet } from 'lucide-react';

export default function PasskeyConnect() {
    const { connect, isConnecting, isConnected } = useWallet();
    const router = useRouter();

    // Track if user was already connected when component mounted
    const wasConnectedOnMount = useRef(isConnected);
    const hasRedirected = useRef(false);

    // Auto-redirect only when user FRESHLY connects (not if already connected)
    useEffect(() => {
        if (isConnected && !wasConnectedOnMount.current && !hasRedirected.current) {
            hasRedirected.current = true;
            router.push('/wallet');
        }
    }, [isConnected, router]);

    // If already connected (came back via back button), show "Go to Wallet" button
    if (isConnected && wasConnectedOnMount.current) {
        return (
            <div className="w-full max-w-md bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center space-y-6 backdrop-blur-sm">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
                    <p className="text-zinc-400 text-sm">Your wallet is connected and ready to use.</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/wallet')}
                        className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <Wallet className="w-4 h-4" />
                        Go to Wallet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-zinc-900/50 border border-white/5 rounded-2xl p-8 text-center space-y-6 backdrop-blur-sm">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-white">Get Started</h2>
                <p className="text-zinc-400 text-sm">This example shows how Lazorkit SDK works. Click below to create a wallet using your fingerprint or face.</p>
            </div>

            <div className="space-y-4">
                <button
                    onClick={() => connect()}
                    disabled={isConnecting}
                    className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                    {isConnecting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
                    ) : (
                        <>
                            <Fingerprint className="w-4 h-4" />
                            Create Wallet
                        </>
                    )}
                </button>
                <p className="text-xs text-zinc-600">Uses your device&apos;s biometric authentication</p>
            </div>
        </div>
    );
}


