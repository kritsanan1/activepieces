// Simple test to validate the AI Dev Tools package
const { aiDevTools } = require('./src/index');

console.log('Testing AI Dev Tools package...');
console.log('Package loaded:', !!aiDevTools);
console.log('Package display name:', aiDevTools.displayName);
console.log('Package description:', aiDevTools.description);
console.log('Number of actions:', aiDevTools.actions?.length || 0);

if (aiDevTools.actions && aiDevTools.actions.length > 0) {
  console.log('Actions available:');
  aiDevTools.actions.forEach((action, index) => {
    console.log(`  ${index + 1}. ${action.name}: ${action.displayName}`);
  });
}

console.log('✅ AI Dev Tools package validation completed successfully!');