export interface QuotaInfo {
    total: number;     // Total quota in USD
    used: number;      // Used quota in USD
    remaining: number; // Remaining quota in USD
}

export const BASE_URL = 'https://nanobanana2.peacedejiai.cc';

export const checkQuota = async (apiKey: string): Promise<QuotaInfo> => {
    // Allow user to input full URL or just key, but instructions say key. 
    // We'll clean the key just in case.
    const cleanKey = apiKey.trim();

    const headers = {
        'Authorization': `Bearer ${cleanKey}`,
        'Content-Type': 'application/json'
    };

    try {
        // Fetch Subscription (Total Limit)
        // Common OneAPI/NewAPI endpoint for limit
        const subRes = await fetch(`${BASE_URL}/v1/dashboard/billing/subscription`, { headers });
        if (!subRes.ok) {
            if (subRes.status === 401) throw new Error('Invalid API Key');
            throw new Error(`Failed to fetch subscription: ${subRes.status}`);
        }
        const subData = await subRes.json();
        const hardLimit = subData.hard_limit_usd || 0;

        // Fetch Usage (Used Amount)
        // Common OpenAI/OneAPI endpoint. Usually returns usage in cents or sometimes directly USD.
        // OpenAI returns total_usage in cents. OneAPI usually mimics this.
        // Let's assume standard behavior (cents) / 100 first, or check response format.
        // Actually NewAPI usually returns `total_usage` as a number. 
        // To be safe, we'll request a date range covering "all time" or sufficient window if needed, 
        // but /v1/dashboard/billing/usage often gives total for current period or similar.
        // However, simpler OneAPI implementations might just return total_usage.
        // Let's try the standard endpoint.

        // Note: Some OneAPI versions need start_date/end_date params. 
        // We'll try without first, as many default to "current billing cycle" or similar which might be enough,
        // but for "wallet balance" style checking, usually /v1/dashboard/billing/usage is enough.
        // Another common one is /v1/subscription/usage (non-standard).

        // Let's stick to standard /v1/dashboard/billing/usage
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]; // Start of month
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1).toISOString().split('T')[0]; // End of month

        // Actually, to get "Balance", we usually care about the `hard_limit_usd` minus `total_used`.
        // Let's try fetching usage.
        const usageRes = await fetch(`${BASE_URL}/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`, { headers });
        if (!usageRes.ok) throw new Error('Failed to fetch usage');

        const usageData = await usageRes.json();
        // Default OpenAI format: total_usage is in cents (e.g. 100 = $1.00)
        // But verify if NewAPI returns fetchable number. 
        // Usually NewAPI `total_usage` is in cents (USD * 100).
        const usedUSD = (usageData.total_usage || 0) / 100;

        return {
            total: hardLimit,
            used: usedUSD,
            remaining: Math.max(0, hardLimit - usedUSD)
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};
