import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes utilizing clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Truncates a wallet address for display
 * @param address The full wallet address
 * @param length Number of characters to show at start and end
 * @returns Truncated string (e.g., "AbCd...WxYz")
 */
export function truncateAddress(address: string, length: number = 4): string {
    if (!address) return "";
    if (address.length <= length * 2) return address;
    return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Formats a number as a locale string with specific decimals
 */
export function formatAmount(amount: number | string, decimals: number = 2): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}
