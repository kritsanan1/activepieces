import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel, TestFramework } from '../common/types';

export const generateTests = createAction({
  name: 'generate_tests',
  displayName: 'Generate Tests',
  description: 'Generate comprehensive test suites for your code using AI',
  props: {
    code: Property.LongText({
      displayName: 'Code to Test',
      description: 'Paste the code you want to generate tests for',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for test generation',
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
    framework: Property.StaticDropdown({
      displayName: 'Test Framework',
      description: 'Choose the testing framework',
      required: true,
      defaultValue: 'jest',
      options: {
        options: [
          { label: 'Jest', value: TestFramework.JEST },
          { label: 'Vitest', value: TestFramework.VITEST },
          { label: 'Mocha', value: TestFramework.MOCHA },
          { label: 'Pytest', value: TestFramework.PYTEST },
          { label: 'JUnit', value: TestFramework.JUNIT },
          { label: 'RSpec', value: TestFramework.RSPECT },
          { label: 'Custom', value: TestFramework.CUSTOM },
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
    testTypes: Property.Array({
      displayName: 'Test Types',
      description: 'Select types of tests to generate',
      required: false,
      defaultValue: [{ testType: 'unit' }, { testType: 'integration' }],
      properties: {
        testType: Property.StaticDropdown({
          displayName: 'Test Type',
          required: true,
          options: {
            options: [
              { label: 'Unit Tests', value: 'unit' },
              { label: 'Integration Tests', value: 'integration' },
              { label: 'End-to-End Tests', value: 'e2e' },
              { label: 'Performance Tests', value: 'performance' },
              { label: 'Security Tests', value: 'security' },
              { label: 'Edge Cases', value: 'edge-cases' },
              { label: 'Error Handling', value: 'error-handling' },
            ]
          }
        })
      }
    }),
    coverageTarget: Property.Number({
      displayName: 'Coverage Target (%)',
      description: 'Target code coverage percentage',
      required: false,
      defaultValue: 80,
    }),
    includeMocks: Property.Checkbox({
      displayName: 'Include Mocks',
      description: 'Generate mock objects and functions for testing',
      required: false,
      defaultValue: true,
    }),
    includeFixtures: Property.Checkbox({
      displayName: 'Include Fixtures',
      description: 'Generate test fixtures and sample data',
      required: false,
      defaultValue: true,
    }),
    includeSetup: Property.Checkbox({
      displayName: 'Include Setup/Teardown',
      description: 'Generate setup and teardown code for tests',
      required: false,
      defaultValue: true,
    }),
    includeAssertions: Property.Checkbox({
      displayName: 'Include Assertions',
      description: 'Generate comprehensive assertions and expectations',
      required: false,
      defaultValue: true,
    }),
    testNaming: Property.StaticDropdown({
      displayName: 'Test Naming Convention',
      description: 'Choose the test naming convention',
      required: false,
      defaultValue: 'describe-it',
      options: {
        options: [
          { label: 'describe() / it()', value: 'describe-it' },
          { label: 'test()', value: 'test' },
          { label: 'function names', value: 'functions' },
          { label: 'Given-When-Then', value: 'given-when-then' },
        ]
      }
    }),
    parallel: Property.Checkbox({
      displayName: 'Parallel Execution',
      description: 'Design tests to run in parallel',
      required: false,
      defaultValue: false,
    }),
  },
  async run(context) {
    const { 
      code, 
      aiModel, 
      framework, 
      language, 
      testTypes, 
      coverageTarget, 
      includeMocks, 
      includeFixtures, 
      includeSetup, 
      includeAssertions, 
      testNaming, 
      parallel 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const testOptions = {
        framework: framework as TestFramework,
        language: language || 'auto',
        testTypes: testTypes?.map((t: any) => t.testType) || ['unit', 'integration'],
        coverageTarget,
        includeMocks,
        includeFixtures,
        includeSetup,
        includeAssertions,
        testNaming,
        parallel
      };

      const generatedTests = await aiService.generateTests(code, framework as string);

      // Parse the generated tests into different categories
      const parsedTests = this.parseTestsByCategory(generatedTests, testTypes?.map((t: any) => t.testType) || []);

      return {
        success: true,
        code,
        generatedTests,
        parsedTests,
        framework,
        language: language || 'auto',
        testOptions,
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          totalTests: this.countTotalTests(parsedTests),
          coverageTarget,
          includesMocks: includeMocks,
          includesFixtures: includeFixtures,
          includesSetup: includeSetup,
          includesAssertions: includeAssertions,
          testTypes: testTypes?.map((t: any) => t.testType) || [],
          estimatedCoverage: this.estimateCoverage(code, parsedTests),
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

  parseTestsByCategory(testCode: string, categories: string[]): Record<string, string[]> {
    const parsed: Record<string, string[]> = {};
    
    for (const category of categories) {
      // Simple parsing logic - in a real implementation, you'd have more sophisticated parsing
      const categoryTests = this.extractTestsForCategory(testCode, category);
      if (categoryTests.length > 0) {
        parsed[category] = categoryTests;
      }
    }
    
    return parsed;
  },

  extractTestsForCategory(testCode: string, category: string): string[] {
    // Look for test functions or blocks related to this category
    const tests: string[] = [];
    const lines = testCode.split('\n');
    let currentTest = '';
    let inTest = false;
    
    for (const line of lines) {
      if (line.toLowerCase().includes(category.toLowerCase()) || 
          line.toLowerCase().includes('test') || 
          line.toLowerCase().includes('it(') ||
          line.toLowerCase().includes('describe(')) {
        inTest = true;
      }
      
      if (inTest) {
        currentTest += line + '\n';
        
        // Simple heuristic to detect end of test
        if (line.trim() === '}' || line.trim() === '});') {
          tests.push(currentTest.trim());
          currentTest = '';
          inTest = false;
        }
      }
    }
    
    return tests;
  },

  countTotalTests(parsedTests: Record<string, string[]>): number {
    return Object.values(parsedTests).reduce((total, categoryTests) => total + categoryTests.length, 0);
  },

  estimateCoverage(originalCode: string, parsedTests: Record<string, string[]>): number {
    // Simple estimation based on number of tests vs code complexity
    const codeLines = originalCode.split('\n').length;
    const totalTests = this.countTotalTests(parsedTests);
    
    // Rough estimation: 1 test per 10 lines of code = 100% coverage
    const estimatedCoverage = Math.min(100, (totalTests * 10 / codeLines) * 100);
    return Math.round(estimatedCoverage);
  }
});