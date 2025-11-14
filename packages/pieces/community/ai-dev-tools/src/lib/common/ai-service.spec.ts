import { AIService } from './ai-service';
import { AIProvider, AIModel } from './types';

describe('AIService', () => {
  let aiService: AIService;

  beforeEach(() => {
    aiService = new AIService('test-api-key', AIProvider.OPENAI, AIModel.GPT4_TURBO);
  });

  describe('constructor', () => {
    it('should create an instance with valid parameters', () => {
      expect(aiService).toBeDefined();
      expect(aiService).toBeInstanceOf(AIService);
    });

    it('should accept different providers', () => {
      const openaiService = new AIService('key', AIProvider.OPENAI, AIModel.GPT4);
      const anthropicService = new AIService('key', AIProvider.ANTHROPIC, AIModel.CLAUDE_3_OPUS);
      const googleService = new AIService('key', AIProvider.GOOGLE, AIModel.GEMINI_PRO);

      expect(openaiService).toBeDefined();
      expect(anthropicService).toBeDefined();
      expect(googleService).toBeDefined();
    });
  });

  describe('generateCode', () => {
    it('should generate code based on prompt', async () => {
      const result = await aiService.generateCode(
        'Create a function to add two numbers',
        'javascript'
      );

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should accept different languages', async () => {
      const jsResult = await aiService.generateCode('Create a function', 'javascript');
      const pyResult = await aiService.generateCode('Create a function', 'python');

      expect(jsResult).toBeDefined();
      expect(pyResult).toBeDefined();
    });

    it('should accept options parameter', async () => {
      const result = await aiService.generateCode(
        'Create a function',
        'javascript',
        { framework: 'react', style: 'airbnb' }
      );

      expect(result).toBeDefined();
    });
  });

  describe('optimizeCode', () => {
    it('should optimize code for speed', async () => {
      const code = 'function slow() { for(let i=0; i<1000; i++) {} }';
      const result = await aiService.optimizeCode(code, 'speed');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should optimize code for memory', async () => {
      const code = 'let arr = new Array(10000);';
      const result = await aiService.optimizeCode(code, 'memory');

      expect(result).toBeDefined();
    });

    it('should accept options parameter', async () => {
      const code = 'function test() {}';
      const result = await aiService.optimizeCode(code, 'speed', { 
        preserveBehavior: true 
      });

      expect(result).toBeDefined();
    });
  });

  describe('debugCode', () => {
    it('should debug code with error message', async () => {
      const code = 'function test() { return a; }';
      const error = 'ReferenceError: a is not defined';
      const result = await aiService.debugCode(code, error, 'Node.js');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should accept context information', async () => {
      const code = 'let x = y;';
      const error = 'y is not defined';
      const context = 'Running in browser environment';
      const result = await aiService.debugCode(code, error, context);

      expect(result).toBeDefined();
    });
  });

  describe('generateTests', () => {
    it('should generate tests for given code', async () => {
      const code = 'function add(a, b) { return a + b; }';
      const result = await aiService.generateTests(code, 'jest');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should support different test frameworks', async () => {
      const code = 'function test() {}';
      const jestResult = await aiService.generateTests(code, 'jest');
      const pytestResult = await aiService.generateTests(code, 'pytest');

      expect(jestResult).toBeDefined();
      expect(pytestResult).toBeDefined();
    });
  });

  describe('createDocumentation', () => {
    it('should create documentation for code', async () => {
      const code = 'function calculate(x, y) { return x * y; }';
      const result = await aiService.createDocumentation(code, 'api');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should support different documentation types', async () => {
      const code = 'class MyClass {}';
      const apiDoc = await aiService.createDocumentation(code, 'api');
      const readmeDoc = await aiService.createDocumentation(code, 'readme');

      expect(apiDoc).toBeDefined();
      expect(readmeDoc).toBeDefined();
    });
  });

  describe('analyzeCodeQuality', () => {
    it('should analyze code quality', async () => {
      const code = 'function test() { let x = 1; return x; }';
      const result = await aiService.analyzeCodeQuality(code, 'javascript');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should work with different languages', async () => {
      const jsCode = 'let x = 1;';
      const pyCode = 'x = 1';
      
      const jsResult = await aiService.analyzeCodeQuality(jsCode, 'javascript');
      const pyResult = await aiService.analyzeCodeQuality(pyCode, 'python');

      expect(jsResult).toBeDefined();
      expect(pyResult).toBeDefined();
    });
  });

  describe('refactorCode', () => {
    it('should refactor code based on requirements', async () => {
      const code = 'function x() { let a = 1; let b = 2; return a + b; }';
      const requirements = 'Improve function naming';
      const result = await aiService.refactorCode(code, requirements);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should handle empty requirements', async () => {
      const code = 'function test() {}';
      const result = await aiService.refactorCode(code, '');

      expect(result).toBeDefined();
    });
  });

  describe('generateSchema', () => {
    it('should generate schema from description', async () => {
      const description = 'User with name, email, and age';
      const result = await aiService.generateSchema(description, 'json_schema');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should support different schema types', async () => {
      const description = 'Product entity';
      const jsonResult = await aiService.generateSchema(description, 'json_schema');
      const openapiResult = await aiService.generateSchema(description, 'openapi');

      expect(jsonResult).toBeDefined();
      expect(openapiResult).toBeDefined();
    });
  });

  describe('createAPIClient', () => {
    it('should create API client from specification', async () => {
      const spec = 'REST API with GET /users endpoint';
      const result = await aiService.createAPIClient(spec, 'javascript');

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should support different languages', async () => {
      const spec = 'Simple API';
      const jsResult = await aiService.createAPIClient(spec, 'javascript');
      const pyResult = await aiService.createAPIClient(spec, 'python');

      expect(jsResult).toBeDefined();
      expect(pyResult).toBeDefined();
    });
  });

  describe('static methods', () => {
    it('should get provider from model', () => {
      const provider = AIService.getProviderFromModel(AIModel.GPT4);
      expect(provider).toBe(AIProvider.OPENAI);
    });

    it('should get available models', () => {
      const models = AIService.getAvailableModels();
      expect(Array.isArray(models)).toBe(true);
      expect(models.length).toBeGreaterThan(0);
    });

    it('should get model info', () => {
      const info = AIService.getModelInfo(AIModel.GPT4_TURBO);
      expect(info).toBeDefined();
      expect(info).toHaveProperty('id');
      expect(info).toHaveProperty('provider');
      expect(info).toHaveProperty('displayName');
    });

    it('should return undefined for unknown model', () => {
      const info = AIService.getModelInfo('unknown-model' as AIModel);
      expect(info).toBeUndefined();
    });
  });
});