import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel, DebugSuggestion } from '../common/types';

export const debugCode = createAction({
  name: 'debug_code',
  displayName: 'Debug Code',
  description: 'AI-powered code debugging with error analysis and fix suggestions',
  props: {
    code: Property.LongText({
      displayName: 'Code to Debug',
      description: 'Paste the code that has issues or errors',
      required: true,
    }),
    error: Property.LongText({
      displayName: 'Error/Issue Description',
      description: 'Describe the error, bug, or unexpected behavior',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for debugging',
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
    language: Property.StaticDropdown({
      displayName: 'Programming Language',
      description: 'Select the programming language',
      required: false,
      options: {
        options: [
          { label: 'JavaScript', value: 'javascript' },
          { label: 'TypeScript', value: 'typescript' },
          { label: 'Python', value: 'python' },
          { label: 'Java', value: 'java' },
          { label: 'Go', value: 'go' },
          { label: 'Rust', value: 'rust' },
          { label: 'C#', value: 'csharp' },
          { label: 'PHP', value: 'php' },
          { label: 'Auto-detect', value: 'auto' },
        ]
      }
    }),
    context: Property.LongText({
      displayName: 'Additional Context',
      description: 'Provide any additional context, environment details, or related information',
      required: false,
    }),
    errorType: Property.StaticDropdown({
      displayName: 'Error Type',
      description: 'What type of issue are you experiencing?',
      required: false,
      options: {
        options: [
          { label: 'Runtime Error', value: 'runtime' },
          { label: 'Compilation Error', value: 'compilation' },
          { label: 'Logic Error', value: 'logic' },
          { label: 'Performance Issue', value: 'performance' },
          { label: 'Security Issue', value: 'security' },
          { label: 'Unknown/Other', value: 'unknown' },
        ]
      }
    }),
    includeFix: Property.Checkbox({
      displayName: 'Include Fix',
      description: 'Provide corrected code with the fix applied',
      required: false,
      defaultValue: true,
    }),
    includeExplanation: Property.Checkbox({
      displayName: 'Include Explanation',
      description: 'Include detailed explanation of the issue and solution',
      required: false,
      defaultValue: true,
    }),
    includePrevention: Property.Checkbox({
      displayName: 'Include Prevention Tips',
      description: 'Include tips to prevent similar issues in the future',
      required: false,
      defaultValue: true,
    }),
    severity: Property.StaticDropdown({
      displayName: 'Issue Severity',
      description: 'How critical is this issue?',
      required: false,
      options: {
        options: [
          { label: 'Critical - Breaking', value: 'critical' },
          { label: 'Major - Significant Impact', value: 'major' },
          { label: 'Minor - Small Issue', value: 'minor' },
          { label: 'Enhancement - Not Broken', value: 'enhancement' },
        ]
      }
    }),
  },
  async run(context) {
    const { 
      code, 
      error, 
      aiModel, 
      language, 
      context: contextInfo, 
      errorType, 
      includeFix, 
      includeExplanation, 
      includePrevention, 
      severity 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const debugResult = await aiService.debugCode(code, error, contextInfo || '');

      // Parse the AI response to extract structured information
      const suggestions = this.parseDebugSuggestions(debugResult);
      const fixedCode = includeFix ? this.extractFixedCode(debugResult) : null;
      const explanation = includeExplanation ? this.extractExplanation(debugResult) : null;
      const prevention = includePrevention ? this.extractPreventionTips(debugResult) : null;

      return {
        success: true,
        originalCode: code,
        errorDescription: error,
        language: language || 'auto',
        errorType: errorType || 'unknown',
        severity: severity || 'major',
        suggestions,
        fixedCode,
        explanation,
        prevention,
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          linesAnalyzed: code.split('\n').length,
          suggestionsCount: suggestions.length,
          includesFix: includeFix,
          includesExplanation: includeExplanation,
          includesPrevention: includePrevention,
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

  parseDebugSuggestions(response: string): DebugSuggestion[] {
    // Simple parsing logic - in a real implementation, you'd have more sophisticated parsing
    const suggestions: DebugSuggestion[] = [];
    
    // Look for numbered suggestions or bullet points
    const lines = response.split('\n');
    let currentSuggestion: Partial<DebugSuggestion> = {};
    
    for (const line of lines) {
      if (line.includes('Issue:') || line.includes('Problem:')) {
        currentSuggestion.issue = line.split(':')[1]?.trim() || line;
      } else if (line.includes('Fix:') || line.includes('Solution:')) {
        currentSuggestion.fix = line.split(':')[1]?.trim() || line;
      } else if (line.includes('Severity:')) {
        const severity = line.split(':')[1]?.trim().toLowerCase();
        currentSuggestion.severity = ['error', 'warning', 'info'].includes(severity) ? severity as any : 'info';
      }
      
      if (currentSuggestion.issue && currentSuggestion.fix) {
        suggestions.push(currentSuggestion as DebugSuggestion);
        currentSuggestion = {};
      }
    }
    
    return suggestions;
  },

  extractFixedCode(response: string): string | null {
    // Look for code blocks in the response
    const codeBlockMatch = response.match(/```[\s\S]*?```/g);
    return codeBlockMatch ? codeBlockMatch[0].replace(/```/g, '').trim() : null;
  },

  extractExplanation(response: string): string | null {
    // Extract explanation section
    const explanationMatch = response.match(/Explanation:[\s\S]*?(?=Prevention:|$)/i);
    return explanationMatch ? explanationMatch[0].replace('Explanation:', '').trim() : null;
  },

  extractPreventionTips(response: string): string | null {
    // Extract prevention section
    const preventionMatch = response.match(/Prevention:[\s\S]*?$/i);
    return preventionMatch ? preventionMatch[0].replace('Prevention:', '').trim() : null;
  }
});