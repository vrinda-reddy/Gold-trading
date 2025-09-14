
import { useState, useMemo, useCallback } from 'react';
import type { Lot, ReportInputs, LotCalculations, LotTotals, SummaryCalculations } from '../types';
import { CogsMethod } from '../types';

// Sample data from the prompt
const initialLots: Lot[] = [
    { id: '1', name: 'Lot-1', quantityGrams: 110.49, purityPercent: 91, pricePerGram: 1640000 },
    { id: '2', name: 'Lot-2', quantityGrams: 82.82, purityPercent: 88, pricePerGram: 1600000 },
    { id: '3', name: 'Lot-3', quantityGrams: 0, purityPercent: 0, pricePerGram: 0 },
];

const initialReportInputs: ReportInputs = {
    date: new Date().toISOString().split('T')[0],
    sellingPricePerGram: 1885000,
    finalPurityPercent: 89.23,
    useAutoFinalPurity: false,
    purificationExpenses: 1548,
    operationalCosts: 10000,
    sellingQuantityGrams: 172.49,
    cogsMethod: CogsMethod.NINE_NINE,
    purityLossPercentage: 0.5, // Default loss percentage for auto-calculation
};

const round = (value: number, decimals: number): number => {
    return Number(Math.round(parseFloat(value + 'e' + decimals)) + 'e-' + decimals);
};

export const useGoldReport = () => {
    const [lots, setLots] = useState<Lot[]>(initialLots);
    const [reportInputs, setReportInputs] = useState<ReportInputs>(initialReportInputs);

    const lotCalculations = useMemo<Map<string, LotCalculations>>(() => {
        const calcs = new Map<string, LotCalculations>();
        lots.forEach(lot => {
            const purityGrams = lot.quantityGrams * (lot.purityPercent / 100);
            const buyingValue = lot.quantityGrams * lot.pricePerGram;
            calcs.set(lot.id, {
                purityGrams: round(purityGrams, 2),
                buyingValue: Math.round(buyingValue),
            });
        });
        return calcs;
    }, [lots]);

    const lotTotals = useMemo<LotTotals>(() => {
        let totalBuyingQuantityGrams = 0;
        let totalPurityGrams = 0;
        let totalBuyingValue = 0;

        lots.forEach(lot => {
            const calcs = lotCalculations.get(lot.id);
            if(calcs && lot.quantityGrams > 0) {
                totalBuyingQuantityGrams += lot.quantityGrams;
                totalPurityGrams += calcs.purityGrams;
                totalBuyingValue += calcs.buyingValue;
            }
        });

        const averageBuyingPurityPercent = totalBuyingQuantityGrams > 0
            ? (totalPurityGrams / totalBuyingQuantityGrams) * 100
            : 0;

        const averageBuyingPricePerGram = totalBuyingQuantityGrams > 0
            ? totalBuyingValue / totalBuyingQuantityGrams
            : 0;

        return {
            totalBuyingQuantityGrams: round(totalBuyingQuantityGrams, 2),
            totalPurityGrams: round(totalPurityGrams, 2),
            totalBuyingValue: Math.round(totalBuyingValue),
            averageBuyingPurityPercent: round(averageBuyingPurityPercent, 2),
            averageBuyingPricePerGram: Math.round(averageBuyingPricePerGram),
        };
    }, [lots, lotCalculations]);

    const summaryCalculations = useMemo<SummaryCalculations>(() => {
        const totalExpenses = reportInputs.purificationExpenses + reportInputs.operationalCosts;
        const averageBuyingPricePerGram = lotTotals.averageBuyingPricePerGram;

        // Per user request: cost price gross = average buying price/g + total expenses
        const costPriceGross = averageBuyingPricePerGram + totalExpenses;
        
        const totalBuyingCosts = costPriceGross * lotTotals.totalBuyingQuantityGrams;

        const finalPurityPercent = reportInputs.useAutoFinalPurity
            ? lotTotals.averageBuyingPurityPercent - reportInputs.purityLossPercentage
            : reportInputs.finalPurityPercent;

        const costPrice999 = (lotTotals.totalBuyingQuantityGrams > 0 && finalPurityPercent > 0)
            ? totalBuyingCosts / (lotTotals.totalBuyingQuantityGrams * (finalPurityPercent / 100))
            : 0;
            
        const totalSalesRevenue = reportInputs.sellingPricePerGram * reportInputs.sellingQuantityGrams;

        let cogs = 0;
        if (reportInputs.cogsMethod === CogsMethod.GROSS) {
            cogs = reportInputs.sellingQuantityGrams * costPriceGross;
        } else { // CogsMethod.NINE_NINE
            cogs = reportInputs.sellingQuantityGrams * costPrice999;
        }

        const totalProfit = totalSalesRevenue - cogs;

        const profitPerGram = reportInputs.sellingQuantityGrams > 0
            ? totalProfit / reportInputs.sellingQuantityGrams
            : 0;
        
        const profitPercent = reportInputs.sellingPricePerGram > 0
            ? (profitPerGram / reportInputs.sellingPricePerGram) * 100
            : 0;

        return {
            averageBuyingPricePerGram: Math.round(averageBuyingPricePerGram),
            totalExpenses: Math.round(totalExpenses),
            totalBuyingCosts: Math.round(totalBuyingCosts),
            costPriceGross: Math.round(costPriceGross),
            costPrice999: Math.round(costPrice999),
            totalSalesRevenue: Math.round(totalSalesRevenue),
            cogs: Math.round(cogs),
            totalProfit: Math.round(totalProfit),
            profitPerGram: Math.round(profitPerGram),
            profitPercent: round(profitPercent, 2),
        };
    }, [reportInputs, lotTotals]);

    const updateLot = useCallback((id: string, field: keyof Lot, value: string | number) => {
        setLots(prevLots =>
            prevLots.map(lot =>
                lot.id === id ? { ...lot, [field]: typeof lot[field] === 'number' ? Number(value) : value } : lot
            )
        );
    }, []);

    const addLot = useCallback(() => {
        if (lots.length >= 15) return;
        const newId = (Math.max(...lots.map(l => parseInt(l.id, 10)), 0) + 1).toString();
        const newLot: Lot = {
            id: newId,
            name: `Lot-${lots.length + 1}`,
            quantityGrams: 0,
            purityPercent: 0,
            pricePerGram: 0,
        };
        setLots(prev => [...prev, newLot]);
    }, [lots]);

    const deleteLot = useCallback((id: string) => {
        setLots(prev => prev.filter(lot => lot.id !== id));
    }, []);

    const duplicateLot = useCallback((id: string) => {
        if (lots.length >= 15) return;
        const lotToDuplicate = lots.find(lot => lot.id === id);
        if (lotToDuplicate) {
            const newId = (Math.max(...lots.map(l => parseInt(l.id, 10)), 0) + 1).toString();
            const newLot: Lot = {
                ...lotToDuplicate,
                id: newId,
                name: `${lotToDuplicate.name} (Copy)`,
            };
            setLots(prev => [...prev, newLot]);
        }
    }, [lots]);

    const clearEmptyLots = useCallback(() => {
        setLots(prev => prev.filter(lot => lot.quantityGrams > 0 || lot.purityPercent > 0 || lot.pricePerGram > 0));
    }, []);

    const lotActions = {
        updateLot,
        addLot,
        deleteLot,
        duplicateLot,
        clearEmptyLots,
    };
    
    const finalPurityPercent = reportInputs.useAutoFinalPurity
        ? round(lotTotals.averageBuyingPurityPercent - reportInputs.purityLossPercentage, 2)
        : reportInputs.finalPurityPercent;

    return {
        reportInputs: {...reportInputs, finalPurityPercent},
        lots,
        setReportInputs,
        lotActions,
        calculations: {
            lotCalculations,
            lotTotals,
            summaryCalculations,
        }
    };
};
