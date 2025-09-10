const testMjml = async () => {
  const response = await fetch('http://localhost:4000/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ast: {
        name: "Test",
        width: 600,
        background: { color: "#FFFFFF" },
        sections: [{
          id: "test",
          name: "Test Section",
          type: "section",
          background: { color: "#FFFFFF" },
          spacing: { paddingTop: 20, paddingRight: 20, paddingBottom: 20, paddingLeft: 20 },
          fullWidth: false,
          columns: [{
            id: "col",
            name: "Column",
            type: "column",
            widthPercent: 100,
            spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
            blocks: [{
              id: "text1",
              name: "Email/Test",
              type: "text",
              html: "Test content",
              typography: { fontFamily: "Arial", fontSize: 16, color: "#000000", lineHeight: 1.4 },
              align: "center",
              spacing: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
              editable: true,
              editRegionName: "Test"
            }]
          }]
        }]
      },
      images: {}
    })
  });

  const result = await response.json();
  console.log('MJML Output:');
  console.log(result.mjml);
};

testMjml();
