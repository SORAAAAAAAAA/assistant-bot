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
    sessionId?: number;
}
export interface ChatResponse {
    answer?: string;
    sources?: string[];
    chatId?: number | string; // keeping for backward compat temporarily, though we use sessionId mostly
    sessionId?: number;
}
export interface ChatMessageDto {
    id: number;
    sessionId: number;
    role: string;
    content: string;
    sources: string[];
    createdAt: string;
}
export interface ChatSessionDto {
    id: number;
    title: string;
    messages?: ChatMessageDto[];
    createdAt: string;
    updatedAt: string;
}
