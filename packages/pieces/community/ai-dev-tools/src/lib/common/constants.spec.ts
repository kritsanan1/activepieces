import { AI_MODELS, CODE_LANGUAGES, CODE_STYLE_GUIDES, PROMPT_TEMPLATES } from './constants';
import { AIProvider, CodeLanguage } from './types';

describe('Constants', () => {
  describe('AI_MODELS', () => {
    it('should have at least 8 AI models', () => {
      expect(AI_MODELS.length).toBeGreaterThanOrEqual(8);
    });

    it('should have GPT models from OpenAI', () => {
      const openaiModels = AI_MODELS.filter(m => m.provider === AIProvider.OPENAI);
      expect(openaiModels.length).toBeGreaterThan(0);
      expect(openaiModels.some(m => m.id === 'gpt-4-turbo')).toBe(true);
    });

    it('should have Claude models from Anthropic', () => {
      const anthropicModels = AI_MODELS.filter(m => m.provider === AIProvider.ANTHROPIC);
      expect(anthropicModels.length).toBeGreaterThan(0);
      expect(anthropicModels.some(m => m.id.includes('claude'))).toBe(true);
    });

    it('should have Gemini models from Google', () => {
      const googleModels = AI_MODELS.filter(m => m.provider === AIProvider.GOOGLE);
      expect(googleModels.length).toBeGreaterThan(0);
      expect(googleModels.some(m => m.id.includes('gemini'))).toBe(true);
    });

    it('should have required properties for each model', () => {
      AI_MODELS.forEach(model => {
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('provider');
        expect(model).toHaveProperty('displayName');
        expect(model).toHaveProperty('maxTokens');
        expect(model).toHaveProperty('description');
        expect(typeof model.maxTokens).toBe('number');
        expect(model.maxTokens).toBeGreaterThan(0);
      });
    });
  });

  describe('CODE_LANGUAGES', () => {
    it('should have at least 6 programming languages', () => {
      expect(CODE_LANGUAGES.length).toBeGreaterThanOrEqual(6);
    });

    it('should include JavaScript and TypeScript', () => {
      const jsLang = CODE_LANGUAGES.find(l => l.id === CodeLanguage.JAVASCRIPT);
      const tsLang = CODE_LANGUAGES.find(l => l.id === CodeLanguage.TYPESCRIPT);
      
      expect(jsLang).toBeDefined();
      expect(tsLang).toBeDefined();
      expect(jsLang?.extensions).toContain('.js');
      expect(tsLang?.extensions).toContain('.ts');
    });

    it('should have required properties for each language', () => {
      CODE_LANGUAGES.forEach(lang => {
        expect(lang).toHaveProperty('id');
        expect(lang).toHaveProperty('displayName');
        expect(lang).toHaveProperty('extensions');
        expect(lang).toHaveProperty('description');
        expect(Array.isArray(lang.extensions)).toBe(true);
        expect(lang.extensions.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CODE_STYLE_GUIDES', () => {
    it('should have multiple style guides', () => {
      expect(CODE_STYLE_GUIDES.length).toBeGreaterThan(0);
    });

    it('should include popular style guides', () => {
      const styleIds = CODE_STYLE_GUIDES.map(s => s.id);
      expect(styleIds).toContain('standard');
      expect(styleIds).toContain('airbnb');
      expect(styleIds).toContain('google');
      expect(styleIds).toContain('prettier');
    });

    it('should have required properties for each style guide', () => {
      CODE_STYLE_GUIDES.forEach(style => {
        expect(style).toHaveProperty('id');
        expect(style).toHaveProperty('displayName');
        expect(style).toHaveProperty('description');
      });
    });
  });

  describe('PROMPT_TEMPLATES', () => {
    it('should have template for code generation', () => {
      expect(PROMPT_TEMPLATES).toHaveProperty('codeGeneration');
      expect(typeof PROMPT_TEMPLATES.codeGeneration).toBe('function');
    });

    it('should generate valid code generation prompt', () => {
      const prompt = PROMPT_TEMPLATES.codeGeneration('javascript', 'Create a function', 'standard');
      expect(prompt).toContain('javascript');
      expect(prompt).toContain('Create a function');
      expect(prompt).toContain('standard');
    });

    it('should have template for code optimization', () => {
      expect(PROMPT_TEMPLATES).toHaveProperty('codeOptimization');
      expect(typeof PROMPT_TEMPLATES.codeOptimization).toBe('function');
    });

    it('should generate valid optimization prompt', () => {
      const code = 'function test() { return 1; }';
      const prompt = PROMPT_TEMPLATES.codeOptimization(code, 'speed', 'refactor');
      expect(prompt).toContain(code);
      expect(prompt).toContain('speed');
      expect(prompt).toContain('refactor');
    });

    it('should have template for code debugging', () => {
      expect(PROMPT_TEMPLATES).toHaveProperty('codeDebugging');
      expect(typeof PROMPT_TEMPLATES.codeDebugging).toBe('function');
    });

    it('should have template for test generation', () => {
      expect(PROMPT_TEMPLATES).toHaveProperty('testGeneration');
      expect(typeof PROMPT_TEMPLATES.testGeneration).toBe('function');
    });

    it('should have template for documentation', () => {
      expect(PROMPT_TEMPLATES).toHaveProperty('documentation');
      expect(typeof PROMPT_TEMPLATES.documentation).toBe('function');
    });

    it('should generate valid documentation prompt', () => {
      const code = 'function test() {}';
      const prompt = PROMPT_TEMPLATES.documentation(code, 'API');
      expect(prompt).toContain(code);
      expect(prompt).toContain('API');
    });
  });
});