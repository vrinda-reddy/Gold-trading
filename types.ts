export enum CogsMethod {
    GROSS = 'Gross',
    NINE_NINE = '9.99',
}

export interface Lot {
    id: string;
    name: string;
    quantityGrams: number;
    purityPercent: number;
    pricePerGram: number;
}

export interface ReportInputs {
    date: string;
    sellingPricePerGram: number;
    finalPurityPercent: number;
    useAutoFinalPurity: boolean;
    purificationExpenses: number;
    operationalCosts: number;
    sellingQuantityGrams: number;
    cogsMethod: CogsMethod;
    purityLossPercentage: number;
}

export interface LotCalculations {
    purityGrams: number;
    buyingValue: number;
}

export interface LotTotals {
    totalBuyingQuantityGrams: number;
    totalPurityGrams: number;
    totalBuyingValue: number;
    averageBuyingPurityPercent: number;
    averageBuyingPricePerGram: number;
}

export interface SummaryCalculations {
    averageBuyingPricePerGram: number;
    totalExpenses: number;
    totalBuyingCosts: number;
    costPriceGross: number;
    costPrice999: number;
    totalSalesRevenue: number;
    cogs: number;
    totalProfit: number;
    profitPerGram: number;
    profitPercent: number;
}