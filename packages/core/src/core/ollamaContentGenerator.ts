/**
 * @license
 * Copyright 2025 innoLab.ca
 * SPDX-License-Identifier: Apache-2.0
 */

import fetch from 'node-fetch';
import {
  CountTokensResponse,
  GenerateContentResponse,
  GenerateContentParameters,
  CountTokensParameters,
  EmbedContentResponse,
  EmbedContentParameters,
  Content,
} from '@google/genai';
import { ContentGenerator } from './contentGenerator.js';

export class OllamaContentGenerator implements ContentGenerator {
  private readonly host: string;

  private selectedModel: string | undefined;

  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:7162';
  }

  async listModels(): Promise<string[]> {
    const response = await fetch(`${this.host}/api/tags`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as { models: Array<{ name: string }> };
    return data.models.map((model) => model.name);
  }

  setModel(model: string) {
    this.selectedModel = model;
  }

  async generateContent(
    request: GenerateContentParameters,
  ): Promise<GenerateContentResponse> {
    if (!this.selectedModel) {
      throw new Error('Model not selected');
    }
    if (!request.model) {
      request.model = this.selectedModel;
    }

    const contents = request.contents as Content[];
    if (!contents || contents.length === 0) {
      throw new Error('Contents are empty in the request');
    }

    const firstContent = contents[0];
    if (!firstContent.parts || firstContent.parts.length === 0) {
      throw new Error('No parts in the first content element');
    }

    const firstPart = firstContent.parts[0];
    if (!('text' in firstPart)) {
      throw new Error('First part does not contain text');
    }

    const promptText = firstPart.text;

    const response = await fetch(`${this.host}/api/generate`, {
      method: 'POST',
      body: JSON.stringify({
        model: request.model,
        prompt: promptText,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: unknown = await response.json();

    return {
      candidates: [
        {
          content: {
            parts: [{ text: (data as { response: string }).response }],
            role: 'model',
          },
        },
      ],
    } as GenerateContentResponse;
  }

  async generateContentStream(
    request: GenerateContentParameters,
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    async function* generator(
      this: OllamaContentGenerator,
    ): AsyncGenerator<GenerateContentResponse> {
      const response = await this.generateContent(request);
      yield response;
    }
    return generator.call(this);
  }

  async countTokens(
    _request: CountTokensParameters,
  ): Promise<CountTokensResponse> {
    // TODO: Implement this method
    throw new Error('Method not implemented.');
  }

  async embedContent(
    _request: EmbedContentParameters,
  ): Promise<EmbedContentResponse> {
    // TODO: Implement this method
    throw new Error('Method not implemented.');
  }
}
