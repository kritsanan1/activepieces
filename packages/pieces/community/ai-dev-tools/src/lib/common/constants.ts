import { AIProvider, AIModel, CodeLanguage } from './types';

export const AI_MODELS = [
  {
    id: 'gpt-4-turbo',
    provider: AIProvider.OPENAI,
    displayName: 'GPT-4 Turbo',
    maxTokens: 128000,
    description: 'Most capable GPT-4 model with improved performance'
  },
  {
    id: 'gpt-4',
    provider: AIProvider.OPENAI,
    displayName: 'GPT-4',
    maxTokens: 8192,
    description: 'Highly capable GPT-4 model'
  },
  {
    id: 'gpt-3.5-turbo',
    provider: AIProvider.OPENAI,
    displayName: 'GPT-3.5 Turbo',
    maxTokens: 16385,
    description: 'Fast and efficient GPT-3.5 model'
  },
  {
    id: 'claude-3-opus-20240229',
    provider: AIProvider.ANTHROPIC,
    displayName: 'Claude 3 Opus',
    maxTokens: 200000,
    description: 'Most powerful Claude model for complex tasks'
  },
  {
    id: 'claude-3-sonnet-20240229',
    provider: AIProvider.ANTHROPIC,
    displayName: 'Claude 3 Sonnet',
    maxTokens: 200000,
    description: 'Balanced Claude model for general use'
  },
  {
    id: 'claude-3-haiku-20240307',
    provider: AIProvider.ANTHROPIC,
    displayName: 'Claude 3 Haiku',
    maxTokens: 200000,
    description: 'Fast and cost-effective Claude model'
  },
  {
    id: 'gemini-pro',
    provider: AIProvider.GOOGLE,
    displayName: 'Gemini Pro',
    maxTokens: 30720,
    description: 'Google\'s most capable AI model'
  },
  {
    id: 'gemini-flash',
    provider: AIProvider.GOOGLE,
    displayName: 'Gemini Flash',
    maxTokens: 1000000,
    description: 'Fast and efficient Gemini model'
  }
];

export const CODE_LANGUAGES = [
  {
    id: CodeLanguage.JAVASCRIPT,
    displayName: 'JavaScript',
    extensions: ['.js', '.jsx'],
    description: 'Dynamic programming language'
  },
  {
    id: CodeLanguage.TYPESCRIPT,
    displayName: 'TypeScript',
    extensions: ['.ts', '.tsx'],
    description: 'Typed superset of JavaScript'
  },
  {
    id: CodeLanguage.PYTHON,
    displayName: 'Python',
    extensions: ['.py'],
    description: 'High-level programming language'
  },
  {
    id: CodeLanguage.JAVA,
    displayName: 'Java',
    extensions: ['.java'],
    description: 'Object-oriented programming language'
  },
  {
    id: CodeLanguage.GO,
    displayName: 'Go',
    extensions: ['.go'],
    description: 'Statically typed, compiled language'
  },
  {
    id: CodeLanguage.RUST,
    displayName: 'Rust',
    extensions: ['.rs'],
    description: 'Systems programming language'
  }
];

export const CODE_STYLE_GUIDES = [
  {
    id: 'standard',
    displayName: 'Standard JS',
    description: 'No configuration JavaScript style guide'
  },
  {
    id: 'airbnb',
    displayName: 'Airbnb',
    description: 'Popular JavaScript style guide'
  },
  {
    id: 'google',
    displayName: 'Google',
    description: 'Google\'s JavaScript style guide'
  },
  {
    id: 'prettier',
    displayName: 'Prettier',
    description: 'Opinionated code formatter'
  },
  {
    id: 'black',
    displayName: 'Black',
    description: 'Python code formatter'
  },
  {
    id: 'pep8',
    displayName: 'PEP 8',
    description: 'Python style guide'
  }
];

export const PROMPT_TEMPLATES = {
  codeGeneration: (language: string, requirements: string, style: string) => `
Generate ${language} code that meets the following requirements:

Requirements:
${requirements}

Follow ${style} coding standards and best practices.
Include proper error handling, documentation, and testing considerations.
Make the code production-ready and maintainable.

Output format:
\`\`\`${language}
[Generated code here]
\`\`\`

Include any necessary setup instructions or dependencies.
`,

  codeOptimization: (code: string, target: string, level: string) => `
Analyze and optimize the following ${target} code:

${code}

Optimization target: ${target}
Optimization level: ${level}

Provide:
1. Optimized code
2. Performance analysis
3. Trade-offs explanation
4. Testing recommendations
`,

  codeDebugging: (code: string, error: string, context: string) => `
Debug the following code:

${code}

Error/Issue: ${error}
Context: ${context}

Provide:
1. Root cause analysis
2. Fixed code
3. Prevention strategies
4. Related issues to check
`,

  testGeneration: (code: string, framework: string) => `
Generate comprehensive tests for the following code using ${framework}:

${code}

Include:
1. Unit tests
2. Integration tests
3. Edge cases
4. Mock setup
5. Test utilities

Follow best practices for ${framework} testing.
`,

  documentation: (code: string, type: string) => `
Create ${type} documentation for the following code:

${code}

Include:
1. Purpose and overview
2. Usage examples
3. API reference
4. Configuration options
5. Best practices

Make it comprehensive and beginner-friendly.
`
};