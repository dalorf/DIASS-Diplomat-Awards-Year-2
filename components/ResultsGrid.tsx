
import React from 'react';
import type { AllVotes } from '../types';
import { CATEGORIES } from '../constants';
import { sanitizeInput } from '../utils/helpers';
import SectionCard from './SectionCard';

interface ResultsGridProps {
    allVotes: AllVotes;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ allVotes }) => {
    return (
        <SectionCard title="🏆 Detailed Voting Results" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map(category => {
                    const categoryVotes = allVotes[category.name] || {};
                    const sortedNominees = [...category.nominees]
                        .map(nom => ({ name: nom, votes: categoryVotes[nom] || 0 }))
                        .sort((a, b) => b.votes - a.votes);

                    return (
                        <div key={category.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                            <h3 className="font-bold text-md text-white mb-3 flex items-center gap-2">
                                {category.icon} <span>{sanitizeInput(category.name)}</span>
                            </h3>
                            <div className="space-y-2">
                                {sortedNominees.map((nominee, index) => (
                                    <div key={nominee.name} className="flex justify-between items-center bg-slate-900/50 p-2 rounded-md text-sm">
                                        <span className="font-medium text-slate-300">{index + 1}. {sanitizeInput(nominee.name)}</span>
                                        <span className="font-bold text-blue-400">{nominee.votes}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </SectionCard>
    );
};

export default ResultsGrid;
