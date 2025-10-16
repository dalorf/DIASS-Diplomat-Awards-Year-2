
import React, { useState, useEffect } from 'react';

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (name: string, email: string | null) => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmail('');
        }
    }, [isOpen]);

    const handleAdd = () => {
        if(name.trim()) {
            onAdd(name.trim(), email.trim() || null);
        } else {
            alert("Student name cannot be empty.");
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 rounded-xl p-8 shadow-2xl w-full max-w-md text-white border border-slate-700" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-6">➕ Add New Student</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="newStudentName" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            id="newStudentName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Solomon Stephen Sunday"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="newStudentEmail" className="block text-sm font-medium text-slate-300 mb-1">Email (Optional)</label>
                        <input
                            type="email"
                            id="newStudentEmail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., student@email.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAdd}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                        Add Student
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddStudentModal;
