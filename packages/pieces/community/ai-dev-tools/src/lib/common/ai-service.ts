import { AIProvider, AIModel } from './types';
import { AI_MODELS, PROMPT_TEMPLATES } from './constants';

export class AIService {
  private apiKey: string;
  private provider: AIProvider;
  private model: AIModel;

  constructor(apiKey: string, provider: AIProvider, model: AIModel) {
    this.apiKey = apiKey;
    this.provider = provider;
    this.model = model;
  }

  async generateCode(prompt: string, language: string, options: any = {}): Promise<string> {
    const systemPrompt = this.getSystemPrompt('code-generation', language, options);
    return this.callAI(systemPrompt, prompt);
  }

  async optimizeCode(code: string, target: string, options: any = {}): Promise<string> {
    const systemPrompt = this.getSystemPrompt('code-optimization', target, options);
    const userPrompt = `Optimize this code for ${target}:\n\n${code}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async debugCode(code: string, error: string, context: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('code-debugging');
    const userPrompt = `Debug this code:\n\nCode:\n${code}\n\nError: ${error}\n\nContext: ${context}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async generateTests(code: string, framework: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('test-generation', framework);
    const userPrompt = `Generate tests for this code using ${framework}:\n\n${code}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async createDocumentation(code: string, type: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('documentation-generation', type);
    const userPrompt = `Create ${type} documentation for this code:\n\n${code}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async analyzeCodeQuality(code: string, language: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('code-quality-analysis', language);
    const userPrompt = `Analyze the quality of this ${language} code:\n\n${code}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async refactorCode(code: string, requirements: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('code-refactoring');
    const userPrompt = `Refactor this code according to these requirements: ${requirements}\n\n${code}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async generateSchema(description: string, type: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('schema-generation', type);
    const userPrompt = `Generate a ${type} schema for: ${description}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  async createAPIClient(specification: string, language: string): Promise<string> {
    const systemPrompt = this.getSystemPrompt('api-client-generation', language);
    const userPrompt = `Create an API client in ${language} based on this specification:\n\n${specification}`;
    return this.callAI(systemPrompt, userPrompt);
  }

  private getSystemPrompt(task: string, context?: string, options?: any): string {
    const basePrompts = {
      'code-generation': `You are an expert ${context} developer. Generate clean, well-structured, and maintainable code that follows best practices and industry standards.`,
      'code-optimization': `You are a code optimization expert. Focus on ${context} optimization while maintaining readability and correctness.`,
      'code-debugging': 'You are an expert debugger. Analyze code thoroughly and provide accurate, actionable fixes.',
      'test-generation': `You are a testing expert. Generate comprehensive tests using ${context} framework.`,
      'documentation-generation': `You are a technical writer. Create clear, comprehensive ${context} documentation.`,
      'code-quality-analysis': `You are a code quality expert. Analyze ${context} code for quality metrics and improvements.`,
      'code-refactoring': 'You are a refactoring expert. Improve code structure while preserving functionality.',
      'schema-generation': `You are a data modeling expert. Create accurate ${context} schemas.`,
      'api-client-generation': `You are an API integration expert. Create robust ${context} API clients.`
    };

    return basePrompts[task] || 'You are an AI development assistant.';
  }

  private async callAI(systemPrompt: string, userPrompt: string): Promise<string> {
    // This is a simplified implementation. In a real implementation,
    // you would use the specific SDK for each provider (OpenAI, Anthropic, etc.)
    
    const selectedModel = AI_MODELS.find(m => m.id === this.model);
    if (!selectedModel) {
      throw new Error(`Model ${this.model} not found`);
    }

    // For now, return a mock response
    // In production, implement actual API calls to the AI providers
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`// AI Generated Response (${selectedModel.displayName})\n// ${selectedModel.description}\n\n${userPrompt}`);
      }, 1000);
    });
  }

  static getProviderFromModel(model: AIModel): AIProvider {
    const modelInfo = AI_MODELS.find(m => m.id === model);
    return modelInfo?.provider || AIProvider.OPENAI;
  }

  static getAvailableModels(): AIModel[] {
    return AI_MODELS.map(m => m.id as AIModel);
  }

  static getModelInfo(model: AIModel): any {
    return AI_MODELS.find(m => m.id === model);
  }
}