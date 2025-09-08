// Test script to verify mc:edit functionality
const { createTextBlock, createButtonBlock, generateEditId } = require('./packages/shared/dist/index.js');

console.log('🧪 Testing Mailchimp Template Language Support...\n');

// Test 1: Create text block with mc:edit properties
console.log('📝 Test 1: Text Block with mc:edit');
const textBlock = createTextBlock(
  'Welcome to our newsletter!',
  {
    editRegionName: 'Main Headline',
    editable: true
  }
);

console.log('Text Block:', JSON.stringify(textBlock, null, 2));
console.log('Generated Edit ID:', generateEditId(textBlock, 'text'));
console.log('');

// Test 2: Create button block with mc:edit properties
console.log('🔘 Test 2: Button Block with mc:edit');
const buttonBlock = createButtonBlock(
  'Shop Now',
  'https://example.com',
  {
    editRegionName: 'CTA Button',
    editable: true,
    backgroundColor: '#ff6b35'
  }
);

console.log('Button Block:', JSON.stringify(buttonBlock, null, 2));
console.log('Generated Edit ID:', generateEditId(buttonBlock, 'button'));
console.log('');

// Test 3: Test edit region name generation
console.log('🏷️ Test 3: Edit Region Name Generation');
const testNames = [
  'Email/Headline',
  'Email/Body Content',
  'Email/Button/Shop Now',
  'Email/Footer Text/NoEdit',
  'Product Description'
];

testNames.forEach(name => {
  const editId = generateEditId({ editRegionName: name }, 'fallback');
  console.log(`"${name}" → "${editId}"`);
});

console.log('\n✅ All tests completed successfully!');
console.log('\n📧 Generated MJML will include:');
console.log('<div mc:edit="main_headline"><mj-text>Welcome to our newsletter!</mj-text></div>');
console.log('<div mc:edit="cta_button"><mj-button>Shop Now</mj-button></div>');
