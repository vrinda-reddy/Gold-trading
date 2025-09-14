
import React from 'react';

interface SummaryRowProps {
    label: string;
    value: string | number;
    isEditable: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    unit?: string;
    className?: string;
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isEditable, onChange, type = 'number', unit, className }) => {
    return (
        <div className={`flex justify-between items-center py-1.5 ${className}`}>
            <label className="text-sm font-medium text-gray-600">{label}:</label>
            <div className="flex items-center space-x-2">
                {isEditable ? (
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        step={type === 'number' ? '0.01' : undefined}
                        className="w-36 text-right px-2 py-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                        min="0"
                    />
                ) : (
                    <span className="w-36 text-right px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-100 rounded-md">
                        {value}
                    </span>
                )}
                {unit && <span className="text-sm text-gray-500 w-8">{unit}</span>}
            </div>
        </div>
    );
};

interface SummarySelectRowProps {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}

export const SummarySelectRow: React.FC<SummarySelectRowProps> = ({ label, value, onChange, options }) => (
    <div className="flex justify-between items-center py-1.5">
        <label className="text-sm font-medium text-gray-600">{label}:</label>
        <select value={value} onChange={onChange} className="w-44 text-right px-2 py-1 text-sm border rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

interface SummaryToggleRowProps {
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SummaryToggleRow: React.FC<SummaryToggleRowProps> = ({ label, checked, onChange }) => (
     <div className="flex justify-between items-center py-1.5">
        <label className="text-sm font-medium text-gray-600">{label}:</label>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
    </div>
);
