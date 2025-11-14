import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel, DocumentationType } from '../common/types';

export const createDocumentation = createAction({
  name: 'create_documentation',
  displayName: 'Create Documentation',
  description: 'Generate comprehensive documentation for code using AI',
  props: {
    code: Property.LongText({
      displayName: 'Code to Document',
      description: 'Paste the code you want to document',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for documentation generation',
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
    documentationType: Property.StaticDropdown({
      displayName: 'Documentation Type',
      description: 'Choose the type of documentation to generate',
      required: true,
      defaultValue: DocumentationType.API,
      options: {
        options: [
          { label: 'API Reference', value: DocumentationType.API },
          { label: 'README', value: DocumentationType.README },
          { label: 'Code Comments', value: DocumentationType.CODE_COMMENTS },
          { label: 'Tutorial', value: DocumentationType.TUTORIAL },
          { label: 'Wiki Page', value: DocumentationType.WIKI },
          { label: 'Changelog', value: DocumentationType.CHANGELOG },
          { label: 'Architecture Doc', value: DocumentationType.ARCHITECTURE },
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
          { label: 'Auto-detect', value: 'auto' },
        ]
      }
    }),
    targetAudience: Property.StaticDropdown({
      displayName: 'Target Audience',
      description: 'Who is the documentation for?',
      required: false,
      defaultValue: 'developers',
      options: {
        options: [
          { label: 'Developers', value: 'developers' },
          { label: 'Beginners', value: 'beginners' },
          { label: 'Advanced Users', value: 'advanced' },
          { label: 'End Users', value: 'users' },
          { label: 'Managers', value: 'managers' },
          { label: 'General Public', value: 'general' },
        ]
      }
    }),
    includeExamples: Property.Checkbox({
      displayName: 'Include Examples',
      description: 'Include usage examples in the documentation',
      required: false,
      defaultValue: true,
    }),
    includeApiReference: Property.Checkbox({
      displayName: 'Include API Reference',
      description: 'Include detailed API reference documentation',
      required: false,
      defaultValue: true,
    }),
    includeSetup: Property.Checkbox({
      displayName: 'Include Setup Instructions',
      description: 'Include setup and installation instructions',
      required: false,
      defaultValue: true,
    }),
    includeBestPractices: Property.Checkbox({
      displayName: 'Include Best Practices',
      description: 'Include best practices and recommendations',
      required: false,
      defaultValue: true,
    }),
    includeTroubleshooting: Property.Checkbox({
      displayName: 'Include Troubleshooting',
      description: 'Include troubleshooting section',
      required: false,
      defaultValue: false,
    }),
    includeFaq: Property.Checkbox({
      displayName: 'Include FAQ',
      description: 'Include frequently asked questions section',
      required: false,
      defaultValue: false,
    }),
    format: Property.StaticDropdown({
      displayName: 'Output Format',
      description: 'Choose the output format',
      required: false,
      defaultValue: 'markdown',
      options: {
        options: [
          { label: 'Markdown', value: 'markdown' },
          { label: 'HTML', value: 'html' },
          { label: 'Plain Text', value: 'text' },
          { label: 'JSON', value: 'json' },
        ]
      }
    }),
    style: Property.StaticDropdown({
      displayName: 'Writing Style',
      description: 'Choose the writing style',
      required: false,
      defaultValue: 'technical',
      options: {
        options: [
          { label: 'Technical', value: 'technical' },
          { label: 'Conversational', value: 'conversational' },
          { label: 'Formal', value: 'formal' },
          { label: 'Casual', value: 'casual' },
          { label: 'Tutorial', value: 'tutorial' },
        ]
      }
    }),
  },
  async run(context) {
    const { 
      code, 
      aiModel, 
      documentationType, 
      language, 
      targetAudience, 
      includeExamples, 
      includeApiReference, 
      includeSetup, 
      includeBestPractices, 
      includeTroubleshooting, 
      includeFaq, 
      format, 
      style 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const documentationOptions = {
        type: documentationType as DocumentationType,
        language: language || 'auto',
        targetAudience: targetAudience || 'developers',
        includeExamples,
        includeApiReference,
        includeSetup,
        includeBestPractices,
        includeTroubleshooting,
        includeFaq,
        format: format || 'markdown',
        style: style || 'technical'
      };

      const documentation = await aiService.createDocumentation(code, documentationType as string);

      // Parse the documentation into sections
      const sections = this.parseDocumentationSections(documentation, documentationType as DocumentationType);

      return {
        success: true,
        code,
        documentation,
        sections,
        documentationType,
        language: language || 'auto',
        targetAudience: targetAudience || 'developers',
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          type: documentationType,
          audience: targetAudience || 'developers',
          includesExamples: includeExamples,
          includesApiReference: includeApiReference,
          includesSetup: includeSetup,
          includesBestPractices: includeBestPractices,
          includesTroubleshooting: includeTroubleshooting,
          includesFaq: includeFaq,
          format: format || 'markdown',
          style: style || 'technical',
          sectionsCount: Object.keys(sections).length,
          estimatedReadingTime: this.estimateReadingTime(documentation),
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

  parseDocumentationSections(documentation: string, type: DocumentationType): Record<string, string> {
    const sections: Record<string, string> = {};
    
    // Common section patterns for different documentation types
    const sectionPatterns = {
      [DocumentationType.API]: [
        'Overview', 'Installation', 'Quick Start', 'API Reference', 'Examples', 'Configuration'
      ],
      [DocumentationType.README]: [
        'Description', 'Installation', 'Usage', 'Examples', 'API', 'Contributing', 'License'
      ],
      [DocumentationType.TUTORIAL]: [
        'Introduction', 'Prerequisites', 'Step 1', 'Step 2', 'Step 3', 'Conclusion'
      ],
      [DocumentationType.WIKI]: [
        'Summary', 'Background', 'Implementation', 'Usage', 'Troubleshooting', 'References'
      ],
      [DocumentationType.ARCHITECTURE]: [
        'Overview', 'Components', 'Data Flow', 'Security', 'Performance', 'Deployment'
      ]
    };
    
    const patterns = sectionPatterns[type] || sectionPatterns[DocumentationType.API];
    
    for (const pattern of patterns) {
      const section = this.extractSection(documentation, pattern);
      if (section) {
        sections[pattern.toLowerCase().replace(/\s+/g, '_')] = section;
      }
    }
    
    return sections;
  },

  extractSection(documentation: string, sectionName: string): string | null {
    // Look for the section header and extract until the next section
    const headerPattern = new RegExp(`^#+\\s*${sectionName}\\s*$`, 'im');
    const headerMatch = documentation.match(headerPattern);
    
    if (!headerMatch) return null;
    
    const startIndex = headerMatch.index! + headerMatch[0].length;
    const remainingText = documentation.substring(startIndex);
    
    // Find the next section header
    const nextHeaderMatch = remainingText.match(/^#+\s+.+$/m);
    const endIndex = nextHeaderMatch ? nextHeaderMatch.index! : remainingText.length;
    
    return remainingText.substring(0, endIndex).trim();
  },

  estimateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
});