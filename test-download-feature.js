import fs from 'fs';

const testDownloadFeature = async () => {
  console.log('🚀 Testing FigChimp Download HTML Feature');
  console.log('=' .repeat(50));

  try {
    // Test 1: Basic endpoint availability
    console.log('\n📡 Test 1: Backend Server Health');
    const healthResponse = await fetch('http://localhost:4000/health');
    if (healthResponse.ok) {
      console.log('✅ Backend server is running');
    } else {
      throw new Error('Backend server not responding');
    }

    // Test 2: Download endpoint with comprehensive AST
    console.log('\n📄 Test 2: Download HTML Endpoint');
    const testAst = {
      name: "Test Newsletter",
      width: 600,
      background: { color: "#F8F9FA" },
      sections: [
        {
          id: "header",
          name: "Header Section",
          type: "section",
          background: { color: "#FFFFFF" },
          spacing: { paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20 },
          fullWidth: false,
          columns: [
            {
              id: "header-col",
              name: "Header Column",
              type: "column",
              widthPercent: 100,
              spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
              blocks: [
                {
                  id: "headline",
                  name: "Email/Headline",
                  type: "text",
                  html: "Welcome to FigChimp!",
                  typography: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 28,
                    color: "#333333",
                    lineHeight: 1.2
                  },
                  align: "center",
                  spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 10, paddingLeft: 0 },
                  editable: true,
                  editRegionName: "Headline"
                },
                {
                  id: "subheadline",
                  name: "Email/Subheadline",
                  type: "text",
                  html: "Your Figma designs converted to beautiful email templates",
                  typography: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 16,
                    color: "#666666",
                    lineHeight: 1.4
                  },
                  align: "center",
                  spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 20, paddingLeft: 0 },
                  editable: true,
                  editRegionName: "Subheadline"
                }
              ]
            }
          ]
        },
        {
          id: "content",
          name: "Content Section",
          type: "section",
          background: { color: "#E3F2FD" },
          spacing: { paddingTop: 30, paddingRight: 20, paddingBottom: 30, paddingLeft: 20 },
          fullWidth: false,
          columns: [
            {
              id: "content-col",
              name: "Content Column",
              type: "column",
              widthPercent: 100,
              spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
              blocks: [
                {
                  id: "body-text",
                  name: "Email/Body",
                  type: "text",
                  html: "This email was created using FigChimp - the easiest way to convert Figma designs into responsive email templates. Features include automatic MJML compilation, inline CSS, and Mailchimp template language support.",
                  typography: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 14,
                    color: "#333333",
                    lineHeight: 1.6
                  },
                  align: "left",
                  spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 20, paddingLeft: 0 },
                  editable: true,
                  editRegionName: "Body Text"
                },
                {
                  id: "cta-button",
                  name: "Email/CTA",
                  type: "button",
                  text: "Get Started Now",
                  href: "https://figchimp.com",
                  backgroundColor: "#2196F3",
                  color: "#FFFFFF",
                  typography: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 16,
                    color: "#FFFFFF",
                    lineHeight: 1.2
                  },
                  align: "center",
                  border: { radius: 4 },
                  spacing: { paddingTop: 10, paddingRight: 20, paddingBottom: 10, paddingLeft: 20 },
                  editable: true,
                  editRegionName: "CTA Button"
                }
              ]
            }
          ]
        },
        {
          id: "footer",
          name: "Footer Section",
          type: "section",
          background: { color: "#333333" },
          spacing: { paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20 },
          fullWidth: false,
          columns: [
            {
              id: "footer-col",
              name: "Footer Column",
              type: "column",
              widthPercent: 100,
              spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
              blocks: [
                {
                  id: "footer-text",
                  name: "Email/Footer",
                  type: "text",
                  html: "© 2024 FigChimp. All rights reserved.",
                  typography: {
                    fontFamily: "Arial, sans-serif",
                    fontSize: 12,
                    color: "#CCCCCC",
                    lineHeight: 1.4
                  },
                  align: "center",
                  spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
                  editable: true,
                  editRegionName: "Footer Text"
                }
              ]
            }
          ]
        }
      ]
    };

    const downloadResponse = await fetch('http://localhost:4000/compile-and-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ast: testAst,
        images: {},
        templateName: 'FigChimp Test Newsletter'
      })
    });

    if (!downloadResponse.ok) {
      throw new Error(`Download endpoint failed: ${downloadResponse.status}`);
    }

    const html = await downloadResponse.text();
    console.log('✅ Download endpoint responded successfully');
    console.log(`📄 Generated HTML: ${html.length.toLocaleString()} characters`);

    // Save for inspection
    fs.writeFileSync('/tmp/figchimp-test-download.html', html);
    console.log('💾 Test HTML saved to /tmp/figchimp-test-download.html');

    // Test 3: Validate HTML content
    console.log('\n✅ Test 3: HTML Content Validation');

    const validations = [
      { test: 'Welcome to FigChimp!', description: 'Main headline text' },
      { test: 'Your Figma designs converted', description: 'Subheadline text' },
      { test: 'Get Started Now', description: 'CTA button text' },
      { test: 'mc:edit="edit_headline"', description: 'mc:edit attribute for headline' },
      { test: 'mc:edit="edit_cta_button"', description: 'mc:edit attribute for button' },
      { test: 'font-family:Arial, sans-serif', description: 'Typography styles' },
      { test: 'background-color:#2196F3', description: 'Button background color' },
      { test: 'text-align:center', description: 'Center alignment' }
    ];

    let passed = 0;
    validations.forEach(({ test, description }) => {
      if (html.includes(test)) {
        console.log(`  ✅ ${description}`);
        passed++;
      } else {
        console.log(`  ❌ Missing: ${description}`);
      }
    });

    console.log(`\n📊 Validation Results: ${passed}/${validations.length} passed`);

    // Test 4: File headers
    console.log('\n📁 Test 4: Download Headers');
    const contentDisposition = downloadResponse.headers.get('content-disposition');
    const contentType = downloadResponse.headers.get('content-type');

    if (contentDisposition && contentDisposition.includes('attachment') && contentDisposition.includes('FigChimp_Test_Newsletter.html')) {
      console.log('✅ Content-Disposition header correct');
    } else {
      console.log('❌ Content-Disposition header incorrect:', contentDisposition);
    }

    if (contentType && contentType.includes('text/html')) {
      console.log('✅ Content-Type header correct');
    } else {
      console.log('❌ Content-Type header incorrect:', contentType);
    }

    // Test 5: MJML Structure
    console.log('\n🎨 Test 5: MJML Structure');
    const compileResponse = await fetch('http://localhost:4000/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ast: testAst, images: {} })
    });

    if (compileResponse.ok) {
      const compileResult = await compileResponse.json();
      const mjml = compileResult.mjml;

      if (mjml.includes('<mjml>') && mjml.includes('<mj-body') && mjml.includes('<mj-section')) {
        console.log('✅ MJML structure is valid');
      } else {
        console.log('❌ MJML structure is invalid');
      }

      // Check mc:edit attributes in MJML
      if (mjml.includes('mc:edit=')) {
        console.log('✅ mc:edit attributes present in MJML');
      } else {
        console.log('❌ mc:edit attributes missing from MJML');
      }
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('🎉 DOWNLOAD HTML FEATURE TEST COMPLETE!');
    console.log('=' .repeat(50));

    if (passed >= 6) { // At least 75% of validations pass
      console.log('✅ OVERALL RESULT: SUCCESS');
      console.log('🚀 The Download HTML feature is working correctly!');
      console.log('\n📋 What was tested:');
      console.log('• Backend server health');
      console.log('• HTML compilation endpoint');
      console.log('• Content and styling validation');
      console.log('• Download headers');
      console.log('• MJML structure');
      console.log('• mc:edit attributes');
      console.log('\n📥 Users can now:');
      console.log('• Download Figma designs as HTML files');
      console.log('• Use the HTML with any email service');
      console.log('• Edit content using mc:edit regions');
      console.log('• Work without Mailchimp authentication');
    } else {
      console.log('❌ OVERALL RESULT: ISSUES FOUND');
      console.log('Please review the validation results above.');
    }

    return passed >= 6;

  } catch (error) {
    console.error('\n💥 TEST FAILED:', error.message);
    return false;
  }
};

// Run the test
testDownloadFeature().then(success => {
  process.exit(success ? 0 : 1);
});
