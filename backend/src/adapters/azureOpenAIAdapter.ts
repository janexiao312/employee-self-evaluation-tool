/**
 * Azure OpenAI adapter — wraps the official `openai` npm package's
 * AzureOpenAI client.
 *
 * Configuration (environment variables — all required at runtime):
 *   AZURE_OPENAI_ENDPOINT    — e.g. https://<resource>.openai.azure.com
 *   AZURE_OPENAI_API_KEY     — subscription key
 *   AZURE_OPENAI_DEPLOYMENT  — deployment name (model alias in Azure portal)
 */

import { AzureOpenAI } from 'openai';
import type { LLMAdapter, CompletionOptions } from './llmAdapter.js';

const DEFAULT_API_VERSION = '2024-05-01-preview';
const DEFAULT_MAX_TOKENS = 4096;

export class AzureOpenAIAdapter implements LLMAdapter {
  private readonly client: AzureOpenAI;
  private readonly deployment: string;

  constructor() {
    const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
    const apiKey = process.env['AZURE_OPENAI_API_KEY'];
    const deployment = process.env['AZURE_OPENAI_DEPLOYMENT'];

    if (!endpoint) {
      throw new Error('AZURE_OPENAI_ENDPOINT environment variable is not set.');
    }
    if (!apiKey) {
      throw new Error('AZURE_OPENAI_API_KEY environment variable is not set.');
    }
    if (!deployment) {
      throw new Error(
        'AZURE_OPENAI_DEPLOYMENT environment variable is not set.',
      );
    }

    this.deployment = deployment;
    this.client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion: DEFAULT_API_VERSION,
      deployment,
    });
  }

  async complete(
    systemPrompt: string,
    userMessage: string,
    options: CompletionOptions = {},
  ): Promise<string> {
    const { maxTokens = DEFAULT_MAX_TOKENS, temperature = 0.3 } = options;

    const response = await this.client.chat.completions.create({
      model: this.deployment,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      max_tokens: maxTokens,
      temperature,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Azure OpenAI returned an empty response.');
    }

    return content;
  }
}
