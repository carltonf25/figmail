// Test script for multi-column layout functionality
// This creates a sample AST with 2-column and 3-column layouts

const { createEmailAst, createSection, createColumn, createTextBlock, createImageBlock, createButtonBlock } = require('./packages/shared/dist/index.js');

console.log('🧪 Testing Multi-Column Layout Generation...\n');

// Create a 2-column section
const twoColumnSection = createSection([
  createColumn([
    createImageBlock('hero-image', {
      src: 'https://example.com/hero.jpg',
      alt: 'Hero Image',
      width: 280
    }),
    createTextBlock('<h2>Amazing Product</h2>', {
      typography: { fontSize: 24, fontWeight: 'bold' }
    })
  ], { widthPercent: 50 }),

  createColumn([
    createTextBlock('<p>This incredible product will change your workflow forever. With cutting-edge features and intuitive design, it\'s the perfect solution for modern teams.</p>', {
      typography: { fontSize: 16 }
    }),
    createButtonBlock('Learn More', 'https://example.com/learn-more', {
      backgroundColor: '#007bff'
    })
  ], { widthPercent: 50 })
], { spacing: { paddingTop: 20, paddingBottom: 20 } });

// Create a 3-column section
const threeColumnSection = createSection([
  createColumn([
    createImageBlock('icon1', {
      src: 'https://example.com/icon1.png',
      width: 60
    }),
    createTextBlock('<h3>Feature 1</h3>', {
      typography: { fontSize: 18, fontWeight: 'bold' }
    }),
    createTextBlock('<p>Powerful feature that saves you time and effort.</p>', {
      typography: { fontSize: 14 }
    })
  ], { widthPercent: 33 }),

  createColumn([
    createImageBlock('icon2', {
      src: 'https://example.com/icon2.png',
      width: 60
    }),
    createTextBlock('<h3>Feature 2</h3>', {
      typography: { fontSize: 18, fontWeight: 'bold' }
    }),
    createTextBlock('<p>Seamless integration with your existing tools.</p>', {
      typography: { fontSize: 14 }
    })
  ], { widthPercent: 34 }),

  createColumn([
    createImageBlock('icon3', {
      src: 'https://example.com/icon3.png',
      width: 60
    }),
    createTextBlock('<h3>Feature 3</h3>', {
      typography: { fontSize: 18, fontWeight: 'bold' }
    }),
    createTextBlock('<p>Advanced analytics to track your success.</p>', {
      typography: { fontSize: 14 }
    })
  ], { widthPercent: 33 })
], {
  background: { color: '#f8f9fa' },
  spacing: { paddingTop: 20, paddingBottom: 20 }
});

// Create the full email
const emailAst = createEmailAst([twoColumnSection, threeColumnSection], {
  name: 'Multi-Column Test Template',
  width: 600,
  background: { color: '#ffffff' }
});

console.log('✅ Multi-column AST created successfully!');
console.log('📊 Email structure:');
console.log(`- Width: ${emailAst.width}px`);
console.log(`- Sections: ${emailAst.sections.length}`);
console.log(`- Section 1 columns: ${emailAst.sections[0].columns.length} (widths: ${emailAst.sections[0].columns.map(c => c.widthPercent + '%').join(', ')})`);
console.log(`- Section 2 columns: ${emailAst.sections[1].columns.length} (widths: ${emailAst.sections[1].columns.map(c => c.widthPercent + '%').join(', ')})`);

console.log('\n🎉 Multi-column layout test completed!');
console.log('The plugin should now handle 2-3 column layouts correctly.');
console.log('Test by creating sections with Email/Column/[Name] frames in Figma.');
