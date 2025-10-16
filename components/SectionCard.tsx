
import React from 'react';

interface SectionCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg ${className}`}>
            <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
            {children}
        </div>
    );
};

export default SectionCard;
