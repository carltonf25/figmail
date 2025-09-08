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

// Enhanced Block types with Mailchimp Template Language support
const TextBlock = z.object({
  type: z.literal("text"),
  id: z.string().optional(), // Unique identifier for mc:edit regions
  html: z.string(), // HTML content (supports merge tags)
  typography: Typography,
  align: Alignment.default("left"),
  spacing: Spacing,
  editable: z.boolean().default(true), // Whether this text should be editable in Mailchimp
  editRegionName: z.string().optional(), // Descriptive name for the editable region
});

const ContainerBlock = z.object({
  type: z.literal("container"),
  backgroundColor: Color.optional(),
  width: PositiveNumber.optional(),
  height: PositiveNumber.optional(),
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
  id: z.string().optional(), // Unique identifier for mc:edit regions
  text: z.string(),
  href: z.string().url(),
  backgroundColor: Color.default("#007bff"),
  color: Color.default("#ffffff"),
  typography: Typography,
  align: Alignment.default("center"),
  spacing: Spacing,
  border: Border,
  editable: z.boolean().default(true), // Whether button text should be editable
  editRegionName: z.string().optional(), // Descriptive name for the editable region
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

// Union type for all blocks - optimized for Zod v4
export const Block = z.discriminatedUnion("type", [
  TextBlock,
  ContainerBlock,
  ImageBlock,
  ButtonBlock,
  DividerBlock,
  SpacerBlock,
] as const); // 'as const' for better type inference

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

// Type exports - optimized for Zod v4
export type EmailAst = z.infer<typeof EmailAst>;
export type Block = z.infer<typeof Block>;
export type TextBlock = z.infer<typeof TextBlock>;
export type ContainerBlock = z.infer<typeof ContainerBlock>;
export type ImageBlock = z.infer<typeof ImageBlock>;
export type ButtonBlock = z.infer<typeof ButtonBlock>;
export type DividerBlock = z.infer<typeof DividerBlock>;
export type SpacerBlock = z.infer<typeof SpacerBlock>;
export type Column = z.infer<typeof Column>;
export type Section = z.infer<typeof Section>;
export type Typography = z.infer<typeof Typography>;
export type Spacing = z.infer<typeof Spacing>;
export type Border = z.infer<typeof Border>;
export type Background = z.infer<typeof Background>;

// Schema validation functions - enhanced for Zod v4
export function parseEmailAst(data: unknown): EmailAst {
  return EmailAst.parse(data);
}

export function safeParseEmailAst(data: unknown): { success: true; data: EmailAst } | { success: false; error: z.ZodError } {
  return EmailAst.safeParse(data);
}

export function isValidEmailAst(data: unknown): data is EmailAst {
  return EmailAst.safeParse(data).success;
}

// Block type guards for better type safety
export function isTextBlock(block: Block): block is TextBlock {
  return block.type === "text";
}

export function isContainerBlock(block: Block): block is ContainerBlock {
  return block.type === "container";
}

export function isImageBlock(block: Block): block is ImageBlock {
  return block.type === "image";
}

export function isButtonBlock(block: Block): block is ButtonBlock {
  return block.type === "button";
}

// Utility function to generate safe mc:edit identifiers
export function generateEditId(block: { id?: string; editRegionName?: string }, fallback: string): string {
  if (block.id) return `edit_${block.id}`;
  if (block.editRegionName) {
    // Convert to safe identifier: "Header Title" -> "header_title"
    return block.editRegionName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
  }
  return `${fallback}_${Math.random().toString(36).substr(2, 6)}`;
}

// Helper functions for common AST operations - enhanced for mc:edit
export function createTextBlock(
  html: string,
  options: Partial<Omit<TextBlock, "type" | "html">> = {}
): TextBlock {
  return TextBlock.parse({
    type: "text" as const,
    html,
    align: "left" as const,
    editable: true,
    ...options,
  });
}

export function createImageBlock(
  key: string,
  options: Partial<Omit<ImageBlock, "type" | "key">> = {}
): ImageBlock {
  return ImageBlock.parse({
    type: "image" as const,
    key,
    align: "center" as const,
    ...options,
  });
}

export function createButtonBlock(
  text: string,
  href: string,
  options: Partial<Omit<ButtonBlock, "type" | "text" | "href">> = {}
): ButtonBlock {
  return ButtonBlock.parse({
    type: "button" as const,
    text,
    href,
    backgroundColor: "#007bff" as const,
    color: "#ffffff" as const,
    align: "center" as const,
    editable: true,
    ...options,
  });
}

export function createColumn(
  blocks: Block[],
  options: Partial<Omit<Column, "blocks">> = {}
): Column {
  return Column.parse({
    blocks,
    ...options,
  });
}

export function createSection(
  columns: Column[],
  options: Partial<Omit<Section, "columns">> = {}
): Section {
  return Section.parse({
    columns,
    fullWidth: false,
    ...options,
  });
}

export function createEmailAst(
  sections: Section[],
  options: Partial<Omit<EmailAst, "sections">> = {}
): EmailAst {
  return EmailAst.parse({
    sections,
    width: 600,
    ...options,
  });
}