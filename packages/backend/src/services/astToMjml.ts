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

function textStyle(typo: any) {
  const attrs: string[] = [];

  // Enhanced font family with fallbacks
  if (typo?.fontFamily) {
    const fontFamily = typo.fontFamily.includes(',') ? typo.fontFamily : `${typo.fontFamily}, Arial, sans-serif`;
    attrs.push(`font-family="${fontFamily}"`);
  } else {
    attrs.push(`font-family="Arial, sans-serif"`);
  }

  // Responsive font sizing
  if (typo?.fontSize) {
    const baseSize = parseInt(typo.fontSize);
    const responsiveSize = Math.max(14, Math.min(24, baseSize)); // Clamp between 14-24px for better readability
    attrs.push(`font-size="${responsiveSize}px"`);
  }

  if (typo?.fontWeight) {
    attrs.push(`font-weight="${typo.fontWeight}"`);
  }

  // Improved line height for better readability
  if (typo?.lineHeight) {
    const lineHeight = parseFloat(typo.lineHeight);
    attrs.push(`line-height="${Math.max(1.2, Math.min(1.8, lineHeight))}"`);
  } else {
    attrs.push(`line-height="1.5"`);
  }

  if (typo?.color) attrs.push(`color="${typo.color}"`);
  if (typo?.letterSpacing) attrs.push(`letter-spacing="${typo.letterSpacing}px"`);

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

  // Enhanced responsive CSS with mobile-first approach
  const enhancedCss = `
    <mj-style>
      /* Mobile-first responsive styles */
      @media only screen and (max-width: 480px) {
        .enhanced-container {
          border-radius: 4px !important;
          margin: 0 10px !important;
          overflow: hidden;
        }

        .enhanced-image {
          border-radius: 2px !important;
          width: 100% !important;
          max-width: 100% !important;
        }

        .enhanced-text {
          font-size: 16px !important;
          line-height: 1.4 !important;
          text-shadow: none !important;
        }

        /* Button responsiveness */
        .mj-button {
          width: 100% !important;
          padding: 12px 20px !important;
          margin: 8px 0 !important;
          font-size: 16px !important;
          border-radius: 6px !important;
        }

        /* Section spacing for mobile */
        .mj-section {
          padding: 20px 15px !important;
        }

        /* Text alignment adjustments */
        .mj-text {
          text-align: left !important;
          padding: 10px 0 !important;
        }

        /* Column stacking on mobile */
        .mj-column {
          width: 100% !important;
          padding: 0 !important;
        }

        .mj-column + .mj-column {
          margin-top: 20px !important;
        }
      }

      /* Tablet styles */
      @media only screen and (min-width: 481px) and (max-width: 768px) {
        .enhanced-container {
          border-radius: 6px;
          margin: 0 15px;
        }

        .enhanced-text {
          font-size: 18px;
          line-height: 1.5;
        }

        .mj-button {
          padding: 14px 24px;
          font-size: 16px;
        }
      }

      /* Desktop styles */
      @media only screen and (min-width: 769px) {
        .enhanced-container {
          border-radius: 8px;
          overflow: hidden;
        }

        .enhanced-image {
          border-radius: 4px;
        }

        .enhanced-text {
          text-shadow: none;
        }

        .mj-button {
          padding: 12px 20px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .mj-button:hover {
          opacity: 0.9;
        }
      }

      /* Email client specific fixes */
      [owa] .mj-button {
        border-radius: 4px !important;
      }

      /* Outlook fixes */
      @media screen and (-webkit-min-device-pixel-ratio: 0) {
        .mj-text {
          font-family: Arial, sans-serif !important;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .mj-text {
          color: #ffffff !important;
        }
      }
    </mj-style>

    <!-- Responsive attributes for MJML -->
    <mj-attributes>
      <mj-all font-family="Arial, sans-serif" />
      <mj-text font-size="16px" line-height="1.5" color="#333333" />
      <mj-section padding="20px" />
      <mj-column padding="0" />
      <mj-button font-size="14px" padding="12px 24px" border-radius="6px" />
      <mj-image padding="10px" />
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