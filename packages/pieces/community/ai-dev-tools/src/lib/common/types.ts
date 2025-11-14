export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  AZURE = 'azure',
  LOCAL = 'local'
}

export enum AIModel {
  GPT4 = 'gpt-4',
  GPT4_TURBO = 'gpt-4-turbo',
  GPT35_TURBO = 'gpt-3.5-turbo',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  CLAUDE_3_SONNET = 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
  GEMINI_PRO = 'gemini-pro',
  GEMINI_FLASH = 'gemini-flash'
}

export enum CodeLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
  CSHARP = 'csharp',
  GO = 'go',
  RUST = 'rust',
  PHP = 'php',
  RUBY = 'ruby',
  SWIFT = 'swift',
  KOTLIN = 'kotlin',
  DART = 'dart',
  HTML = 'html',
  CSS = 'css',
  SQL = 'sql',
  YAML = 'yaml',
  JSON = 'json',
  XML = 'xml',
  MARKDOWN = 'markdown'
}

export enum TestFramework {
  JEST = 'jest',
  VITEST = 'vitest',
  MOCHA = 'mocha',
  JASMINE = 'jasmine',
  PYTEST = 'pytest',
  UNITTEST = 'unittest',
  NOSE = 'nose',
  JUNIT = 'junit',
  TESTNG = 'testng',
  RSPECT = 'rspec',
  MINITEST = 'minitest'
}

export enum DocumentationType {
  API = 'api',
  README = 'readme',
  CODE_COMMENTS = 'code_comments',
  TUTORIAL = 'tutorial',
  WIKI = 'wiki',
  CHANGELOG = 'changelog',
  ARCHITECTURE = 'architecture'
}

export enum SchemaType {
  JSON_SCHEMA = 'json_schema',
  OPENAPI = 'openapi',
  GRAPHQL = 'graphql',
  PROTOBUF = 'protobuf',
  AVRO = 'avro',
  MYSQL = 'mysql',
  POSTGRESQL = 'postgresql',
  MONGODB = 'mongodb'
}

export enum CodeStyle {
  STANDARD = 'standard',
  AIRBNB = 'airbnb',
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  PRETTIER = 'prettier',
  BLACK = 'black',
  PEP8 = 'pep8',
  CUSTOM = 'custom'
}

export interface CodeQualityMetrics {
  complexity: number;
  maintainability: number;
  testCoverage: number;
  documentationCoverage: number;
  securityScore: number;
  performanceScore: number;
}

export interface CodeGenerationOptions {
  language: CodeLanguage;
  style: CodeStyle;
  framework?: string;
  libraries?: string[];
  constraints?: {
    maxLines?: number;
    maxComplexity?: number;
    minPerformance?: number;
  };
}

export interface CodeOptimizationOptions {
  target: 'speed' | 'memory' | 'size' | 'readability';
  level: 'suggest' | 'refactor' | 'rewrite';
  preserveBehavior: boolean;
  testCoverage: boolean;
}

export interface DebugSuggestion {
  issue: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info';
  suggestion: string;
  fix?: string;
}

export interface TestCase {
  name: string;
  description: string;
  input: any;
  expectedOutput: any;
  setup?: string;
  teardown?: string;
}

export interface DocumentationSection {
  title: string;
  content: string;
  code?: string;
  examples?: string[];
}

export interface APIClientConfig {
  baseUrl: string;
  authentication?: {
    type: 'bearer' | 'api-key' | 'basic' | 'oauth2';
    header?: string;
    key?: string;
    username?: string;
    password?: string;
  };
  endpoints: Array<{
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    parameters?: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    response?: {
      type: string;
      description: string;
    };
  }>;
}