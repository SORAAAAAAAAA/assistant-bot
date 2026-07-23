import { Module } from '@nestjs/common';
import { IntentRouterService } from './intent.service';

@Module({
    providers: [IntentRouterService],
    exports: [IntentRouterService],
})
export class IntentModule {}
