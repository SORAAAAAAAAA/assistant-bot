import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { type User } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ChatService } from './chat.service';
import { ChatRequest } from '@ai-assistant/shared';
class ChatDto implements ChatRequest {
    @IsNotEmpty()
    message: string;
}
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }
    @Post()
    ask(@Body() dto: ChatDto, @CurrentUser() user: User) {
        return this.chatService.ask(user.id, dto.message);
    }
    @Get('history')
    history(@CurrentUser() user: User) {
        return this.chatService.getHistory(user.id);
    }
}