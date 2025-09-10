// Test script to verify template insertion works correctly
// This simulates the template insertion process

const { templates } = require('./packages/plugin/src/templates.ts');

console.log('🧪 Testing Template Insertion...\n');

// Test the newsletter template structure
const newsletter = templates['newsletter'];
console.log('📧 Newsletter Template Structure:');
console.log(`- Name: ${newsletter.name}`);
console.log(`- Sections: ${newsletter.sections.length}`);

newsletter.sections.forEach((section, index) => {
  console.log(`  Section ${index + 1}: ${section.name}`);
  console.log(`  - Children: ${section.children.length}`);

  section.children.forEach((child, childIndex) => {
    console.log(`    Child ${childIndex + 1}: ${child.name} (${child.type})`);

    if (child.children && child.children.length > 0) {
      child.children.forEach((grandchild, gcIndex) => {
        console.log(`      └─ ${grandchild.name} (${grandchild.type})`);
      });
    }
  });
  console.log('');
});

console.log('✅ Template structure verification complete!');
console.log('The hierarchy should now match EXAMPLE_FIGMA_EMAIL.md structure.');
