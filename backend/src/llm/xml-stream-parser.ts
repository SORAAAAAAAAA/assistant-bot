export class XmlStreamParser {
    private rawOutput = '';
    private cleanEmitted = '';
    private insideResponse = false;
    private readonly openTag = '<response>';
    private readonly closeTag = '</response>';

    constructor(
        private readonly onContent: (chunk: string) => void
    ) { }

    processChunk(chunk: string) {
        this.rawOutput += chunk;

        if (!this.insideResponse) {
            const startIndex = this.rawOutput.indexOf(this.openTag);
            if (startIndex !== -1) {
                this.insideResponse = true;
                this.emitExtractable();
            }
        } else {
            this.emitExtractable();
        }
    }

    private emitExtractable() {
        const startIndex = this.rawOutput.indexOf(this.openTag);
        if (startIndex === -1) return;

        const contentSoFar = this.rawOutput.substring(startIndex + this.openTag.length);
        const endIndex = contentSoFar.indexOf(this.closeTag);

        let extractable = '';
        if (endIndex !== -1) {
            // We found the full closing tag
            extractable = contentSoFar.substring(0, endIndex);
        } else {
            // No close tag yet. But a partial close tag might be at the end of the stream.
            // Check if the end of contentSoFar matches any prefix of "</response>"
            let safeLength = contentSoFar.length;

            for (let i = 1; i < this.closeTag.length; i++) {
                if (contentSoFar.endsWith(this.closeTag.substring(0, i))) {
                    safeLength = contentSoFar.length - i;
                    break; // found the longest matching prefix at the end
                }
            }
            extractable = contentSoFar.substring(0, safeLength);
        }

        const newContent = extractable.substring(this.cleanEmitted.length);
        if (newContent.length > 0) {
            this.onContent(newContent);
            this.cleanEmitted += newContent;
        }
    }

    getCleanEmitted(): string {
        return this.cleanEmitted.trim();
    }

    getRawOutput(): string {
        return this.rawOutput;
    }
}
