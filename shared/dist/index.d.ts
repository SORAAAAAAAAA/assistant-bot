export interface RegisterRequest {
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface LoginResponse {
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
