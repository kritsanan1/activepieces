import { optimizeCode } from './optimize-code';
import { AIModel } from '../common/types';

describe('optimizeCode action', () => {
  const mockContext = {
    propsValue: {
      code: 'function slowFunction() { for(let i=0; i<10000; i++) { console.log(i); } }',
      aiModel: AIModel.GPT4_TURBO,
      optimizationTarget: 'speed',
      optimizationLevel: 'refactor',
      preserveBehavior: true,
      testCoverage: true,
      performanceBenchmarks: true,
      explainChanges: true
    },
    server: { token: 'test-token', apiUrl: 'http://test' },
    flows: { current: { id: 'flow-1', version: { id: 'v1' } } },
    step: { name: 'step-1' },
    output: { update: jest.fn() }
  } as any;

  describe('action metadata', () => {
    it('should have correct name', () => {
      expect(optimizeCode.name).toBe('optimize_code');
    });

    it('should have display name', () => {
      expect(optimizeCode.displayName).toBe('Optimize Code');
    });

    it('should have description', () => {
      expect(optimizeCode.description).toBeDefined();
    });

    it('should have props defined', () => {
      expect(optimizeCode.props).toBeDefined();
      expect(optimizeCode.props.code).toBeDefined();
      expect(optimizeCode.props.optimizationTarget).toBeDefined();
      expect(optimizeCode.props.optimizationLevel).toBeDefined();
    });
  });

  describe('run method', () => {
    it('should return success response', async () => {
      const result = await optimizeCode.run(mockContext);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('originalCode');
      expect(result).toHaveProperty('optimizedCode');
      expect(result).toHaveProperty('optimization');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('metadata');
    });

    it('should include both original and optimized code', async () => {
      const result = await optimizeCode.run(mockContext);

      expect(result.success).toBe(true);
      expect(result.originalCode).toBe(mockContext.propsValue.code);
      expect(result.optimizedCode).toBeDefined();
      expect(typeof result.optimizedCode).toBe('string');
    });

    it('should include optimization details', async () => {
      const result = await optimizeCode.run(mockContext);

      if (result.success) {
        expect(result.optimization).toBeDefined();
        expect(result.optimization.target).toBe('speed');
        expect(result.optimization.level).toBe('refactor');
        expect(result.optimization.preserveBehavior).toBe(true);
      }
    });

    it('should handle different optimization targets', async () => {
      const targets = ['speed', 'memory', 'size', 'readability', 'balanced'];

      for (const target of targets) {
        const context = {
          ...mockContext,
          propsValue: {
            ...mockContext.propsValue,
            optimizationTarget: target
          }
        };

        const result = await optimizeCode.run(context);
        expect(result.success).toBe(true);
      }
    });

    it('should handle different optimization levels', async () => {
      const levels = ['suggest', 'refactor', 'rewrite'];

      for (const level of levels) {
        const context = {
          ...mockContext,
          propsValue: {
            ...mockContext.propsValue,
            optimizationLevel: level
          }
        };

        const result = await optimizeCode.run(context);
        expect(result.success).toBe(true);
      }
    });

    it('should calculate metadata statistics', async () => {
      const result = await optimizeCode.run(mockContext);

      if (result.success) {
        expect(result.metadata).toBeDefined();
        expect(result.metadata.originalLines).toBeGreaterThan(0);
        expect(result.metadata.optimizedLines).toBeGreaterThan(0);
        expect(result.metadata.optimizationTarget).toBe('speed');
        expect(result.metadata.optimizationLevel).toBe('refactor');
      }
    });

    it('should respect preserve behavior flag', async () => {
      const result = await optimizeCode.run(mockContext);

      if (result.success) {
        expect(result.optimization.preserveBehavior).toBe(true);
      }
    });

    it('should handle test coverage option', async () => {
      const context = {
        ...mockContext,
        propsValue: {
          ...mockContext.propsValue,
          testCoverage: true
        }
      };

      const result = await optimizeCode.run(context);
      if (result.success) {
        expect(result.optimization.includesTests).toBe(true);
      }
    });
  });

  describe('prop validation', () => {
    it('should require code property', () => {
      expect(optimizeCode.props.code.required).toBe(true);
    });

    it('should require aiModel property', () => {
      expect(optimizeCode.props.aiModel.required).toBe(true);
    });

    it('should have default values', () => {
      expect(optimizeCode.props.preserveBehavior.defaultValue).toBe(true);
      expect(optimizeCode.props.performanceBenchmarks.defaultValue).toBe(true);
      expect(optimizeCode.props.explainChanges.defaultValue).toBe(true);
    });
  });
});