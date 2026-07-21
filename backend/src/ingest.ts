import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();
import { RagService } from './rag/rag.service';
import { PDFParse } from 'pdf-parse';

const DOCS_DIR = path.join(__dirname, '../../documents');
async function run() {
    const rag = new RagService();
    const files = fs
        .readdirSync(DOCS_DIR)
        .filter((f) => f.endsWith('.txt') || f.endsWith('.md') || f.endsWith('.pdf'));
    for (const filename of files) {
        const filePath = path.join(DOCS_DIR, filename);
        let text = '';

        if (filename.endsWith('.pdf')) {
            const parser = new PDFParse({ url: filePath })
            const result = await parser.getText();
            text = result.text;
        } else {
            text = fs.readFileSync(filePath, 'utf-8');
        }

        console.log(`Ingesting ${filename} (${text.length} chars)...`);
        await rag.addDocument(filename, text, filename);
    }
    console.log('Done.');
}

run();