
import React from 'react';
import { useGoldReport } from './hooks/useGoldReport';
import { SummaryTable } from './components/SummaryTable';
import { LotsTable } from './components/LotsTable';
import { CogsMethod } from './types';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
    const {
        reportInputs,
        lots,
        setReportInputs,
        lotActions,
        calculations,
    } = useGoldReport();

    const handleReportInputChange = (
        field: keyof typeof reportInputs,
        value: string | number
    ) => {
        setReportInputs(prev => ({
            ...prev,
            [field]: typeof prev[field] === 'number' ? Number(value) : value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <LogoIcon />
                        <h1 className="text-3xl font-bold text-gray-900">Gold Trade - Daily Report</h1>
                    </div>
                    <p className="text-gray-500">
                        View and edit the daily report. All calculations are updated in real-time.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                       <SummaryTable 
                           reportInputs={reportInputs}
                           calculations={calculations}
                           onInputChange={handleReportInputChange}
                       />
                    </div>
                    <div className="lg:col-span-2">
                        <LotsTable 
                            lots={lots}
                            lotActions={lotActions}
                            calculations={calculations}
                        />
                    </div>
                </main>

                <footer className="text-center mt-12 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Gold Trade Analytics. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;
