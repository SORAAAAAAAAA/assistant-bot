import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ChatRequest } from '@ai-assistant/shared';

export class ChatDto implements ChatRequest {
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsNumber()
    sessionId?: number;
}