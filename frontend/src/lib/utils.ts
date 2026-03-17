import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatAddress(address: string | undefined, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatNumber(num: number | string, decimals = 2): string {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return "0";
  
  if (n >= 1e9) return `${(n / 1e9).toFixed(decimals)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(decimals)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(decimals)}K`;
  
  return n.toFixed(decimals);
}

export function formatDate(date: Date | number | string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

export function formatTime(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | number | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`;
}

export function timeUntil(date: Date | number): string {
  const now = Date.now();
  const target = new Date(date).getTime();
  const diff = target - now;
  
  if (diff <= 0) return "Now";
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  
  if (months > 0) return `${months}mo`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export function calculateVestedAmount(
  totalAmount: number,
  startTime: number,
  cliffTime: number,
  endTime: number,
  currentTime: number = Date.now()
): number {
  if (currentTime < cliffTime) return 0;
  if (currentTime >= endTime) return totalAmount;
  
  const vestingDuration = endTime - cliffTime;
  const vestedDuration = currentTime - cliffTime;
  const vestedPercentage = vestedDuration / vestingDuration;
  
  return totalAmount * vestedPercentage;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getExplorerUrl(address: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
    11155111: "https://sepolia.etherscan.io",
    137: "https://polygonscan.com",
    80001: "https://mumbai.polygonscan.com",
  };
  
  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/address/${address}`;
}

export function getTransactionUrl(txHash: string, chainId: number): string {
  const explorers: Record<number, string> = {
    1: "https://etherscan.io",
    5: "https://goerli.etherscan.io",
    11155111: "https://sepolia.etherscan.io",
    137: "https://polygonscan.com",
    80001: "https://mumbai.polygonscan.com",
  };
  
  const baseUrl = explorers[chainId] || explorers[1];
  return `${baseUrl}/tx/${txHash}`;
}
