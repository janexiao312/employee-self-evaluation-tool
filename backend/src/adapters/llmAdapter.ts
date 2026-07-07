/**
 * LLM adapter interface.
 *
 * Concrete adapters (Bedrock, Azure OpenAI) implement this interface so the
 * rest of the codebase can swap providers via environment variable without
 * changing any business logic.
 */

export interface CompletionOptions {
  /** Maximum number of tokens the model may generate. */
  maxTokens?: number;
  /** Sampling temperature (0 = deterministic, 1 = creative). */
  temperature?: number;
  /** Request-level timeout in milliseconds. */
  timeoutMs?: number;
}

export interface LLMAdapter {
  /**
   * Send a system prompt + user message to the underlying LLM and return the
   * raw text content of the model's first response.
   */
  complete(
    systemPrompt: string,
    userMessage: string,
    options?: CompletionOptions,
  ): Promise<string>;
}
