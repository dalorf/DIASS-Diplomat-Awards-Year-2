
import React, { useState, useEffect, useCallback } from 'react';
import { db, ref, onValue, off, set, remove, get } from '../services/firebase';
import type { RegisteredStudent, StudentActivity, AllVotes, Stats, SecurityLog, CombinedStudentData } from '../types';
import { CATEGORIES } from '../constants';
import StatCard from './StatCard';
import SecurityLogs from './SecurityLogs';
import StudentsTable from './StudentsTable';
import ResultsGrid from './ResultsGrid';
import AddStudentModal from './AddStudentModal';

interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [stats, setStats] = useState<Stats>({ totalVotes: 0, totalVoters: 0, freeVotes: 0, paidVotes: 0 });
    const [students, setStudents] = useState<CombinedStudentData[]>([]);
    const [allVotes, setAllVotes] = useState<AllVotes>({});
    const [votingLocked, setVotingLocked] = useState<boolean>(false);
    const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([]);

    const updateStats = useCallback((votes: AllVotes, studentActivities: Record<string, StudentActivity>) => {
        let totalVotes = 0;
        let freeVotes = 0;
        let paidVotes = 0;
        let activeVoters = 0;

        Object.values(votes).forEach(category => {
            Object.values(category).forEach(count => (totalVotes += count));
        });

        Object.values(studentActivities).forEach(user => {
            if (user.votesCount > 0) {
                 activeVoters++;
                 freeVotes += user.votesCount;
            }
        });
        
        // Paid votes logic would need more info on DB structure, assuming a simple count for now.
        // This is a placeholder as the original logic was incomplete.
        paidVotes = totalVotes - freeVotes > 0 ? totalVotes - freeVotes : 0;


        setStats({ totalVotes, totalVoters: activeVoters, freeVotes, paidVotes });
    }, []);

    useEffect(() => {
        const refs = [
            ref(db, 'registeredStudents'),
            ref(db, 'students'),
            ref(db, 'categoryVotes'),
            ref(db, 'settings/votingLocked'),
            ref(db, 'adminLogs')
        ];

        const listeners = [
            onValue(refs[0], (snapshot) => {
                const data = snapshot.val() || {};
                const studentList: RegisteredStudent[] = Object.keys(data).map(key => ({
                    id: key,
                    name: data[key].name || 'Unnamed',
                    email: data[key].email || null,
                    hasVoted: data[key].hasVoted || false,
                }));
                setRegisteredStudents(studentList);
            }),
            onValue(refs[1], (snapshot) => {
                const studentActivities: Record<string, StudentActivity> = snapshot.val() || {};
                const currentVotes = allVotes;
                updateStats(currentVotes, studentActivities);
            }),
            onValue(refs[2], (snapshot) => {
                const votes: AllVotes = snapshot.val() || {};
                setAllVotes(votes);
                const studentsRef = ref(db, 'students');
                get(studentsRef).then(snap => {
                    const studentActivities = snap.val() || {};
                    updateStats(votes, studentActivities);
                });
            }),
            onValue(refs[3], (snapshot) => {
                setVotingLocked(snapshot.val() === true);
            }),
            onValue(refs[4], (snapshot) => {
                const logsData = snapshot.val() || {};
                const logs: SecurityLog[] = Object.keys(logsData)
                    .map(key => ({ key, ...logsData[key] }))
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 20);
                setSecurityLogs(logs);
            })
        ];

        return () => {
            listeners.forEach((listener, index) => off(refs[index], 'value', listener));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        const studentActivitiesRef = ref(db, 'students');
        onValue(studentActivitiesRef, (snapshot) => {
            const activities: Record<string, StudentActivity> = snapshot.val() || {};
            const combined = registeredStudents.map(regStudent => {
                
                let activity: StudentActivity | undefined;
                
                // Match by email
                if(regStudent.email){
                     const emailKey = regStudent.email.replace(/\./g, ',');
                     if(activities[emailKey]) activity = activities[emailKey];
                }
               
                // Fallback to match by name if email match failed
                if(!activity) {
                     const nameKey = regStudent.name.replace(/\s+/g, '').toLowerCase();
                      for (const key in activities) {
                        const dataName = activities[key].name || '';
                        if (dataName.replace(/\s+/g, '').toLowerCase() === nameKey) {
                            activity = activities[key];
                            break;
                        }
                    }
                }

                return {
                    ...regStudent,
                    activity: activity || { status: 'never', votesCount: 0, lastActivity: 0 }
                };
            });
            setStudents(combined);
        });

        return () => off(studentActivitiesRef);
    }, [registeredStudents]);


    const exportResults = async () => {
        try {
            let csvContent = "Category,Nominee,Votes\n";
            CATEGORIES.forEach(category => {
                const categoryVotes = allVotes[category.name] || {};
                category.nominees.forEach(nominee => {
                    const votes = categoryVotes[nominee] || 0;
                    csvContent += `"${category.name}","${nominee}",${votes}\n`;
                });
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'voting_results.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            await set(ref(db, `adminLogs/${Date.now()}`), { action: 'results_exported', timestamp: Date.now(), success: true });
            alert('Results exported successfully!');
        } catch (error) {
            alert('Error exporting results.');
            console.error('Export error:', error);
        }
    };
    
    const toggleVoting = async () => {
        try {
            await set(ref(db, 'settings/votingLocked'), !votingLocked);
            await set(ref(db, `adminLogs/${Date.now()}`), { action: votingLocked ? 'voting_unlocked' : 'voting_locked', timestamp: Date.now(), success: true });
        } catch (error) {
            alert('Error toggling voting lock.');
            console.error('Toggle voting error:', error);
        }
    };
    
    const resetVotes = async () => {
        if (!confirm('Are you sure you want to reset ALL votes? This cannot be undone.')) return;
        try {
            await remove(ref(db, 'categoryVotes'));
            await remove(ref(db, 'userVotes'));
            await remove(ref(db, 'students'));
            // Optionally reset hasVoted flag on registered students
            const registeredSnapshot = await get(ref(db, 'registeredStudents'));
            if(registeredSnapshot.exists()){
                const updates: {[key: string]: any} = {};
                registeredSnapshot.forEach(child => {
                    updates[`${child.key}/hasVoted`] = false;
                });
                await set(ref(db, 'registeredStudents'), {...registeredSnapshot.val(), ...updates});
            }

            await set(ref(db, `adminLogs/${Date.now()}`), { action: 'votes_reset', timestamp: Date.now(), success: true });
            alert('All votes have been reset.');
        } catch (error) {
            alert('Error resetting votes.');
            console.error('Reset votes error:', error);
        }
    };

    const changeAdminPassword = async () => {
        alert("⚠️ For security, passwords must be changed manually by a system administrator in Firebase Console.");
        await set(ref(db, `adminLogs/${Date.now()}`), { action: 'password_change_attempted', timestamp: Date.now(), success: false });
    };

    const handleAddStudent = async (name: string, email: string | null) => {
        if (!name) {
            alert('Student name is required.');
            return;
        }

        try {
            const snapshot = await get(ref(db, 'registeredStudents'));
            const students = snapshot.val() || {};
            const studentKeys = Object.keys(students);
            let maxId = 0;
            studentKeys.forEach(key => {
                const match = key.match(/^student(\d+)$/);
                if (match) {
                    const id = parseInt(match[1], 10);
                    if (id > maxId) {
                        maxId = id;
                    }
                }
            });
            const newStudentId = `student${maxId + 1}`;
            
            await set(ref(db, `registeredStudents/${newStudentId}`), {
                name,
                email: email || null,
                hasVoted: false,
            });

            alert('Student added successfully!');
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student.');
        }
    };
    
    const handleDeleteStudent = async (studentId: string) => {
        if(!confirm(`Are you sure you want to delete student with ID ${studentId}? This is irreversible.`)) return;
        try {
            await remove(ref(db, `registeredStudents/${studentId}`));
            alert('Student deleted successfully.');
        } catch(error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student.");
        }
    };


    return (
        <div className="container mx-auto p-4 md:p-6">
             <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddStudent}
            />
            <header className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <span className="relative flex h-3 w-3 mr-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Admin Dashboard
                    </h1>
                    <button onClick={onLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Logout
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Votes" value={stats.totalVotes} gradient="from-blue-500 to-indigo-600" />
                    <StatCard label="Active Voters" value={stats.totalVoters} gradient="from-pink-500 to-rose-500" />
                    <StatCard label="Free Votes" value={stats.freeVotes} gradient="from-sky-400 to-cyan-400" />
                    <StatCard label="Paid Votes" value={stats.paidVotes} gradient="from-emerald-500 to-green-500" />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <button onClick={exportResults} className="md:col-span-1 btn-action bg-gradient-to-r from-green-500 to-emerald-600">📥 Export Results</button>
                <button onClick={toggleVoting} className="md:col-span-1 btn-action bg-gradient-to-r from-amber-500 to-orange-600">{votingLocked ? '🔓 Unlock Voting' : '🔒 Lock Voting'}</button>
                <button onClick={changeAdminPassword} className="md:col-span-1 btn-action bg-gradient-to-r from-purple-500 to-violet-600">🔑 Change Password</button>
                <button onClick={() => setIsModalOpen(true)} className="md:col-span-1 btn-action bg-gradient-to-r from-sky-500 to-blue-600">➕ Add Student</button>
                <button onClick={resetVotes} className="md:col-span-1 btn-action bg-gradient-to-r from-red-500 to-rose-600">🔄 Reset Votes</button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <SecurityLogs logs={securityLogs} />
                </div>
                <div className="lg:col-span-2">
                    <StudentsTable students={students} onDelete={handleDeleteStudent} />
                </div>
            </div>

            <ResultsGrid allVotes={allVotes} />
        </div>
    );
};

export default Dashboard;
