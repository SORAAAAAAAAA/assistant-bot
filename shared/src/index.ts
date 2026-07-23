export type DepartmentType = 'HR' | 'OJS' | 'Finance' | 'MIS' | 'GA' | 'OOS';

export interface UserProfile {
    fullName: string;
    department: DepartmentType;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    department: DepartmentType;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    message: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
    userProfile: UserProfile,
    access_token: string;
    token_type: "bearer";
}
export interface ChatRequest {
    message: string;
}
export interface ChatResponse {
    answer: string;
    sources: string[];
}
export interface ChatHistoryEntry {
    id: number;
    message: string;
    answer: string;
    sources: string[];
    createdAt: string;
}
