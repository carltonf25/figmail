import { z } from "zod";
// Common types
const Color = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color");
const NonNegativeNumber = z.number().min(0);
const PositiveNumber = z.number().min(1);
// Typography schema
const Typography = z.object({
    fontFamily: z.string().optional(),
    fontSize: NonNegativeNumber.optional(),
    fontWeight: z.union([z.number(), z.string()]).optional(),
    lineHeight: z.union([z.number(), z.string()]).optional(),
    color: Color.optional(),
    letterSpacing: z.number().optional(),
}).optional();
// Spacing/padding schema
const Spacing = z.object({
    paddingTop: NonNegativeNumber.optional(),
    paddingRight: NonNegativeNumber.optional(),
    paddingBottom: NonNegativeNumber.optional(),
    paddingLeft: NonNegativeNumber.optional(),
}).optional();
// Border schema
const Border = z.object({
    width: NonNegativeNumber.optional(),
    color: Color.optional(),
    radius: NonNegativeNumber.optional(),
}).optional();
// Background schema
const Background = z.object({
    color: Color.optional(),
}).optional();
// Alignment options
const Alignment = z.enum(["left", "center", "right"]);
// Block types
const TextBlock = z.object({
    type: z.literal("text"),
    html: z.string(), // HTML content (supports merge tags)
    typography: Typography,
    align: Alignment.default("left"),
    spacing: Spacing,
});
const ImageBlock = z.object({
    type: z.literal("image"),
    key: z.string(), // Unique key for referencing the image binary data
    src: z.string().optional(), // Will be populated after S3 upload
    alt: z.string().optional(),
    width: PositiveNumber.optional(),
    align: Alignment.default("center"),
    spacing: Spacing,
    border: Border,
    href: z.string().url().optional(), // Link URL for clickable images
});
const ButtonBlock = z.object({
    type: z.literal("button"),
    text: z.string(),
    href: z.string().url(),
    backgroundColor: Color.default("#007bff"),
    color: Color.default("#ffffff"),
    typography: Typography,
    align: Alignment.default("center"),
    spacing: Spacing,
    border: Border,
});
const DividerBlock = z.object({
    type: z.literal("divider"),
    color: Color.default("#dddddd"),
    thickness: PositiveNumber.default(1),
    spacing: Spacing,
});
const SpacerBlock = z.object({
    type: z.literal("spacer"),
    height: PositiveNumber.default(20),
});
// Union type for all blocks
export const Block = z.discriminatedUnion("type", [
    TextBlock,
    ImageBlock,
    ButtonBlock,
    DividerBlock,
    SpacerBlock,
]);
// Column schema
const Column = z.object({
    widthPercent: z.number().min(1).max(100).optional(), // Column width as percentage
    spacing: Spacing,
    blocks: z.array(Block),
});
// Section schema
const Section = z.object({
    background: Background,
    fullWidth: z.boolean().default(false), // Whether section spans full email width
    spacing: Spacing,
    columns: z.array(Column).min(1),
});
// Main EmailAst schema
export const EmailAst = z.object({
    name: z.string().optional(), // Template name
    width: PositiveNumber.default(600), // Email width in pixels
    background: Background,
    sections: z.array(Section).min(1),
});
// Schema validation functions
export function parseEmailAst(data) {
    return EmailAst.parse(data);
}
export function isValidEmailAst(data) {
    return EmailAst.safeParse(data).success;
}
// Helper functions for common AST operations
export function createTextBlock(html, options = {}) {
    return {
        type: "text",
        html,
        align: "left",
        ...options,
    };
}
export function createImageBlock(key, options = {}) {
    return {
        type: "image",
        key,
        align: "center",
        ...options,
    };
}
export function createButtonBlock(text, href, options = {}) {
    return {
        type: "button",
        text,
        href,
        backgroundColor: "#007bff",
        color: "#ffffff",
        align: "center",
        ...options,
    };
}
export function createColumn(blocks, options = {}) {
    return {
        blocks,
        ...options,
    };
}
export function createSection(columns, options = {}) {
    return {
        columns,
        fullWidth: false,
        ...options,
    };
}
export function createEmailAst(sections, options = {}) {
    return {
        sections,
        width: 600,
        ...options,
    };
}
