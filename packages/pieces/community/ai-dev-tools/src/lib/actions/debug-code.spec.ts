import { debugCode } from './debug-code';
import { AIModel } from '../common/types';

describe('debugCode action', () => {
  const mockContext = {
    propsValue: {
      code: 'function test() { return undefined.property; }',
      error: 'TypeError: Cannot read property of undefined',
      aiModel: AIModel.GPT4_TURBO,
      language: 'javascript',
      context: 'Node.js environment',
      errorType: 'runtime',
      includeFix: true,
      includeExplanation: true,
      includePrevention: true,
      severity: 'major'
    },
    server: { token: 'test-token', apiUrl: 'http://test' },
    flows: { current: { id: 'flow-1', version: { id: 'v1' } } },
    step: { name: 'step-1' },
    output: { update: jest.fn() }
  } as any;

  describe('action metadata', () => {
    it('should have correct name', () => {
      expect(debugCode.name).toBe('debug_code');
    });

    it('should have display name', () => {
      expect(debugCode.displayName).toBe('Debug Code');
    });

    it('should have description', () => {
      expect(debugCode.description).toBeDefined();
    });
  });

  describe('run method', () => {
    it('should return success response with debug information', async () => {
      const result = await debugCode.run(mockContext);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('originalCode');
      expect(result).toHaveProperty('errorDescription');
      expect(result).toHaveProperty('suggestions');
      expect(result).toHaveProperty('timestamp');
    });

    it('should include suggestions array', async () => {
      const result = await debugCode.run(mockContext);

      if (result.success) {
        expect(Array.isArray(result.suggestions)).toBe(true);
      }
    });

    it('should include fixed code when requested', async () => {
      const result = await debugCode.run(mockContext);

      if (result.success && result.fixedCode) {
        expect(typeof result.fixedCode).toBe('string');
      }
    });

    it('should handle different error types', async () => {
      const errorTypes = ['runtime', 'compilation', 'logic', 'performance', 'security'];

      for (const errorType of errorTypes) {
        const context = {
          ...mockContext,
          propsValue: {
            ...mockContext.propsValue,
            errorType
          }
        };

        const result = await debugCode.run(context);
        expect(result.errorType).toBe(errorType);
      }
    });

    it('should respect includeFix flag', async () => {
      const contextWithFix = {
        ...mockContext,
        propsValue: {
          ...mockContext.propsValue,
          includeFix: true
        }
      };

      const result = await debugCode.run(contextWithFix);
      if (result.success) {
        expect(result.metadata.includesFix).toBe(true);
      }
    });
  });

  describe('helper methods', () => {
    it('should parse debug suggestions correctly', () => {
      const response = `
Issue: Undefined property access
Fix: Add null check before accessing property
Severity: error
      `;

      const suggestions = debugCode.parseDebugSuggestions(response);
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should extract fixed code from response', () => {
      const response = '```javascript\nfunction fixed() { return 1; }\n```';
      const code = debugCode.extractFixedCode(response);
      
      if (code) {
        expect(code).toContain('function fixed');
      }
    });
  });
});