import { 
  AIProvider, 
  AIModel, 
  CodeLanguage, 
  TestFramework, 
  DocumentationType,
  SchemaType,
  CodeStyle
} from './types';

describe('Types', () => {
  describe('AIProvider enum', () => {
    it('should have correct provider values', () => {
      expect(AIProvider.OPENAI).toBe('openai');
      expect(AIProvider.ANTHROPIC).toBe('anthropic');
      expect(AIProvider.GOOGLE).toBe('google');
      expect(AIProvider.AZURE).toBe('azure');
      expect(AIProvider.LOCAL).toBe('local');
    });
  });

  describe('AIModel enum', () => {
    it('should have GPT models', () => {
      expect(AIModel.GPT4).toBe('gpt-4');
      expect(AIModel.GPT4_TURBO).toBe('gpt-4-turbo');
      expect(AIModel.GPT35_TURBO).toBe('gpt-3.5-turbo');
    });

    it('should have Claude models', () => {
      expect(AIModel.CLAUDE_3_OPUS).toBe('claude-3-opus-20240229');
      expect(AIModel.CLAUDE_3_SONNET).toBe('claude-3-sonnet-20240229');
      expect(AIModel.CLAUDE_3_HAIKU).toBe('claude-3-haiku-20240307');
    });

    it('should have Gemini models', () => {
      expect(AIModel.GEMINI_PRO).toBe('gemini-pro');
      expect(AIModel.GEMINI_FLASH).toBe('gemini-flash');
    });
  });

  describe('CodeLanguage enum', () => {
    it('should have all major programming languages', () => {
      expect(CodeLanguage.JAVASCRIPT).toBe('javascript');
      expect(CodeLanguage.TYPESCRIPT).toBe('typescript');
      expect(CodeLanguage.PYTHON).toBe('python');
      expect(CodeLanguage.JAVA).toBe('java');
      expect(CodeLanguage.GO).toBe('go');
      expect(CodeLanguage.RUST).toBe('rust');
    });
  });

  describe('TestFramework enum', () => {
    it('should have JavaScript test frameworks', () => {
      expect(TestFramework.JEST).toBe('jest');
      expect(TestFramework.VITEST).toBe('vitest');
      expect(TestFramework.MOCHA).toBe('mocha');
    });

    it('should have Python test frameworks', () => {
      expect(TestFramework.PYTEST).toBe('pytest');
      expect(TestFramework.UNITTEST).toBe('unittest');
    });

    it('should have Java test frameworks', () => {
      expect(TestFramework.JUNIT).toBe('junit');
      expect(TestFramework.TESTNG).toBe('testng');
    });
  });

  describe('DocumentationType enum', () => {
    it('should have all documentation types', () => {
      expect(DocumentationType.API).toBe('api');
      expect(DocumentationType.README).toBe('readme');
      expect(DocumentationType.CODE_COMMENTS).toBe('code_comments');
      expect(DocumentationType.TUTORIAL).toBe('tutorial');
      expect(DocumentationType.ARCHITECTURE).toBe('architecture');
    });
  });

  describe('SchemaType enum', () => {
    it('should have API schema types', () => {
      expect(SchemaType.JSON_SCHEMA).toBe('json_schema');
      expect(SchemaType.OPENAPI).toBe('openapi');
      expect(SchemaType.GRAPHQL).toBe('graphql');
      expect(SchemaType.PROTOBUF).toBe('protobuf');
    });

    it('should have database schema types', () => {
      expect(SchemaType.MYSQL).toBe('mysql');
      expect(SchemaType.POSTGRESQL).toBe('postgresql');
      expect(SchemaType.MONGODB).toBe('mongodb');
    });
  });

  describe('CodeStyle enum', () => {
    it('should have all code style options', () => {
      expect(CodeStyle.STANDARD).toBe('standard');
      expect(CodeStyle.AIRBNB).toBe('airbnb');
      expect(CodeStyle.GOOGLE).toBe('google');
      expect(CodeStyle.PRETTIER).toBe('prettier');
      expect(CodeStyle.BLACK).toBe('black');
      expect(CodeStyle.PEP8).toBe('pep8');
    });
  });
});