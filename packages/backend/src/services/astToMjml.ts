import { EmailAst, Block, isTextBlock, isContainerBlock, isImageBlock, isButtonBlock, generateEditId } from "@figmc/shared";

function paddingAttrs(sp?: { paddingTop?: number; paddingRight?: number; paddingBottom?: number; paddingLeft?: number; }) {
  if (!sp) return "";
  const vals = [
    sp.paddingTop ?? 0,
    sp.paddingRight ?? 0,
    sp.paddingBottom ?? 0,
    sp.paddingLeft ?? 0,
  ];
  if (vals.every(v => v === 0)) return "";
  return ` padding="${vals.map(v => `${v}px`).join(" ")}"`;
}

// Email-safe font stacks for optimal cross-client compatibility
const EMAIL_FONT_STACKS: Record<string, string> = {
  'Arial': '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
  'Helvetica': '"Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
  'Inter': '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  'Roboto': '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  'System': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'Georgia': 'Georgia, "Times New Roman", Times, serif',
  'Times': '"Times New Roman", Times, Georgia, serif',
  'Courier': '"Courier New", Courier, "Lucida Sans Typewriter", monospace',
  'default-sans': '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  'default-serif': 'Georgia, "Times New Roman", Times, serif'
};

// Map Figma fonts to email-safe equivalents
function getEmailFontStack(figmaFont: string): string {
  if (!figmaFont) return EMAIL_FONT_STACKS['default-sans'];

  // Direct matches
  if (EMAIL_FONT_STACKS[figmaFont]) {
    return EMAIL_FONT_STACKS[figmaFont];
  }

  // Smart mapping for common font categories
  const fontLower = figmaFont.toLowerCase();

  if (fontLower.includes('inter') || fontLower.includes('system')) {
    return EMAIL_FONT_STACKS['Inter'];
  }
  if (fontLower.includes('arial') || fontLower.includes('helvetica')) {
    return EMAIL_FONT_STACKS['Arial'];
  }
  if (fontLower.includes('georgia') || fontLower.includes('times')) {
    return EMAIL_FONT_STACKS['Georgia'];
  }
  if (fontLower.includes('courier') || fontLower.includes('mono')) {
    return EMAIL_FONT_STACKS['Courier'];
  }

  // Fallback: if it's already a stack, use it; otherwise add our fallback
  if (figmaFont.includes(',')) {
    return figmaFont;
  }

  return `"${figmaFont}", ${EMAIL_FONT_STACKS['default-sans']}`;
}

function textStyle(typo: any) {
  const attrs: string[] = [];

  // Enhanced font family with email-safe stacks
  const fontStack = getEmailFontStack(typo?.fontFamily);
  attrs.push(`font-family="${fontStack}"`);

  // Precise font sizing - preserve exact sizes for pixel-perfect rendering
  if (typo?.fontSize) {
    const fontSize = parseInt(typo.fontSize);
    attrs.push(`font-size="${fontSize}px"`);
  } else {
    attrs.push(`font-size="16px"`);
  }

  // Font weight mapping for better cross-client support
  if (typo?.fontWeight) {
    let weight = typo.fontWeight;
    // Normalize font weights to email-safe values
    if (weight < 300) weight = 300;
    else if (weight < 400) weight = 300;
    else if (weight < 500) weight = 400;
    else if (weight < 600) weight = 500;
    else if (weight < 700) weight = 600;
    else if (weight < 800) weight = 700;
    else weight = 700;

    attrs.push(`font-weight="${weight}"`);
  } else {
    attrs.push(`font-weight="400"`);
  }

  // Precise line height for better typography
  if (typo?.lineHeight) {
    const lineHeight = parseFloat(typo.lineHeight);
    attrs.push(`line-height="${lineHeight}"`);
  } else {
    attrs.push(`line-height="1.4"`);
  }

  // Color with fallback
  if (typo?.color) {
    attrs.push(`color="${typo.color}"`);
  } else {
    attrs.push(`color="#333333"`);
  }

  // Letter spacing for precise typography
  if (typo?.letterSpacing) {
    attrs.push(`letter-spacing="${typo.letterSpacing}px"`);
  }

  return attrs.join(" ");
}

// Enhanced block rendering with comprehensive styling support
function renderBlock(b: Block): string {
  // Helper to add inline CSS styling for enhanced properties
  const addEnhancedStyling = (baseAttrs: string, block: any): string => {
    let attrs = baseAttrs;

    // Add border radius if available
    if (block.borderRadius) {
      attrs += ` border-radius="${block.borderRadius}"`;
    }

    // Add box shadow if available (for containers and images)
    if (block.boxShadow && block.type === 'container') {
      // For containers, we need to use a div wrapper with inline styles
      return `<mj-raw><div style="border-radius:${block.borderRadius || '0px'};box-shadow:${block.boxShadow};${block.inlineCss || ''}">${attrs}</div></mj-raw>`;
    }

    // Add inline CSS for other enhanced properties
    if (block.inlineCss) {
      attrs += ` css-class="enhanced-${block.type}"`;
      // Note: We'll need to add CSS classes to the head for full email client support
    }

    return attrs;
  };

  if (isTextBlock(b)) {
    const editId = b.editable && (b.id || b.editRegionName) ? generateEditId(b, 'text') : null;
    const editAttr = editId ? ` mc:edit="${editId}"` : '';
    let content = `<mj-text${editAttr} ${textStyle(b.typography)} align="${b.align}"${paddingAttrs(b.spacing)}>${b.html}</mj-text>`;

    return addEnhancedStyling(content, b);
  }

  if (isContainerBlock(b)) {
    const bgColor = b.backgroundColor ? ` background-color="${b.backgroundColor}"` : "";
    const height = b.height ? ` height="${b.height}px"` : "";
    const padding = paddingAttrs(b.spacing);
    let content = `<mj-wrapper${bgColor}${padding}><mj-section><mj-column><mj-spacer${height} /></mj-column></mj-section></mj-wrapper>`;

    return addEnhancedStyling(content, b);
  }

  if (isImageBlock(b)) {
    const border = b.border?.width
      ? ` border="${b.border.width}px solid ${b.border.color ?? "#000000"}"`
      : "";
    const width = b.width ? ` width="${b.width}px"` : "";
    const href = b.href ? ` href="${b.href}"` : "";
    let content = `<mj-image${width} align="${b.align}"${paddingAttrs(b.spacing)}${border} alt="${b.alt ?? ""}" src="${b.src || ""}"${href} />`;

    return addEnhancedStyling(content, b);
  }

  if (isButtonBlock(b)) {
    const editId = b.editable && (b.id || b.editRegionName) ? generateEditId(b, 'button') : null;
    const editAttr = editId ? ` mc:edit="${editId}"` : '';
    const radius = b.border?.radius || b.borderRadius ? ` border-radius="${b.border?.radius || b.borderRadius}px"` : "";
    const border = b.border?.width
      ? ` border="${b.border.width}px solid ${b.border.color ?? b.backgroundColor}"`
      : "";
    let content = `<mj-button${editAttr} href="${b.href}" align="${b.align}" background-color="${b.backgroundColor}" color="${b.color}" ${textStyle(b.typography)}${radius}${border}${paddingAttrs(b.spacing)}>${b.text}</mj-button>`;

    return addEnhancedStyling(content, b);
  }
  
  // Handle remaining block types with the discriminated union
  switch (b.type) {
    case "divider":
      return `<mj-divider border-color="${b.color}" border-width="${b.thickness}px"${paddingAttrs(b.spacing)} />`;
    case "spacer":
      return `<mj-spacer height="${b.height}px" />`;
    default: {
      // This should never happen with proper typing, but provides a safety net
      const _exhaustiveCheck: never = b;
      throw new Error(`Unhandled block type: ${JSON.stringify(_exhaustiveCheck)}`);
    }
  }
}

export function astToMjml(ast: EmailAst): string {
  const sections = ast.sections.map((s) => {
    const bg = s.background?.color ? ` background-color="${s.background.color}"` : "";
    const full = s.fullWidth ? ` full-width="full-width"` : "";
    const pad = paddingAttrs(s.spacing);

    // Add responsive padding adjustments
    const responsivePad = s.spacing ? ` padding="${Object.entries(s.spacing)
      .filter(([key, value]) => value && value > 0)
      .map(([key, value]) => `${key.replace('padding', '').toLowerCase()}:${value}px`)
      .join(' ')}"` : '';

    const cols = s.columns.map((c) => {
      const width = c.widthPercent ? ` width="${c.widthPercent}%"` : "";
      const padCol = paddingAttrs(c.spacing);
      const blocks = c.blocks.map(renderBlock).join("\n");
      return `<mj-column${width}${padCol}>${blocks}</mj-column>`;
    }).join("\n");
    return `<mj-section${bg}${full}${responsivePad || pad}>${cols}</mj-section>`;
  }).join("\n");

  // Enhanced responsive CSS with pixel-perfect typography
  const enhancedCss = `
    <mj-style>
      /* Reset and base styles for consistent rendering */
      * {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Typography improvements */
      .figmail-text {
        font-feature-settings: "kern" 1, "liga" 1;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Button enhancements */
      .figmail-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        text-decoration: none;
        border: none;
        outline: none;
        cursor: pointer;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        user-select: none;
        transition: all 0.15s ease-in-out;
      }

      .figmail-button:hover {
        opacity: 0.85;
        transform: translateY(-1px);
      }

      /* Image optimizations */
      .figmail-image {
        -ms-interpolation-mode: bicubic;
        border: 0;
        outline: none;
        text-decoration: none;
        display: block;
        max-width: 100%;
        height: auto;
      }

      /* Mobile-first responsive styles */
      @media only screen and (max-width: 480px) {
        .figmail-container {
          padding: 15px !important;
        }

        .figmail-text {
          font-size: 16px !important;
          line-height: 1.5 !important;
        }

        .figmail-heading {
          font-size: 24px !important;
          line-height: 1.3 !important;
        }

        .figmail-button {
          width: 100% !important;
          padding: 14px 20px !important;
          font-size: 16px !important;
          border-radius: 8px !important;
        }

        .figmail-image {
          width: 100% !important;
          height: auto !important;
        }

        /* Stack columns on mobile */
        .mj-column {
          width: 100% !important;
          max-width: 100% !important;
        }

        .mj-column-per-100,
        .mj-column-per-50,
        .mj-column-per-33,
        .mj-column-per-25 {
          width: 100% !important;
          max-width: 100% !important;
        }
      }

      /* Tablet optimizations */
      @media only screen and (min-width: 481px) and (max-width: 768px) {
        .figmail-text {
          font-size: 17px;
          line-height: 1.5;
        }

        .figmail-heading {
          font-size: 28px;
          line-height: 1.3;
        }

        .figmail-button {
          padding: 12px 24px;
          font-size: 15px;
        }
      }

      /* Desktop refinements */
      @media only screen and (min-width: 769px) {
        .figmail-text {
          text-rendering: optimizeLegibility;
        }

        .figmail-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }

      /* Outlook-specific fixes */
      <!--[if mso]>
      table, td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      <![endif]-->

      /* High DPI display optimizations */
      @media only screen and (-webkit-min-device-pixel-ratio: 1.25),
             only screen and (min-resolution: 1.25dppx),
             only screen and (min-resolution: 120dpi) {
        .figmail-image {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
      }

      /* Dark mode enhancements */
      @media (prefers-color-scheme: dark) {
        .figmail-text {
          color: #ffffff !important;
        }
        .figmail-container {
          background-color: #1a1a1a !important;
        }
      }

      /* Email client compatibility */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        .figmail-text, .figmail-heading, .figmail-button {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }
      }

      /* Gmail fixes */
      u + .body .figmail-text {
        color: inherit !important;
      }

      /* Apple Mail fixes */
      @media only screen and (max-device-width: 480px) {
        .figmail-button {
          min-height: 44px !important;
        }
      }
    </mj-style>

    <!-- Enhanced MJML attributes for better defaults -->
    <mj-attributes>
      <mj-all font-family='"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' />
      <mj-text font-size="16px" line-height="1.4" color="#333333" css-class="figmail-text" />
      <mj-section padding="0px" />
      <mj-column padding="0px" />
      <mj-button font-size="16px" padding="12px 24px" border-radius="8px" css-class="figmail-button" />
      <mj-image css-class="figmail-image" />
    </mj-attributes>
  `;

  return `
<mjml>
  <mj-head>
    <mj-title>${ast.name || 'Figma Email'}</mj-title>
    <mj-preview>Created with FigMail - Design emails in Figma</mj-preview>
    <mj-breakpoint width="480px" />
    ${enhancedCss}
  </mj-head>
  <mj-body width="${ast.width}"${ast.background?.color ? ` background-color="${ast.background.color}"` : ""}>
    ${sections}
  </mj-body>
</mjml>
`.trim();
}