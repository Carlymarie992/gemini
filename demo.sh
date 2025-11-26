#!/bin/bash

# Example workflow demonstrating the Legal AI Assistant
# This script shows how to use the various features

echo "🔮 Legal AI Assistant - Demo Workflow"
echo "======================================"
echo ""

# Show help
echo "1. Getting help:"
echo "   node cli.js help"
echo ""

# List commands
echo "2. Available commands:"
node cli.js --help
echo ""

# Show document organization
echo "3. Document Organization System:"
node cli.js docs:organize
echo ""

# Run tests
echo "4. Running tests to verify functionality:"
npm test
echo ""

echo "======================================"
echo "✓ Demo complete!"
echo ""
echo "To get started:"
echo "  1. Create a case: node cli.js case:create"
echo "  2. Add evidence: node cli.js evidence:add <caseId>"
echo "  3. View your case: node cli.js case:view <caseId>"
echo ""
