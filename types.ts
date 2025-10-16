
export interface RegisteredStudent {
    id: string;
    name: string;
    email: string | null;
    hasVoted: boolean;
}

export interface StudentActivity {
    name?: string;
    status: 'online' | 'offline' | 'never';
    votesCount: number;
    lastActivity: number;
}

export interface CombinedStudentData extends RegisteredStudent {
    activity: StudentActivity;
}

export interface Category {
    name: string;
    icon: string;
    nominees: string[];
}

export interface AllVotes {
    [categoryName: string]: {
        [nomineeName: string]: number;
    };
}

export interface Stats {
    totalVotes: number;
    totalVoters: number;
    freeVotes: number;
    paidVotes: number;
}

export interface SecurityLog {
    key: string;
    action: string;
    timestamp: number;
    success: boolean;
    attempts?: number;
}
