
import React from 'react';
import type { SecurityLog } from '../types.ts';
import { formatTime } from '../utils/helpers.ts';
import SectionCard from './SectionCard.tsx';

interface SecurityLogsProps {
    logs: SecurityLog[];
}

const SecurityLogs: React.FC<SecurityLogsProps> = ({ logs }) => {
    const getLogDetails = (log: SecurityLog) => {
        const icon = log.success ? '✅' : '❌';
        const color = log.success ? 'text-green-400' : 'text-red-400';
        const actionText = (log.action || 'unknown_action').replace(/_/g, ' ');

        return { icon, color, actionText };
    };

    return (
        <SectionCard title="🔍 Recent Security Events">
            <div className="max-h-96 overflow-y-auto pr-2">
                {logs.length > 0 ? (
                    logs.map(log => {
                        const { icon, color, actionText } = getLogDetails(log);
                        return (
                            <div key={log.key} className="bg-slate-800/50 rounded-lg p-3 mb-2 flex justify-between items-center text-sm">
                                <div>
                                    <span className={`${color} font-bold`}>{icon}</span>
                                    <span className="ml-2 capitalize">{actionText}</span>
                                    {log.attempts && <span className="text-xs text-slate-400"> (Attempt {log.attempts})</span>}
                                </div>
                                <span className="text-slate-400 text-xs">{formatTime(log.timestamp)}</span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-slate-400 py-8">No security events yet</p>
                )}
            </div>
        </SectionCard>
    );
};

export default SecurityLogs;