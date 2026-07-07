/**
 * Amazon Bedrock adapter — uses the Converse API so the same code works
 * across any Bedrock-hosted model without SDK-per-model wrappers.
 *
 * Configuration (environment variables):
 *   BEDROCK_MODEL_ID  — model ARN or ID (default: anthropic.claude-3-5-sonnet-20241022-v2:0)
 *   AWS_REGION        — AWS region (default: us-east-1)
 *
 * Credentials are resolved via the AWS default credentials chain (environment
 * variables, shared config file, IAM role, etc.). No keys are hard-coded.
 */

import {
  BedrockRuntimeClient,
  ConverseCommand,
  type Message,
} from '@aws-sdk/client-bedrock-runtime';
import type { LLMAdapter, CompletionOptions } from './llmAdapter.js';

const DEFAULT_MODEL_ID = 'anthropic.claude-3-5-sonnet-20241022-v2:0';
const DEFAULT_REGION = 'us-east-1';
const DEFAULT_MAX_TOKENS = 4096;

export class BedrockAdapter implements LLMAdapter {
  private readonly client: BedrockRuntimeClient;
  private readonly modelId: string;

  constructor() {
    const region = process.env['AWS_REGION'] ?? DEFAULT_REGION;
    this.modelId = process.env['BEDROCK_MODEL_ID'] ?? DEFAULT_MODEL_ID;

    this.client = new BedrockRuntimeClient({ region });
  }

  async complete(
    systemPrompt: string,
    userMessage: string,
    options: CompletionOptions = {},
  ): Promise<string> {
    const { maxTokens = DEFAULT_MAX_TOKENS, temperature = 0.3 } = options;

    const messages: Message[] = [
      { role: 'user', content: [{ text: userMessage }] },
    ];

    const command = new ConverseCommand({
      modelId: this.modelId,
      system: [{ text: systemPrompt }],
      messages,
      inferenceConfig: {
        maxTokens,
        temperature,
      },
    });

    const response = await this.client.send(command);

    const outputMessage = response.output?.message;
    if (!outputMessage?.content?.length) {
      throw new Error('Bedrock returned an empty response.');
    }

    // Collect all text blocks from the response.
    const text = outputMessage.content
      .filter((block) => block.text !== undefined)
      .map((block) => block.text as string)
      .join('');

    if (!text) {
      throw new Error('Bedrock response contained no text content.');
    }

    return text;
  }
}
