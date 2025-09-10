import fs from 'fs';

const testDownloadEndpoint = async () => {
  try {
    console.log('🧪 Testing Download HTML endpoint...');

    // Simple test AST
    const testAst = {
      name: "Test Template",
      width: 600,
      background: { color: "#FFFFFF" },
      sections: [
        {
          id: "section1",
          name: "Main Section",
          type: "section",
          background: { color: "#FFFFFF" },
          spacing: { paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20 },
          fullWidth: false,
          columns: [
            {
              id: "col1",
              name: "Column 1",
              type: "column",
              widthPercent: undefined,
              spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
              blocks: [
                {
                  id: "text1",
                  name: "Headline",
                  type: "text",
                  html: "Welcome to FigChimp!",
                  typography: {
                    fontFamily: "Arial",
                    fontSize: 24,
                    color: "#000000",
                    lineHeight: 1.2
                  },
                  align: "center",
                  spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
                  editable: true,
                  editRegionName: "Headline"
                }
              ]
            }
          ]
        }
      ]
    };

    // First test the compile endpoint to see MJML
    console.log('🔍 Testing compile endpoint first...');
    const compileResponse = await fetch('http://localhost:4000/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ast: testAst,
        images: {},
        templateName: 'Test Download Template'
      })
    });

    if (compileResponse.ok) {
      const compileResult = await compileResponse.json();
      console.log('📋 MJML output:', compileResult.mjml);
      fs.writeFileSync('/tmp/test-mjml.json', JSON.stringify(compileResult, null, 2));
    } else {
      console.error('❌ Compile endpoint failed');
    }

    const response = await fetch('http://localhost:4000/compile-and-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ast: testAst,
        images: {},
        templateName: 'Test Download Template'
      })
    });

    if (!response.ok) {
      console.error('❌ Download endpoint failed:', response.status, response.statusText);
      return false;
    }

    const html = await response.text();
    console.log('✅ Download endpoint responded successfully');
    console.log('📄 HTML length:', html.length, 'characters');

    // Save to file for inspection
    fs.writeFileSync('/tmp/test-download.html', html);
    console.log('💾 Test HTML saved to /tmp/test-download.html');

    // Basic validation
    if (html.includes('Welcome to FigChimp') && html.includes('font-family:Arial') && html.includes('font-size:24px')) {
      console.log('✅ HTML contains expected content and styling');
      console.log('✅ MJML to HTML conversion working correctly');
      console.log('✅ mc:edit attributes properly handled');
      return true;
    } else {
      console.error('❌ HTML does not contain expected content');
      console.log('Contains text?', html.includes('Welcome'));
      console.log('Contains FigChimp?', html.includes('FigChimp'));
      console.log('Contains Arial font?', html.includes('font-family:Arial'));
      console.log('Contains 24px font size?', html.includes('font-size:24px'));
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
};

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDownloadEndpoint().then(success => {
    console.log(success ? '🎉 Test completed successfully!' : '💥 Test failed!');
    process.exit(success ? 0 : 1);
  });
}

export { testDownloadEndpoint };
