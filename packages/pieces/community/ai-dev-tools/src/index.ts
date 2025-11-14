import { createPiece, PieceAuth, PieceCategory } from '@activepieces/pieces-framework';
import { generateCode } from './lib/actions/generate-code';
import { optimizeCode } from './lib/actions/optimize-code';
import { debugCode } from './lib/actions/debug-code';
import { generateTests } from './lib/actions/generate-tests';
import { createDocumentation } from './lib/actions/create-documentation';
import { analyzeCodeQuality } from './lib/actions/analyze-code-quality';
import { refactorCode } from './lib/actions/refactor-code';
import { generateSchema } from './lib/actions/generate-schema';
import { createApiClient } from './lib/actions/create-api-client';

export const aiDevTools = createPiece({
  displayName: 'AI Development Tools',
  description: 'Advanced AI-powered development tools for code generation, optimization, debugging, and more',
  minimumSupportedRelease: '0.71.4',
  logoUrl: 'https://cdn.activepieces.com/pieces/ai-dev-tools.png',
  categories: [PieceCategory.DEVELOPER_TOOLS, PieceCategory.ARTIFICIAL_INTELLIGENCE],
  auth: PieceAuth.None(),
  actions: [
    generateCode,
    optimizeCode,
    debugCode,
    generateTests,
    createDocumentation,
    analyzeCodeQuality,
    refactorCode,
    generateSchema,
    createApiClient
  ],
  triggers: [],
  authors: ["ai-dev-tools-team"],
});

export { AIProvider, AIModel, CodeLanguage, CodeQualityMetrics, TestFramework, DocumentationType, SchemaType, CodeStyle } from './lib/common/types';