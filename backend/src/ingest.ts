import * as fs from 'fs';
import * as path from 'path';
import { RagService } from './rag/rag.service';

const DOCS_DIR = path.join(__dirname, '../../documents');
async function run() {
    const rag = new RagService();
    const files = fs
        .readdirSync(DOCS_DIR)
        .filter((f) => f.endsWith('.txt') || f.endsWith('.md'));
    for (const filename of files) {
        const text = fs.readFileSync(path.join(DOCS_DIR, filename), 'utf-8');
        console.log(`Ingesting ${filename} (${text.length} chars)...`);
        await rag.addDocument(filename, text, filename);
    }
    console.log('Done.');
}

run();