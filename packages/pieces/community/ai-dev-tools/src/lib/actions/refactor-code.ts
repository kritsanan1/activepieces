import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel } from '../common/types';

export const refactorCode = createAction({
  name: 'refactor_code',
  displayName: 'Refactor Code',
  description: 'AI-powered code refactoring with pattern recognition and improvement suggestions',
  props: {
    code: Property.LongText({
      displayName: 'Code to Refactor',
      description: 'Paste the code you want to refactor',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for refactoring',
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
    refactoringType: Property.StaticDropdown({
      displayName: 'Refactoring Type',
      description: 'What type of refactoring do you need?',
      required: true,
      defaultValue: 'improve-readability',
      options: {
        options: [
          { label: 'Improve Readability', value: 'improve-readability' },
          { label: 'Reduce Complexity', value: 'reduce-complexity' },
          { label: 'Extract Functions', value: 'extract-functions' },
          { label: 'Improve Performance', value: 'improve-performance' },
          { label: 'Modernize Code', value: 'modernize-code' },
          { label: 'Add Error Handling', value: 'add-error-handling' },
          { label: 'Improve Naming', value: 'improve-naming' },
          { label: 'Remove Duplication', value: 'remove-duplication' },
          { label: 'Custom', value: 'custom' },
        ]
      }
    }),
    customInstructions: Property.LongText({
      displayName: 'Custom Instructions',
      description: 'Provide specific refactoring instructions (if Custom type selected)',
      required: false,
    }),
    preserveFunctionality: Property.Checkbox({
      displayName: 'Preserve Functionality',
      description: 'Ensure the refactored code maintains the same functionality',
      required: false,
      defaultValue: true,
    }),
    includeTests: Property.Checkbox({
      displayName: 'Update Tests',
      description: 'Update existing tests for the refactored code',
      required: false,
      defaultValue: false,
    }),
  },
  async run(context) {
    const { code, aiModel, refactoringType, customInstructions, preserveFunctionality, includeTests } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const refactoringInstructions = refactoringType === 'custom' 
        ? customInstructions 
        : `Refactor this code to ${refactoringType.replace('-', ' ')}`;

      const refactoredCode = await aiService.refactorCode(code, refactoringInstructions || '');

      return {
        success: true,
        originalCode: code,
        refactoredCode,
        refactoringType,
        preserveFunctionality,
        includesTests: includeTests,
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          refactoringType,
          linesChanged: this.calculateLinesChanged(code, refactoredCode),
          complexityReduction: this.estimateComplexityReduction(code, refactoredCode),
          readabilityImprovement: this.estimateReadabilityImprovement(code, refactoredCode),
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  },

  calculateLinesChanged(original: string, refactored: string): number {
    return Math.abs(original.split('\n').length - refactored.split('\n').length);
  },

  estimateComplexityReduction(original: string, refactored: string): number {
    const originalComplexity = this.calculateComplexity(original);
    const refactoredComplexity = this.calculateComplexity(refactored);
    return Math.max(0, originalComplexity - refactoredComplexity);
  },

  estimateReadabilityImprovement(original: string, refactored: string): number {
    // Simple heuristic based on naming and structure
    const originalScore = this.calculateReadabilityScore(original);
    const refactoredScore = this.calculateReadabilityScore(refactored);
    return Math.max(0, refactoredScore - originalScore);
  },

  calculateComplexity(code: string): number {
    const controlStructures = (code.match(/\b(if|for|while|switch|catch)\b/g) || []).length;
    const logicalOperators = (code.match(/\b(&&|\|\||\?\:)\b/g) || []).length;
    return controlStructures + logicalOperators;
  },

  calculateReadabilityScore(code: string): number {
    const meaningfulNames = (code.match(/\b(get|set|create|update|delete|process|handle|validate)\w*\b/g) || []).length;
    const totalWords = code.split(/\s+/).length;
    return totalWords > 0 ? (meaningfulNames * 100 / totalWords) : 0;
  }
});