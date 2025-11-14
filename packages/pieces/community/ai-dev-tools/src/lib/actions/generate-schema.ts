import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel, SchemaType } from '../common/types';

export const generateSchema = createAction({
  name: 'generate_schema',
  displayName: 'Generate Schema',
  description: 'Generate data schemas, API specifications, and database schemas using AI',
  props: {
    description: Property.LongText({
      displayName: 'Schema Description',
      description: 'Describe the data structure or API you need a schema for',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for schema generation',
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
    schemaType: Property.StaticDropdown({
      displayName: 'Schema Type',
      description: 'Choose the type of schema to generate',
      required: true,
      defaultValue: SchemaType.JSON_SCHEMA,
      options: {
        options: [
          { label: 'JSON Schema', value: SchemaType.JSON_SCHEMA },
          { label: 'OpenAPI/Swagger', value: SchemaType.OPENAPI },
          { label: 'GraphQL Schema', value: SchemaType.GRAPHQL },
          { label: 'Protocol Buffers', value: SchemaType.PROTOBUF },
          { label: 'Avro Schema', value: SchemaType.AVRO },
          { label: 'MySQL Schema', value: SchemaType.MYSQL },
          { label: 'PostgreSQL Schema', value: SchemaType.POSTGRESQL },
          { label: 'MongoDB Schema', value: SchemaType.MONGODB },
        ]
      }
    }),
    includeValidation: Property.Checkbox({
      displayName: 'Include Validation',
      description: 'Include validation rules in the schema',
      required: false,
      defaultValue: true,
    }),
    includeExamples: Property.Checkbox({
      displayName: 'Include Examples',
      description: 'Include example data in the schema',
      required: false,
      defaultValue: true,
    }),
    includeDescriptions: Property.Checkbox({
      displayName: 'Include Descriptions',
      description: 'Include field descriptions and documentation',
      required: false,
      defaultValue: true,
    }),
    strictMode: Property.Checkbox({
      displayName: 'Strict Mode',
      description: 'Generate strict schema with required fields',
      required: false,
      defaultValue: false,
    }),
    version: Property.ShortText({
      displayName: 'Schema Version',
      description: 'Version of the schema (e.g., v1, v2, 3.0.0)',
      required: false,
      defaultValue: 'v1',
    }),
  },
  async run(context) {
    const { 
      description, 
      aiModel, 
      schemaType, 
      includeValidation, 
      includeExamples, 
      includeDescriptions, 
      strictMode, 
      version 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const schemaOptions = {
        includeValidation,
        includeExamples,
        includeDescriptions,
        strictMode,
        version: version || 'v1'
      };

      const generatedSchema = await aiService.generateSchema(description, schemaType as string);

      return {
        success: true,
        description,
        schema: generatedSchema,
        schemaType,
        options: schemaOptions,
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          schemaType,
          includesValidation: includeValidation,
          includesExamples: includeExamples,
          includesDescriptions: includeDescriptions,
          strictMode,
          version: version || 'v1',
          estimatedFields: this.estimateFieldCount(generatedSchema),
          estimatedComplexity: this.estimateSchemaComplexity(generatedSchema),
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

  estimateFieldCount(schema: string): number {
    // Estimate the number of fields in the schema
    const fieldMatches = schema.match(/"\w+":/g);
    return fieldMatches ? fieldMatches.length : 0;
  },

  estimateSchemaComplexity(schema: string): number {
    // Estimate schema complexity based on nesting and field types
    let complexity = 0;
    
    // Count nested objects
    const nestedObjects = (schema.match(/{/g) || []).length;
    complexity += nestedObjects * 2;
    
    // Count array types
    const arrayTypes = (schema.match(/\[\]/g) || []).length;
    complexity += arrayTypes * 1;
    
    // Count complex types
    const complexTypes = (schema.match(/\b(object|array|union)\b/g) || []).length;
    complexity += complexTypes * 3;
    
    return Math.min(100, complexity);
  }
});