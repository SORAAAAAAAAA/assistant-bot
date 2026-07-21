import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
        });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('[PRISMA SERVICE] Connected to database:', process.env.DATABASE_URL);
        } catch (error) {
            console.error('[PRISMA SERVICE] Failed to connect to database:', error);
        }
    }
}
