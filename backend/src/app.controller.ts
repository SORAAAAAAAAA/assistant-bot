import { Controller, Get } from '@nestjs/common';

@Controller() // Empty string means root route ("/")
export class AppController {

    @Get() // Listens for GET requests on the root route
    checkHealth() {
        return {
            status: 'ok',
            message: 'Assistant Bot API is running!',
            timestamp: new Date().toISOString()
        };
    }
}
