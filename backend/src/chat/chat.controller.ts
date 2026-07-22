import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { type User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ChatService } from './chat.service';
import { ChatDto } from '@/chat/dto/chat.dto';

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