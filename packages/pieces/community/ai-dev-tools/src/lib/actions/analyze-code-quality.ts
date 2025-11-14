import { createAction, Property } from '@activepieces/pieces-framework';
import { AIService } from '../common/ai-service';
import { AIModel, CodeLanguage, CodeQualityMetrics } from '../common/types';

export const analyzeCodeQuality = createAction({
  name: 'analyze_code_quality',
  displayName: 'Analyze Code Quality',
  description: 'Comprehensive code quality analysis using AI with metrics and improvement suggestions',
  props: {
    code: Property.LongText({
      displayName: 'Code to Analyze',
      description: 'Paste the code you want to analyze for quality',
      required: true,
    }),
    aiModel: Property.StaticDropdown({
      displayName: 'AI Model',
      description: 'Choose the AI model for quality analysis',
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
          { label: 'JavaScript', value: CodeLanguage.JAVASCRIPT },
          { label: 'TypeScript', value: CodeLanguage.TYPESCRIPT },
          { label: 'Python', value: CodeLanguage.PYTHON },
          { label: 'Java', value: CodeLanguage.JAVA },
          { label: 'Go', value: CodeLanguage.GO },
          { label: 'Rust', value: CodeLanguage.RUST },
          { label: 'C#', value: CodeLanguage.CSHARP },
          { label: 'Auto-detect', value: 'auto' },
        ]
      }
    }),
    analysisType: Property.Array({
      displayName: 'Analysis Types',
      description: 'Select types of analysis to perform',
      required: false,
      defaultValue: [
        { analysis: 'readability' },
        { analysis: 'maintainability' },
        { analysis: 'performance' }
      ],
      properties: {
        analysis: Property.StaticDropdown({
          displayName: 'Analysis Type',
          required: true,
          options: {
            options: [
              { label: 'Code Readability', value: 'readability' },
              { label: 'Maintainability', value: 'maintainability' },
              { label: 'Performance', value: 'performance' },
              { label: 'Security', value: 'security' },
              { label: 'Best Practices', value: 'best-practices' },
              { label: 'Code Smells', value: 'code-smells' },
              { label: 'Complexity Analysis', value: 'complexity' },
              { label: 'Documentation Coverage', value: 'documentation' },
              { label: 'Error Handling', value: 'error-handling' },
              { label: 'Test Coverage', value: 'test-coverage' },
            ]
          }
        })
      }
    }),
    includeScore: Property.Checkbox({
      displayName: 'Include Quality Score',
      description: 'Include overall quality score (0-100)',
      required: false,
      defaultValue: true,
    }),
    includeSuggestions: Property.Checkbox({
      displayName: 'Include Suggestions',
      description: 'Include specific improvement suggestions',
      required: false,
      defaultValue: true,
    }),
    includeComparison: Property.Checkbox({
      displayName: 'Include Comparison',
      description: 'Compare against industry standards',
      required: false,
      defaultValue: false,
    }),
    includeRefactoring: Property.Checkbox({
      displayName: 'Include Refactoring',
      description: 'Suggest specific refactoring improvements',
      required: false,
      defaultValue: true,
    }),
    severityThreshold: Property.StaticDropdown({
      displayName: 'Issue Severity Threshold',
      description: 'Minimum severity level for reported issues',
      required: false,
      defaultValue: 'warning',
      options: {
        options: [
          { label: 'Critical Only', value: 'critical' },
          { label: 'Warning and Above', value: 'warning' },
          { label: 'All Issues', value: 'info' },
        ]
      }
    }),
    codingStandards: Property.StaticDropdown({
      displayName: 'Coding Standards',
      description: 'Which coding standards to check against?',
      required: false,
      defaultValue: 'general',
      options: {
        options: [
          { label: 'General Best Practices', value: 'general' },
          { label: 'Google Style Guide', value: 'google' },
          { label: 'Airbnb Style Guide', value: 'airbnb' },
          { label: 'Microsoft Guidelines', value: 'microsoft' },
          { label: 'PEP 8 (Python)', value: 'pep8' },
          { label: 'PSR (PHP)', value: 'psr' },
          { label: 'Custom', value: 'custom' },
        ]
      }
    }),
  },
  async run(context) {
    const { 
      code, 
      aiModel, 
      language, 
      analysisType, 
      includeScore, 
      includeSuggestions, 
      includeComparison, 
      includeRefactoring, 
      severityThreshold, 
      codingStandards 
    } = context.propsValue;

    try {
      const aiService = new AIService('', aiModel as AIModel, aiModel as AIModel);
      
      const analysisOptions = {
        language: language || 'auto',
        analysisTypes: analysisType?.map((a: any) => a.analysis) || ['readability', 'maintainability'],
        includeScore,
        includeSuggestions,
        includeComparison,
        includeRefactoring,
        severityThreshold: severityThreshold || 'warning',
        codingStandards: codingStandards || 'general'
      };

      const qualityAnalysis = await aiService.analyzeCodeQuality(code, language as string);

      // Parse the analysis to extract structured information
      const parsedAnalysis = this.parseQualityAnalysis(qualityAnalysis);
      const score = includeScore ? this.extractQualityScore(parsedAnalysis) : null;
      const suggestions = includeSuggestions ? this.extractSuggestions(parsedAnalysis) : [];
      const issues = this.extractIssues(parsedAnalysis, severityThreshold || 'warning');

      return {
        success: true,
        code,
        qualityAnalysis,
        score,
        suggestions,
        issues,
        language: language || 'auto',
        analysisTypes: analysisType?.map((a: any) => a.analysis) || [],
        aiModel,
        timestamp: new Date().toISOString(),
        metadata: {
          complexity: this.estimateComplexity(code),
          maintainability: this.estimateMaintainability(code, issues),
          testCoverage: this.estimateTestCoverage(code),
          documentationCoverage: this.estimateDocumentationCoverage(code),
          securityScore: this.estimateSecurityScore(code, issues),
          performanceScore: this.estimatePerformanceScore(code, issues),
          totalIssues: issues.length,
          criticalIssues: issues.filter(i => i.severity === 'critical').length,
          warningIssues: issues.filter(i => i.severity === 'warning').length,
          infoIssues: issues.filter(i => i.severity === 'info').length,
          codingStandards: codingStandards || 'general',
          severityThreshold: severityThreshold || 'warning'
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

  parseQualityAnalysis(analysis: string): any {
    // Parse the AI analysis to extract structured information
    const lines = analysis.split('\n');
    const parsed: any = {
      issues: [],
      suggestions: [],
      metrics: {}
    };

    for (const line of lines) {
      // Extract issues
      const issueMatch = line.match(/\[?(error|warning|info|critical)\]?\s*[:\-]\s*(.+)/i);
      if (issueMatch) {
        parsed.issues.push({
          severity: issueMatch[1].toLowerCase(),
          description: issueMatch[2].trim()
        });
      }

      // Extract suggestions
      const suggestionMatch = line.match(/\*\s*(.+)/);
      if (suggestionMatch) {
        parsed.suggestions.push(suggestionMatch[1].trim());
      }

      // Extract metrics
      const metricMatch = line.match(/(complexity|maintainability|coverage|security):\s*(\d+)/i);
      if (metricMatch) {
        parsed.metrics[metricMatch[1].toLowerCase()] = parseInt(metricMatch[2]);
      }
    }

    return parsed;
  },

  extractQualityScore(analysis: any): number {
    // Calculate a quality score based on the analysis
    let score = 100;
    
    // Deduct points for issues
    if (analysis.issues) {
      for (const issue of analysis.issues) {
        switch (issue.severity) {
          case 'critical': score -= 20; break;
          case 'error': score -= 15; break;
          case 'warning': score -= 5; break;
          case 'info': score -= 2; break;
        }
      }
    }

    // Deduct points for poor metrics
    if (analysis.metrics) {
      if (analysis.metrics.complexity > 10) score -= 10;
      if (analysis.metrics.maintainability < 70) score -= 10;
      if (analysis.metrics.coverage < 80) score -= 5;
      if (analysis.metrics.security < 80) score -= 15;
    }

    return Math.max(0, Math.min(100, score));
  },

  extractSuggestions(analysis: any): string[] {
    return analysis.suggestions || [];
  },

  extractIssues(analysis: any, severityThreshold: string): Array<{severity: string, description: string, line?: number}> {
    const thresholdMap: Record<string, number> = {
      'info': 1,
      'warning': 2,
      'error': 3,
      'critical': 4
    };
    
    const threshold = thresholdMap[severityThreshold] || 2;
    
    return (analysis.issues || [])
      .filter((issue: any) => thresholdMap[issue.severity] >= threshold)
      .map((issue: any) => ({
        severity: issue.severity,
        description: issue.description,
        line: issue.line || this.findLineForIssue(issue.description)
      }));
  },

  findLineForIssue(description: string): number | undefined {
    // Try to extract line number from description
    const lineMatch = description.match(/line\s+(\d+)/i);
    return lineMatch ? parseInt(lineMatch[1]) : undefined;
  },

  estimateComplexity(code: string): number {
    // Simple complexity estimation based on control structures
    const controlStructures = (code.match(/\b(if|for|while|switch|catch)\b/g) || []).length;
    const logicalOperators = (code.match(/\b(&&|\|\||\?\:)\b/g) || []).length;
    const nestingDepth = this.estimateNestingDepth(code);
    
    return Math.min(100, Math.max(0, (controlStructures + logicalOperators + nestingDepth) * 2));
  },

  estimateNestingDepth(code: string): number {
    // Estimate maximum nesting depth
    let maxDepth = 0;
    let currentDepth = 0;
    const lines = code.split('\n');
    
    for (const line of lines) {
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      
      currentDepth += openBraces - closeBraces;
      maxDepth = Math.max(maxDepth, currentDepth);
    }
    
    return maxDepth;
  },

  estimateMaintainability(code: string, issues: any[]): number {
    // Estimate maintainability based on code length and issues
    const lines = code.split('\n').length;
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const errorIssues = issues.filter(i => i.severity === 'error').length;
    
    let score = 100;
    if (lines > 100) score -= 10;
    if (lines > 200) score -= 10;
    score -= criticalIssues * 15;
    score -= errorIssues * 10;
    
    return Math.max(0, score);
  },

  estimateTestCoverage(code: string): number {
    // Estimate test coverage based on code structure
    const functions = (code.match(/\bfunction\s+\w+|\b\w+\s*\([^)]*\)\s*{|\bconst\s+\w+\s*=\s*[^=]*=>/g) || []).length;
    const classes = (code.match(/\bclass\s+\w+/g) || []).length;
    const complexity = this.estimateComplexity(code);
    
    // Rough estimation
    return Math.min(100, Math.max(0, 100 - complexity + (functions + classes) * 2));
  },

  estimateDocumentationCoverage(code: string): number {
    // Estimate documentation coverage
    const commentLines = (code.match(/\/\/.*$|\/\*[\s\S]*?\*\//gm) || []).length;
    const totalLines = code.split('\n').length;
    
    return Math.min(100, Math.max(0, (commentLines / totalLines) * 200));
  },

  estimateSecurityScore(code: string, issues: any[]): number {
    // Estimate security score
    let score = 100;
    const securityIssues = issues.filter(i => 
      i.description.toLowerCase().includes('security') ||
      i.description.toLowerCase().includes('injection') ||
      i.description.toLowerCase().includes('xss') ||
      i.description.toLowerCase().includes('csrf')
    );
    
    score -= securityIssues.length * 20;
    return Math.max(0, score);
  },

  estimatePerformanceScore(code: string, issues: any[]): number {
    // Estimate performance score
    let score = 100;
    const performanceIssues = issues.filter(i => 
      i.description.toLowerCase().includes('performance') ||
      i.description.toLowerCase().includes('inefficient') ||
      i.description.toLowerCase().includes('slow')
    );
    
    score -= performanceIssues.length * 10;
    return Math.max(0, score);
  }
});