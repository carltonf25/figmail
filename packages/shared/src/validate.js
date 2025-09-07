// Email validation constraints
const EMAIL_CONSTRAINTS = {
    MAX_WIDTH: 800,
    MIN_WIDTH: 320,
    MAX_SECTIONS: 50,
    MAX_COLUMNS_PER_SECTION: 4,
    MAX_BLOCKS_PER_COLUMN: 20,
    MAX_IMAGE_WIDTH: 600,
    MIN_BUTTON_TEXT_LENGTH: 1,
    MAX_BUTTON_TEXT_LENGTH: 50,
    MAX_TEXT_LENGTH: 10000,
};
/**
 * Validates an EmailAst for email client compatibility and best practices
 */
export function validateEmailAst(ast) {
    const errors = [];
    const warnings = [];
    // Validate email width
    if (ast.width > EMAIL_CONSTRAINTS.MAX_WIDTH) {
        warnings.push({
            message: `Email width ${ast.width}px exceeds recommended maximum of ${EMAIL_CONSTRAINTS.MAX_WIDTH}px`,
            path: "width",
            severity: "warning",
        });
    }
    if (ast.width < EMAIL_CONSTRAINTS.MIN_WIDTH) {
        errors.push({
            message: `Email width ${ast.width}px is below minimum of ${EMAIL_CONSTRAINTS.MIN_WIDTH}px`,
            path: "width",
            severity: "error",
        });
    }
    // Validate sections count
    if (ast.sections.length > EMAIL_CONSTRAINTS.MAX_SECTIONS) {
        warnings.push({
            message: `Email has ${ast.sections.length} sections, consider reducing for better performance`,
            path: "sections",
            severity: "warning",
        });
    }
    // Validate each section
    ast.sections.forEach((section, sectionIndex) => {
        validateSection(section, `sections[${sectionIndex}]`, errors, warnings);
    });
    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}
function validateSection(section, path, errors, warnings) {
    // Validate column count
    if (section.columns.length > EMAIL_CONSTRAINTS.MAX_COLUMNS_PER_SECTION) {
        warnings.push({
            message: `Section has ${section.columns.length} columns, consider using fewer for better mobile compatibility`,
            path: `${path}.columns`,
            severity: "warning",
        });
    }
    // Validate column width percentages
    const totalWidth = section.columns.reduce((sum, col) => sum + (col.widthPercent || 0), 0);
    if (totalWidth > 100) {
        errors.push({
            message: `Column widths total ${totalWidth}%, must not exceed 100%`,
            path: `${path}.columns`,
            severity: "error",
        });
    }
    // Check if all columns have width percentages
    const hasWidthPercents = section.columns.some(col => col.widthPercent !== undefined);
    const allHaveWidthPercents = section.columns.every(col => col.widthPercent !== undefined);
    if (hasWidthPercents && !allHaveWidthPercents) {
        warnings.push({
            message: "Some columns have width percentages while others don't. Consider setting all or none for consistent layout",
            path: `${path}.columns`,
            severity: "warning",
        });
    }
    // Validate each column
    section.columns.forEach((column, columnIndex) => {
        validateColumn(column, `${path}.columns[${columnIndex}]`, errors, warnings);
    });
}
function validateColumn(column, path, errors, warnings) {
    // Validate block count
    if (column.blocks.length > EMAIL_CONSTRAINTS.MAX_BLOCKS_PER_COLUMN) {
        warnings.push({
            message: `Column has ${column.blocks.length} blocks, consider breaking into multiple columns for better readability`,
            path: `${path}.blocks`,
            severity: "warning",
        });
    }
    // Validate each block
    column.blocks.forEach((block, blockIndex) => {
        validateBlock(block, `${path}.blocks[${blockIndex}]`, errors, warnings);
    });
}
function validateBlock(block, path, errors, warnings) {
    switch (block.type) {
        case "text":
            validateTextBlock(block, path, errors, warnings);
            break;
        case "image":
            validateImageBlock(block, path, errors, warnings);
            break;
        case "button":
            validateButtonBlock(block, path, errors, warnings);
            break;
        case "divider":
            validateDividerBlock(block, path, errors, warnings);
            break;
        case "spacer":
            validateSpacerBlock(block, path, errors, warnings);
            break;
    }
}
function validateTextBlock(block, path, errors, warnings) {
    if (block.html.length > EMAIL_CONSTRAINTS.MAX_TEXT_LENGTH) {
        warnings.push({
            message: `Text content is ${block.html.length} characters, consider breaking into smaller sections`,
            path: `${path}.html`,
            severity: "warning",
        });
    }
    if (!block.html.trim()) {
        warnings.push({
            message: "Text block is empty",
            path: `${path}.html`,
            severity: "warning",
        });
    }
    // Check for potentially problematic HTML
    if (block.html.includes('<script')) {
        errors.push({
            message: "Script tags are not allowed in email content",
            path: `${path}.html`,
            severity: "error",
        });
    }
}
function validateImageBlock(block, path, errors, warnings) {
    if (block.width && block.width > EMAIL_CONSTRAINTS.MAX_IMAGE_WIDTH) {
        warnings.push({
            message: `Image width ${block.width}px exceeds recommended maximum of ${EMAIL_CONSTRAINTS.MAX_IMAGE_WIDTH}px`,
            path: `${path}.width`,
            severity: "warning",
        });
    }
    if (!block.alt) {
        warnings.push({
            message: "Image missing alt text for accessibility",
            path: `${path}.alt`,
            severity: "warning",
        });
    }
    if (!block.key.trim()) {
        errors.push({
            message: "Image missing key for asset reference",
            path: `${path}.key`,
            severity: "error",
        });
    }
    // Note: src is optional as it gets populated during asset upload
}
function validateButtonBlock(block, path, errors, warnings) {
    if (block.text.length < EMAIL_CONSTRAINTS.MIN_BUTTON_TEXT_LENGTH) {
        errors.push({
            message: "Button text cannot be empty",
            path: `${path}.text`,
            severity: "error",
        });
    }
    if (block.text.length > EMAIL_CONSTRAINTS.MAX_BUTTON_TEXT_LENGTH) {
        warnings.push({
            message: `Button text is ${block.text.length} characters, consider shortening for better mobile display`,
            path: `${path}.text`,
            severity: "warning",
        });
    }
    // Validate URL format
    try {
        new URL(block.href);
    }
    catch {
        errors.push({
            message: "Button href is not a valid URL",
            path: `${path}.href`,
            severity: "error",
        });
    }
}
function validateDividerBlock(block, path, errors, warnings) {
    if (block.thickness > 10) {
        warnings.push({
            message: `Divider thickness ${block.thickness}px may be too thick for good visual design`,
            path: `${path}.thickness`,
            severity: "warning",
        });
    }
}
function validateSpacerBlock(block, path, errors, warnings) {
    if (block.height > 100) {
        warnings.push({
            message: `Spacer height ${block.height}px may be excessive, consider breaking content into sections`,
            path: `${path}.height`,
            severity: "warning",
        });
    }
}
/**
 * Quick validation that only checks for critical errors
 */
export function validateEmailAstQuick(ast) {
    try {
        const result = validateEmailAst(ast);
        return result.isValid;
    }
    catch {
        return false;
    }
}
/**
 * Get only error messages (excluding warnings)
 */
export function getValidationErrors(ast) {
    const result = validateEmailAst(ast);
    return result.errors.map(error => error.message);
}
/**
 * Get only warning messages
 */
export function getValidationWarnings(ast) {
    const result = validateEmailAst(ast);
    return result.warnings.map(warning => warning.message);
}
