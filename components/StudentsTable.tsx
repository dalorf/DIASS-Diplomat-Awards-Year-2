
import React, { useState, useMemo } from 'react';
import type { CombinedStudentData } from '../types';
import { formatTime, sanitizeInput } from '../utils/helpers';
import SectionCard from './SectionCard';

interface StudentsTableProps {
    students: CombinedStudentData[];
    onDelete: (studentId: string) => void;
}

const StatusBadge: React.FC<{ status: 'online' | 'offline' | 'never' }> = ({ status }) => {
    const statusStyles = {
        online: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Online' },
        offline: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Offline' },
        never: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Not Active' },
    };
    const currentStatus = statusStyles[status] || statusStyles.never;

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
            {currentStatus.label}
        </span>
    );
};


const StudentsTable: React.FC<StudentsTableProps> = ({ students, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = useMemo(() => {
        const sanitizedSearch = sanitizeInput(searchTerm.toLowerCase());
        if (!sanitizedSearch) return students;
        return students.filter(s =>
            s.name.toLowerCase().includes(sanitizedSearch) ||
            (s.email && s.email.toLowerCase().includes(sanitizedSearch))
        );
    }, [students, searchTerm]);

    return (
        <SectionCard title="📋 All Registered Students">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students by name or email..."
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="overflow-x-auto max-h-[29rem]">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-800 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Student Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Votes Cast</th>
                            <th scope="col" className="px-6 py-3">Last Activity</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr key={student.id} className="border-b border-slate-700 hover:bg-slate-800/50">
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{student.name}</td>
                                    <td className="px-6 py-4">{student.email || 'N/A'}</td>
                                    <td className="px-6 py-4"><StatusBadge status={student.activity.status} /></td>
                                    <td className="px-6 py-4">{student.activity.votesCount} / 18</td>
                                    <td className="px-6 py-4">{formatTime(student.activity.lastActivity)}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => onDelete(student.id)} className="font-medium text-red-500 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-slate-400">
                                    {students.length === 0 ? 'Loading students...' : 'No students found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </SectionCard>
    );
};

export default StudentsTable;
