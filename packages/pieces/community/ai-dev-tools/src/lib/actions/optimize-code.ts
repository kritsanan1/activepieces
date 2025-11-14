import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel } from '../common/types';

export const optimizeCode = createAction({
  name: 'optimize_code',
  displayName: 'Optimize Code',
  description: 'Optimize existing code for performance, memory usage, or readability using AI',
  props: {
    code: Property.LongText({
      displayName: 'Code to Optimize',
      description: 'Paste the code you want to optimize',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for optimization',
      required: true,
      defaultValue: 'gpt-4-turbo',
      options: {
        options: [
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'GPT-4', value: 'gpt-4' },
          { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
          { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
        ]
      }
    }),
    optimizationTarget: Property.StaticDropdown({
      displayName: 'Optimization Target',
      description: 'What aspect should be optimized?',
      required: true,
      defaultValue: 'speed',
      options: {
        options: [
          { label: 'Speed/Performance', value: 'speed' },
          { label: 'Memory Usage', value: 'memory' },
          { label: 'Code Size', value: 'size' },
          { label: 'Readability', value: 'readability' },
          { label: 'All (Balanced)', value: 'balanced' },
        ]
      }
    }),
    optimizationLevel: Property.StaticDropdown({
      displayName: 'Optimization Level',
      description: 'How aggressive should the optimization be?',
      required: true,
      defaultValue: 'refactor',
      options: {
        options: [
          { label: 'Suggest Improvements', value: 'suggest' },
          { label: 'Refactor Code', value: 'refactor' },
          { label: 'Complete Rewrite', value: 'rewrite' },
        ]
      }
    }),
    preserveBehavior: Property.Checkbox({
      displayName: 'Preserve Behavior',
      description: 'Ensure the optimized code maintains the same functionality',
      required: false,
      defaultValue: true,
    }),
    testCoverage: Property.Checkbox({
      displayName: 'Include Tests',
      description: 'Generate or update tests for the optimized code',
      required: false,
      defaultValue: false,
    }),
    performanceBenchmarks: Property.Checkbox({
      displayName: 'Include Benchmarks',
      description: 'Include performance comparison benchmarks',
      required: false,
      defaultValue: true,
    }),
    explainChanges: Property.Checkbox({
      displayName: 'Explain Changes',
      description: 'Provide detailed explanation of optimizations made',
      required: false,
      defaultValue: true,
    }),
  },
  async run(context) {
    const { 
      code, 
      aiModel, 
      optimizationTarget, 
      optimizationLevel, 
      preserveBehavior, 
      testCoverage, 
      performanceBenchmarks, 
      explainChanges 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const optimizationOptions = {
        target: optimizationTarget,
        level: optimizationLevel,
        preserveBehavior,
        testCoverage,
        performanceBenchmarks,
        explainChanges
      };

      const optimizedCode = await aiService.optimizeCode(code, optimizationTarget, optimizationOptions);

      return {
        success: true,
        originalCode: code,
        optimizedCode,
        optimization: {
          target: optimizationTarget,
          level: optimizationLevel,
          preserveBehavior,
          includesTests: testCoverage,
          includesBenchmarks: performanceBenchmarks,
          includesExplanation: explainChanges,
        },
        timestamp: new Date().toISOString(),
        metadata: {
          originalLines: code.split('\n').length,
          optimizedLines: optimizedCode.split('\n').length,
          aiModel,
          optimizationTarget,
          optimizationLevel
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }
});