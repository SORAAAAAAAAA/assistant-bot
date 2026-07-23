import { Module } from '@nestjs/common';
import { OllamaService } from '@/llm/ollama.service';

@Module({
    providers: [OllamaService],
    exports: [OllamaService]
})
export class LlmModule { }