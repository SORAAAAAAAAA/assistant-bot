import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { RagModule } from './rag/rag.module';
import { IntentModule } from './intent/intent.module';
import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RagModule,
    IntentModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
