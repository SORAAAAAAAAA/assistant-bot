export const LlmConfig = {
    NUM_CTX: 8192,
    NUM_PREDICT: 2048,
    CHARS_PER_TOKEN: 4,
    TEMPERATURE: 0.0,
    TOP_K: 10,
    TOP_P: 0.8,
};

export const INPUT_BUDGET = LlmConfig.NUM_CTX - LlmConfig.NUM_PREDICT;
