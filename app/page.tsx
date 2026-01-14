"use client";
import PasskeyConnect from '@/components/PasskeyConnect';
import { Fingerprint, Coins, Globe } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center relative selection:bg-white/20">

      {/* Minimal Header */}
      <header className="w-full max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-tight text-white">Lazorkit</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-400">
            Demo
          </span>
        </div>
        <a href="https://github.com/Wesley101-collab/LazorPassDemo" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">
          GitHub
        </a>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 flex flex-col items-center pt-24 pb-20 space-y-16">

        {/* Hero Text */}
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Solana Wallet with Passkeys
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed font-light">
            A simple example showing how to integrate Lazorkit SDK. No seed phrases. No wallet apps. Just your fingerprint.
          </p>
        </div>

        {/* Action Card */}
        <PasskeyConnect />

        {/* Features Grid - 3 Simple Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-zinc-900/20 border border-white/5 space-y-3 hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-center gap-2 text-white font-medium">
              <Fingerprint className="w-5 h-5 text-zinc-400" />
              <h3>Login with Biometrics</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Create a wallet using Face ID or Touch ID. No passwords or seed phrases to remember.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-zinc-900/20 border border-white/5 space-y-3 hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-center gap-2 text-white font-medium">
              <Coins className="w-5 h-5 text-zinc-400" />
              <h3>Send Tokens for Free</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Transfer SOL and USDC without paying gas fees. We handle the transaction costs.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-zinc-900/20 border border-white/5 space-y-3 hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-center gap-2 text-white font-medium">
              <Globe className="w-5 h-5 text-zinc-400" />
              <h3>Works Everywhere</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              No browser extension needed. Works on any device with a fingerprint sensor or face recognition.
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}
