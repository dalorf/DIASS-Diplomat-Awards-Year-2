
import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
    gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, gradient }) => {
    return (
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-5 text-white text-center shadow-md`}>
            <div className="text-4xl font-extrabold">{value}</div>
            <div className="text-sm opacity-90 mt-1">{label}</div>
        </div>
    );
};

export default StatCard;
