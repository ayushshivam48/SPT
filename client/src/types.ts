export interface UserRole {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
}

export interface ErrorResponse {
    response?: {
        data?: {
            message: string;
        };
    };
}

export interface Assignment {
    _id: string;
    course: string;
    semester: number;
    subject: string;
}

export interface Student {
    _id: string;
    name: string;
    enrollment: string;
}

export interface Attendance {
    [key: string]: 'present' | 'absent';
}
