import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { CodeLanguage, CodeStyle, AIModel } from '../common/types';
import { PROMPT_TEMPLATES } from '../common/constants';

export const generateCode = createAction({
  name: 'generate_code',
  displayName: 'Generate Code',
  description: 'Generate high-quality code using AI based on requirements',
  props: {
    prompt: Property.LongText({
      displayName: 'Requirements',
      description: 'Describe what you want the code to do',
      required: true,
    }),
    language: Property.StaticDropdown({
      displayName: 'Programming Language',
      description: 'Choose the programming language',
      required: true,
      options: {
        options: [
          { label: 'JavaScript', value: CodeLanguage.JAVASCRIPT },
          { label: 'TypeScript', value: CodeLanguage.TYPESCRIPT },
          { label: 'Python', value: CodeLanguage.PYTHON },
          { label: 'Java', value: CodeLanguage.JAVA },
          { label: 'Go', value: CodeLanguage.GO },
          { label: 'Rust', value: CodeLanguage.RUST },
          { label: 'C#', value: CodeLanguage.CSHARP },
          { label: 'PHP', value: CodeLanguage.PHP },
        ]
      }
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for code generation',
      required: true,
      defaultValue: 'gpt-4-turbo',
      options: {
        options: [
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'GPT-4', value: 'gpt-4' },
          { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
          { label: 'Claude 3 Opus', value: 'claude-3-opus-20240229' },
          { label: 'Claude 3 Sonnet', value: 'claude-3-sonnet-20240229' },
          { label: 'Claude 3 Haiku', value: 'claude-3-haiku-20240307' },
          { label: 'Gemini Pro', value: 'gemini-pro' },
        ]
      }
    }),
    style: Property.StaticDropdown({
      displayName: 'Code Style',
      description: 'Choose the coding style/standard',
      required: false,
      defaultValue: 'standard',
      options: {
        options: [
          { label: 'Standard', value: CodeStyle.STANDARD },
          { label: 'Airbnb', value: CodeStyle.AIRBNB },
          { label: 'Google', value: CodeStyle.GOOGLE },
          { label: 'Microsoft', value: CodeStyle.MICROSOFT },
          { label: 'Prettier', value: CodeStyle.PRETTIER },
          { label: 'Black (Python)', value: CodeStyle.BLACK },
          { label: 'PEP 8 (Python)', value: CodeStyle.PEP8 },
        ]
      }
    }),
    framework: Property.ShortText({
      displayName: 'Framework',
      description: 'Specify framework if applicable (e.g., React, Django, Spring Boot)',
      required: false,
    }),
    libraries: Property.Array({
      displayName: 'Libraries',
      description: 'List of libraries to use',
      required: false,
      properties: {
        library: Property.ShortText({
          displayName: 'Library',
          required: true,
        })
      }
    }),
    includeComments: Property.Checkbox({
      displayName: 'Include Comments',
      description: 'Include explanatory comments in the generated code',
      required: false,
      defaultValue: true,
    }),
    includeTests: Property.Checkbox({
      displayName: 'Include Tests',
      description: 'Include test code examples',
      required: false,
      defaultValue: false,
    }),
    includeDocumentation: Property.Checkbox({
      displayName: 'Include Documentation',
      description: 'Include documentation comments',
      required: false,
      defaultValue: true,
    }),
    constraints: Property.Object({
      displayName: 'Constraints',
      description: 'Additional constraints for code generation',
      required: false,
      properties: {
        maxLines: Property.Number({
          displayName: 'Maximum Lines',
          required: false,
        }),
        maxComplexity: Property.Number({
          displayName: 'Maximum Complexity',
          required: false,
        }),
        minPerformance: Property.Number({
          displayName: 'Minimum Performance Score',
          required: false,
        }),
      }
    }),
  },
  async run(context) {
    const { 
      prompt, 
      language, 
      aiModel, 
      style, 
      framework, 
      libraries, 
      includeComments, 
      includeTests, 
      includeDocumentation, 
      constraints 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const generationOptions = {
        language: language as CodeLanguage,
        style: style as CodeStyle,
        framework,
        libraries: libraries?.map((lib: any) => lib.library) || [],
        includeComments,
        includeTests,
        includeDocumentation,
        constraints
      };

      const generatedCode = await aiService.generateCode(prompt, language, generationOptions);

      return {
        success: true,
        code: generatedCode,
        language,
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          lines: generatedCode.split('\n').length,
          characters: generatedCode.length,
          framework: framework || 'none',
          libraries: libraries?.length || 0,
          includesComments: includeComments,
          includesTests: includeTests,
          includesDocumentation: includeDocumentation
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