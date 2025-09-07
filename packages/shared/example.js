import { createEmailAst, createSection, createColumn, createTextBlock, createImageBlock, createButtonBlock, validateEmailAst, parseEmailAst, } from "./src/index.js";
// Example: Create a simple email with header, content, and footer
const exampleEmail = createEmailAst([
    // Header section with logo
    createSection([
        createColumn([
            createImageBlock("logo-image-key", {
                alt: "Company Logo",
                width: 200,
                align: "center",
            }),
        ]),
    ], {
        background: { color: "#f8f9fa" },
        spacing: { paddingTop: 20, paddingBottom: 20 },
    }),
    // Main content section
    createSection([
        createColumn([
            createTextBlock("<h1>Welcome to Our Newsletter!</h1>", {
                typography: {
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#333333",
                },
                align: "center",
            }),
            createTextBlock("<p>Thank you for subscribing, {{first_name}}! Here's what's new this week.</p>", {
                typography: {
                    fontSize: 16,
                    lineHeight: "1.5",
                    color: "#666666",
                },
                spacing: { paddingTop: 20 },
            }),
            createButtonBlock("Read More", "https://example.com/newsletter", {
                backgroundColor: "#007bff",
                color: "#ffffff",
                typography: {
                    fontSize: 16,
                    fontWeight: "bold",
                },
                spacing: { paddingTop: 30, paddingBottom: 30 },
            }),
        ]),
    ], {
        spacing: { paddingTop: 40, paddingBottom: 40 },
    }),
    // Footer section
    createSection([
        createColumn([
            createTextBlock("<p style='font-size: 12px; color: #999;'>You received this email because you subscribed to our newsletter.</p>", {
                align: "center",
                typography: {
                    fontSize: 12,
                    color: "#999999",
                },
            }),
        ]),
    ], {
        background: { color: "#f8f9fa" },
        spacing: { paddingTop: 20, paddingBottom: 20 },
    }),
], {
    name: "Welcome Newsletter",
    width: 600,
    background: { color: "#ffffff" },
});
console.log("Example EmailAst created:");
console.log(JSON.stringify(exampleEmail, null, 2));
// Validate the example
const validationResult = validateEmailAst(exampleEmail);
console.log("\nValidation result:");
console.log(`Valid: ${validationResult.isValid}`);
console.log(`Errors: ${validationResult.errors.length}`);
console.log(`Warnings: ${validationResult.warnings.length}`);
if (validationResult.errors.length > 0) {
    console.log("\nErrors:");
    validationResult.errors.forEach(error => console.log(`- ${error.message}`));
}
if (validationResult.warnings.length > 0) {
    console.log("\nWarnings:");
    validationResult.warnings.forEach(warning => console.log(`- ${warning.message}`));
}
// Test parsing from unknown data
try {
    const parsed = parseEmailAst(exampleEmail);
    console.log("\nSuccessfully parsed EmailAst from data");
}
catch (error) {
    console.error("\nFailed to parse EmailAst:", error);
}
export { exampleEmail };
