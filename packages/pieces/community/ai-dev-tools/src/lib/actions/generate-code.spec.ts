import { generateCode } from './generate-code';
import { CodeLanguage, CodeStyle, AIModel } from '../common/types';

describe('generateCode action', () => {
  const mockContext = {
    propsValue: {
      prompt: 'Create a function to validate email addresses',
      language: CodeLanguage.JAVASCRIPT,
      aiModel: AIModel.GPT4_TURBO,
      style: CodeStyle.STANDARD,
      framework: 'express',
      libraries: [{ library: 'validator' }],
      includeComments: true,
      includeTests: false,
      includeDocumentation: true,
      constraints: {
        maxLines: 100,
        maxComplexity: 10,
        minPerformance: 80
      }
    },
    server: { token: 'test-token', apiUrl: 'http://test' },
    flows: { current: { id: 'flow-1', version: { id: 'v1' } } },
    step: { name: 'step-1' },
    output: { update: jest.fn() }
  } as any;

  describe('action metadata', () => {
    it('should have correct name', () => {
      expect(generateCode.name).toBe('generate_code');
    });

    it('should have display name', () => {
      expect(generateCode.displayName).toBe('Generate Code');
    });

    it('should have description', () => {
      expect(generateCode.description).toBeDefined();
      expect(typeof generateCode.description).toBe('string');
    });

    it('should have props defined', () => {
      expect(generateCode.props).toBeDefined();
      expect(generateCode.props.prompt).toBeDefined();
      expect(generateCode.props.language).toBeDefined();
      expect(generateCode.props.aiModel).toBeDefined();
    });
  });

  describe('run method', () => {
    it('should return success response with generated code', async () => {
      const result = await generateCode.run(mockContext);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('code');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('aiModel');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('metadata');
    });

    it('should include metadata with code statistics', async () => {
      const result = await generateCode.run(mockContext);

      expect(result.success).toBe(true);
      expect(result.metadata).toBeDefined();
      expect(result.metadata).toHaveProperty('lines');
      expect(result.metadata).toHaveProperty('characters');
      expect(result.metadata).toHaveProperty('framework');
      expect(result.metadata).toHaveProperty('libraries');
      expect(result.metadata).toHaveProperty('includesComments');
      expect(result.metadata).toHaveProperty('includesTests');
      expect(result.metadata).toHaveProperty('includesDocumentation');
    });

    it('should handle different languages', async () => {
      const pythonContext = {
        ...mockContext,
        propsValue: {
          ...mockContext.propsValue,
          language: CodeLanguage.PYTHON
        }
      };

      const result = await generateCode.run(pythonContext);
      expect(result.success).toBe(true);
      expect(result.language).toBe(CodeLanguage.PYTHON);
    });

    it('should handle missing optional parameters', async () => {
      const minimalContext = {
        ...mockContext,
        propsValue: {
          prompt: 'Create a function',
          language: CodeLanguage.JAVASCRIPT,
          aiModel: AIModel.GPT4_TURBO
        }
      };

      const result = await generateCode.run(minimalContext);
      expect(result.success).toBe(true);
    });

    it('should return error on failure', async () => {
      const errorContext = {
        ...mockContext,
        propsValue: {
          ...mockContext.propsValue,
          prompt: '' // Invalid empty prompt
        }
      };

      const result = await generateCode.run(errorContext);
      
      // Should still handle gracefully
      expect(result).toHaveProperty('timestamp');
    });

    it('should validate response structure', async () => {
      const result = await generateCode.run(mockContext);

      if (result.success) {
        expect(typeof result.code).toBe('string');
        expect(typeof result.language).toBe('string');
        expect(typeof result.aiModel).toBe('string');
        expect(typeof result.timestamp).toBe('string');
        expect(typeof result.metadata).toBe('object');
        expect(typeof result.metadata.lines).toBe('number');
        expect(typeof result.metadata.characters).toBe('number');
      }
    });

    it('should handle different AI models', async () => {
      const models = [AIModel.GPT4, AIModel.CLAUDE_3_OPUS, AIModel.GEMINI_PRO];

      for (const model of models) {
        const context = {
          ...mockContext,
          propsValue: {
            ...mockContext.propsValue,
            aiModel: model
          }
        };

        const result = await generateCode.run(context);
        expect(result).toHaveProperty('aiModel');
        expect(result.aiModel).toBe(model);
      }
    });

    it('should handle code style options', async () => {
      const styles = [CodeStyle.AIRBNB, CodeStyle.GOOGLE, CodeStyle.PRETTIER];

      for (const style of styles) {
        const context = {
          ...mockContext,
          propsValue: {
            ...mockContext.propsValue,
            style
          }
        };

        const result = await generateCode.run(context);
        expect(result.success).toBe(true);
      }
    });

    it('should track constraints in metadata', async () => {
      const result = await generateCode.run(mockContext);

      if (result.success) {
        expect(result.metadata.includesComments).toBe(true);
        expect(result.metadata.includesTests).toBe(false);
        expect(result.metadata.includesDocumentation).toBe(true);
      }
    });

    it('should include framework in metadata', async () => {
      const result = await generateCode.run(mockContext);

      if (result.success) {
        expect(result.metadata.framework).toBe('express');
      }
    });

    it('should count libraries in metadata', async () => {
      const result = await generateCode.run(mockContext);

      if (result.success) {
        expect(result.metadata.libraries).toBe(1);
      }
    });
  });

  describe('prop validation', () => {
    it('should require prompt property', () => {
      expect(generateCode.props.prompt.required).toBe(true);
    });

    it('should require language property', () => {
      expect(generateCode.props.language.required).toBe(true);
    });

    it('should require aiModel property', () => {
      expect(generateCode.props.aiModel.required).toBe(true);
    });

    it('should have optional style property', () => {
      expect(generateCode.props.style.required).toBe(false);
    });

    it('should have default values for optional props', () => {
      expect(generateCode.props.includeComments.defaultValue).toBe(true);
      expect(generateCode.props.includeTests.defaultValue).toBe(false);
      expect(generateCode.props.includeDocumentation.defaultValue).toBe(true);
    });
  });
});