import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { type User } from '@prisma/client';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ChatService } from './chat.service';
import { ChatDto } from '@/chat/dto/chat.dto';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }
    @Post()
    async ask(@Body() dto: ChatDto, @CurrentUser() user: User, @Res() res: Response) {
        res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        await this.chatService.askStream(
            user.id,
            dto.message,
            (data) => {
                res.write(JSON.stringify(data) + '\n');
                if (typeof (res as any).flush === 'function') {
                    (res as any).flush();
                }
            },
            () => res.end(),
            (err) => {
                console.error(err);
                res.status(500).end('Internal Server Error');
            }
        );
    }
    @Get('history')
    history(@CurrentUser() user: User) {
        return this.chatService.getHistory(user.id);
    }
}