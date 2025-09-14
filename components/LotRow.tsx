
import React from 'react';
import type { Lot, LotCalculations } from '../types';
import { CopyIcon, DeleteIcon } from './Icons';

interface LotRowProps {
    lot: Lot;
    calcs?: LotCalculations;
    onUpdate: (id: string, field: keyof Lot, value: string | number) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(value);
};

const InputCell: React.FC<{ value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; }> = ({ value, onChange, type = 'number' }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        step="0.01"
        className="w-full bg-transparent border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-2 py-1"
        min="0"
    />
);

const CalculatedCell: React.FC<{ value: string | number; unit?: string; }> = ({ value, unit }) => (
    <span className="px-2 py-1 block text-right font-medium text-gray-900">
        {value} {unit}
    </span>
);

export const LotRow: React.FC<LotRowProps> = ({ lot, calcs, onUpdate, onDelete, onDuplicate }) => {
    const handleUpdate = (field: keyof Lot) => (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(lot.id, field, e.target.value);
    };

    return (
        <tr className="bg-white border-b hover:bg-gray-50">
            <td className="px-2 py-2 w-32"><InputCell value={lot.name} onChange={handleUpdate('name')} type="text" /></td>
            <td className="px-2 py-2 w-32"><InputCell value={lot.quantityGrams} onChange={handleUpdate('quantityGrams')} /></td>
            <td className="px-2 py-2 w-28"><InputCell value={lot.purityPercent} onChange={handleUpdate('purityPercent')} /></td>
            <td className="px-2 py-2 w-28 text-right"><CalculatedCell value={calcs?.purityGrams.toFixed(2) || '0.00'} /></td>
            <td className="px-2 py-2 w-40"><InputCell value={lot.pricePerGram} onChange={handleUpdate('pricePerGram')} /></td>
            <td className="px-2 py-2 w-40 text-right"><CalculatedCell value={formatCurrency(calcs?.buyingValue || 0)} /></td>
            <td className="px-2 py-2 w-24">
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => onDuplicate(lot.id)} className="text-blue-500 hover:text-blue-700" title="Duplicate Lot">
                        <CopyIcon />
                    </button>
                    <button onClick={() => onDelete(lot.id)} className="text-red-500 hover:text-red-700" title="Delete Lot">
                        <DeleteIcon />
                    </button>
                </div>
            </td>
        </tr>
    );
};
