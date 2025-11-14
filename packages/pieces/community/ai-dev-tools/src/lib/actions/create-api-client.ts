import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel, APIClientConfig } from '../common/types';

export const createApiClient = createAction({
  name: 'create_api_client',
  displayName: 'Create API Client',
  description: 'Generate complete API client code with authentication, error handling, and utilities',
  props: {
    apiSpec: Property.LongText({
      displayName: 'API Specification',
      description: 'Describe your API endpoints, authentication, and requirements',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for client generation',
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
      description: 'Choose the programming language',
      required: true,
      defaultValue: 'javascript',
      options: {
        options: [
          { label: 'JavaScript', value: 'javascript' },
          { label: 'TypeScript', value: 'typescript' },
          { label: 'Python', value: 'python' },
          { label: 'Go', value: 'go' },
          { label: 'Rust', value: 'rust' },
          { label: 'Java', value: 'java' },
          { label: 'C#', value: 'csharp' },
          { label: 'PHP', value: 'php' },
        ]
      }
    }),
    authentication: Property.StaticDropdown({
      displayName: 'Authentication Type',
      description: 'Choose the authentication method',
      required: false,
      defaultValue: 'bearer',
      options: {
        options: [
          { label: 'Bearer Token', value: 'bearer' },
          { label: 'API Key', value: 'api-key' },
          { label: 'Basic Auth', value: 'basic' },
          { label: 'OAuth 2.0', value: 'oauth2' },
          { label: 'JWT', value: 'jwt' },
          { label: 'None', value: 'none' },
        ]
      }
    }),
    includeErrorHandling: Property.Checkbox({
      displayName: 'Include Error Handling',
      description: 'Generate comprehensive error handling',
      required: false,
      defaultValue: true,
    }),
    includeRetryLogic: Property.Checkbox({
      displayName: 'Include Retry Logic',
      description: 'Add retry logic for failed requests',
      required: false,
      defaultValue: true,
    }),
    includeRateLimiting: Property.Checkbox({
      displayName: 'Include Rate Limiting',
      description: 'Add rate limiting and throttling',
      required: false,
      defaultValue: false,
    }),
    includeLogging: Property.Checkbox({
      displayName: 'Include Logging',
      description: 'Add request/response logging',
      required: false,
      defaultValue: true,
    }),
    includeCaching: Property.Checkbox({
      displayName: 'Include Caching',
      description: 'Add response caching capabilities',
      required: false,
      defaultValue: false,
    }),
    includeValidation: Property.Checkbox({
      displayName: 'Include Validation',
      description: 'Add input validation and sanitization',
      required: false,
      defaultValue: true,
    }),
    includeTypes: Property.Checkbox({
      displayName: 'Include Type Definitions',
      description: 'Generate TypeScript types or equivalent',
      required: false,
      defaultValue: true,
    }),
    includeTests: Property.Checkbox({
      displayName: 'Include Tests',
      description: 'Generate unit tests for the API client',
      required: false,
      defaultValue: false,
    }),
    includeExamples: Property.Checkbox({
      displayName: 'Include Examples',
      description: 'Include usage examples',
      required: false,
      defaultValue: true,
    }),
    includeDocumentation: Property.Checkbox({
      displayName: 'Include Documentation',
      description: 'Generate inline documentation',
      required: false,
      defaultValue: true,
    }),
  },
  async run(context) {
    const { 
      apiSpec, 
      aiModel, 
      language, 
      authentication, 
      includeErrorHandling, 
      includeRetryLogic, 
      includeRateLimiting, 
      includeLogging, 
      includeCaching, 
      includeValidation, 
      includeTypes, 
      includeTests, 
      includeExamples, 
      includeDocumentation 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const clientOptions = {
        language,
        authentication: authentication || 'bearer',
        includeErrorHandling,
        includeRetryLogic,
        includeRateLimiting,
        includeLogging,
        includeCaching,
        includeValidation,
        includeTypes,
        includeTests,
        includeExamples,
        includeDocumentation
      };

      const apiClient = await aiService.createAPIClient(apiSpec, language);

      return {
        success: true,
        apiSpec,
        clientCode: apiClient,
        language,
        authentication: authentication || 'bearer',
        options: clientOptions,
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          language,
          authentication: authentication || 'bearer',
          includesErrorHandling: includeErrorHandling,
          includesRetryLogic: includeRetryLogic,
          includesRateLimiting: includeRateLimiting,
          includesLogging: includeLogging,
          includesCaching: includeCaching,
          includesValidation: includeValidation,
          includesTypes: includeTypes,
          includesTests: includeTests,
          includesExamples: includeExamples,
          includesDocumentation: includeDocumentation,
          estimatedEndpoints: this.estimateEndpoints(apiSpec),
          estimatedComplexity: this.estimateClientComplexity(clientOptions),
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

  estimateEndpoints(apiSpec: string): number {
    // Estimate number of endpoints based on common patterns
    const endpointPatterns = [
      /GET\s+/i, /POST\s+/i, /PUT\s+/i, /DELETE\s+/i, /PATCH\s+/i,
      /\bendpoint[s]?\b/i, /\bapi[s]?\s+call[s]?\b/i, /\broute[s]?\b/i
    ];
    
    let count = 0;
    for (const pattern of endpointPatterns) {
      const matches = apiSpec.match(pattern);
      if (matches) count += matches.length;
    }
    
    return Math.max(1, Math.min(50, count));
  },

  estimateClientComplexity(options: any): number {
    let complexity = 1; // Base complexity
    
    // Add complexity for each feature
    if (options.includeErrorHandling) complexity += 2;
    if (options.includeRetryLogic) complexity += 2;
    if (options.includeRateLimiting) complexity += 3;
    if (options.includeLogging) complexity += 1;
    if (options.includeCaching) complexity += 3;
    if (options.includeValidation) complexity += 2;
    if (options.includeTypes) complexity += 1;
    if (options.includeTests) complexity += 3;
    if (options.includeDocumentation) complexity += 1;
    
    return Math.min(10, complexity);
  }
});