#!/bin/bash

# AI Development Tools - Test Runner Script

echo "================================================"
echo "AI Development Tools - Unit Test Suite"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Package: AI Development Tools${NC}"
echo -e "${YELLOW}📍 Location: packages/pieces/community/ai-dev-tools${NC}"
echo ""

# Test categories
echo "Test Categories:"
echo "  ✓ Common Types & Enums"
echo "  ✓ Constants & Configuration"
echo "  ✓ AI Service Layer"
echo "  ✓ Code Generation Action"
echo "  ✓ Code Optimization Action"
echo "  ✓ Code Debugging Action"
echo ""

# Check if Jest is available
if command -v jest &> /dev/null; then
    echo -e "${GREEN}✓ Jest found - running tests...${NC}"
    echo ""
    
    # Run tests with coverage
    npm test -- --coverage --verbose
    
    EXIT_CODE=$?
    
    if [ $EXIT_CODE -eq 0 ]; then
        echo ""
        echo -e "${GREEN}================================================${NC}"
        echo -e "${GREEN}✅ All tests passed successfully!${NC}"
        echo -e "${GREEN}================================================${NC}"
    else
        echo ""
        echo -e "${RED}================================================${NC}"
        echo -e "${RED}❌ Some tests failed!${NC}"
        echo -e "${RED}================================================${NC}"
    fi
    
    exit $EXIT_CODE
else
    echo -e "${YELLOW}⚠️  Jest not found - displaying test files...${NC}"
    echo ""
    
    # List all test files
    echo "Test Files:"
    find src -name "*.spec.ts" -type f | while read file; do
        echo "  - $file"
    done
    
    echo ""
    echo -e "${YELLOW}To run tests, install dependencies first:${NC}"
    echo "  npm install"
    echo "  npm test"
fi