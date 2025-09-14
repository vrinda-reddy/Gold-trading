
import React from 'react';
import type { Lot, LotCalculations, LotTotals } from '../types';
import { LotRow } from './LotRow';
import { AddIcon, ClearIcon, CopyIcon, DeleteIcon } from './Icons';

interface LotsTableProps {
    lots: Lot[];
    lotActions: {
        updateLot: (id: string, field: keyof Lot, value: string | number) => void;
        addLot: () => void;
        deleteLot: (id: string) => void;
        duplicateLot: (id: string) => void;
        clearEmptyLots: () => void;
    };
    calculations: {
        lotCalculations: Map<string, LotCalculations>;
        lotTotals: LotTotals;
    };
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export const LotsTable: React.FC<LotsTableProps> = ({ lots, lotActions, calculations }) => {
    const { lotCalculations, lotTotals } = calculations;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">Lot Details</h2>
                <div className="flex items-center space-x-2">
                    <button onClick={lotActions.addLot} disabled={lots.length >= 15} className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                        <AddIcon />
                        <span>Add Lot</span>
                    </button>
                    <button onClick={lotActions.clearEmptyLots} className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                        <ClearIcon />
                        <span>Clear Empty</span>
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3">Lot ID</th>
                            <th scope="col" className="px-4 py-3">Buying Qty (g)</th>
                            <th scope="col" className="px-4 py-3">Purity (%)</th>
                            <th scope="col" className="px-4 py-3">Purity (g)</th>
                            <th scope="col" className="px-4 py-3">Buy Price/g (IDR)</th>
                            <th scope="col" className="px-4 py-3">Buying Value</th>
                            <th scope="col" className="px-4 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lots.map(lot => (
                            <LotRow
                                key={lot.id}
                                lot={lot}
                                calcs={lotCalculations.get(lot.id)}
                                onUpdate={lotActions.updateLot}
                                onDelete={lotActions.deleteLot}
                                onDuplicate={lotActions.duplicateLot}
                            />
                        ))}
                    </tbody>
                    <tfoot className="font-semibold text-gray-800 bg-gray-100">
                        <tr>
                            <td className="px-4 py-3">Totals</td>
                            <td className="px-4 py-3">{lotTotals.totalBuyingQuantityGrams.toFixed(2)} g</td>
                            <td className="px-4 py-3 text-gray-400">-</td>
                            <td className="px-4 py-3">{lotTotals.totalPurityGrams.toFixed(2)} g</td>
                            <td className="px-4 py-3 text-gray-400">-</td>
                            <td className="px-4 py-3">{formatCurrency(lotTotals.totalBuyingValue)}</td>
                            <td className="px-4 py-3"></td>
                        </tr>
                        <tr className="border-t">
                             <td className="px-4 py-3 font-bold" colSpan={2}>Average Buying Purity</td>
                             <td className="px-4 py-3 font-bold" colSpan={5}>{lotTotals.averageBuyingPurityPercent.toFixed(2)} %</td>
                        </tr>
                        <tr className="border-t">
                             <td className="px-4 py-3 font-bold" colSpan={2}>Average Buying Price/g</td>
                             <td className="px-4 py-3 font-bold" colSpan={5}>{formatCurrency(lotTotals.averageBuyingPricePerGram)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};