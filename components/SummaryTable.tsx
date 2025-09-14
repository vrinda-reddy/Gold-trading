import React from 'react';
import type { ReportInputs, SummaryCalculations, LotTotals } from '../types';
import { CogsMethod } from '../types';
import { SummaryRow, SummarySelectRow, SummaryToggleRow } from './SummaryRow';

interface SummaryTableProps {
    reportInputs: ReportInputs;
    calculations: {
        summaryCalculations: SummaryCalculations;
        lotTotals: LotTotals;
    };
    onInputChange: (field: keyof ReportInputs, value: string | number) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export const SummaryTable: React.FC<SummaryTableProps> = ({ reportInputs, calculations, onInputChange }) => {
    const { summaryCalculations, lotTotals } = calculations;
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Summary Report</h2>
            <div className="space-y-3">
                <SummaryRow label="Date" type="date" value={reportInputs.date} isEditable={true} onChange={e => onInputChange('date', e.target.value)} />
                <SummaryRow label="Selling Price (per gram)" unit="IDR" value={reportInputs.sellingPricePerGram} isEditable={true} onChange={e => onInputChange('sellingPricePerGram', e.target.value)} />
                <SummaryRow label="Purity/Kadar (Buying, %)" unit="%" value={lotTotals.averageBuyingPurityPercent} isEditable={false} />
                <SummaryRow label="Final Purity/Kadar (After Purifying, %)" unit="%" value={reportInputs.finalPurityPercent} isEditable={!reportInputs.useAutoFinalPurity} onChange={e => onInputChange('finalPurityPercent', e.target.value)} />
                <SummaryToggleRow label="Auto-calculate Final Purity" checked={reportInputs.useAutoFinalPurity} onChange={e => onInputChange('useAutoFinalPurity', e.target.checked ? 1: 0)} />
                 {reportInputs.useAutoFinalPurity && <SummaryRow label="Purity Loss" unit="%" value={reportInputs.purityLossPercentage} isEditable={true} onChange={e => onInputChange('purityLossPercentage', e.target.value)} />}
                <SummaryRow label="Buying Quantity (grams)" unit="g" value={lotTotals.totalBuyingQuantityGrams} isEditable={false} />
                <SummaryRow label="Purification Expenses" unit="IDR" value={reportInputs.purificationExpenses} isEditable={true} onChange={e => onInputChange('purificationExpenses', e.target.value)} />
                <SummaryRow label="Operational Costs + Commission" unit="IDR" value={reportInputs.operationalCosts} isEditable={true} onChange={e => onInputChange('operationalCosts', e.target.value)} />
                <SummaryRow label="Selling Quantity (grams)" unit="g" value={reportInputs.sellingQuantityGrams} isEditable={true} onChange={e => onInputChange('sellingQuantityGrams', e.target.value)} />

                <div className="pt-4 border-t mt-4">
                    <SummarySelectRow
                        label="COGS Method"
                        value={reportInputs.cogsMethod}
                        onChange={e => onInputChange('cogsMethod', e.target.value)}
                        options={[CogsMethod.NINE_NINE, CogsMethod.GROSS]}
                    />
                    <SummaryRow label="Average Buying Price (per gram)" value={formatCurrency(summaryCalculations.averageBuyingPricePerGram)} isEditable={false} />
                    <SummaryRow label="Cost Price (per gram, gross)" value={formatCurrency(summaryCalculations.costPriceGross)} isEditable={false} />
                    <SummaryRow label="Cost Price 9.99 (per gram after purifying)" value={formatCurrency(summaryCalculations.costPrice999)} isEditable={false} />
                </div>
                
                <div className="pt-4 border-t mt-4 text-green-700">
                    <SummaryRow label="Total Goods Costs" value={formatCurrency(summaryCalculations.totalBuyingCosts)} isEditable={false} />
                    <SummaryRow label="Total Sales Revenue" value={formatCurrency(summaryCalculations.totalSalesRevenue)} isEditable={false} />
                    <SummaryRow label="Profit Per Gram" value={`${formatCurrency(summaryCalculations.profitPerGram)} (${summaryCalculations.profitPercent}%)`} isEditable={false} />
                    <SummaryRow label="Total Profit" value={`${formatCurrency(summaryCalculations.totalProfit)} (${summaryCalculations.profitPercent}%)`} isEditable={false} className="font-bold" />
                </div>
            </div>
        </div>
    );
};