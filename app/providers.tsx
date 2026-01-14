"use client";

import React from 'react';
import { LazorkitProvider } from '@lazorkit/wallet';
import { LAZORKIT_CONFIG } from '@/lib/lazorkit-config';

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
