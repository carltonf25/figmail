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
  if (typo?.fontFamily) attrs.push(`font-family="${typo.fontFamily}"`);
  if (typo?.fontSize) attrs.push(`font-size="${typo.fontSize}px"`);
  if (typo?.fontWeight) attrs.push(`font-weight="${typo.fontWeight}"`);
  if (typo?.lineHeight) attrs.push(`line-height="${typo.lineHeight}"`);
  if (typo?.color) attrs.push(`color="${typo.color}"`);
  if (typo?.letterSpacing) attrs.push(`letter-spacing="${typo.letterSpacing}px"`);
  return attrs.join(" ");
}

// Enhanced block rendering with mc:edit support
function renderBlock(b: Block): string {
  if (isTextBlock(b)) {
    const editId = b.editable && (b.id || b.editRegionName) ? generateEditId(b, 'text') : null;
    const content = `<mj-text ${textStyle(b.typography)} align="${b.align}"${paddingAttrs(b.spacing)}>${b.html}</mj-text>`;
    
    if (editId) {
      return `<div mc:edit="${editId}">${content}</div>`;
    }
    return content;
  }
  
  if (isContainerBlock(b)) {
    const bgColor = b.backgroundColor ? ` background-color="${b.backgroundColor}"` : "";
    const height = b.height ? ` height="${b.height}px"` : "";
    const padding = paddingAttrs(b.spacing);
    return `<mj-wrapper${bgColor}${padding}><mj-section><mj-column><mj-spacer${height} /></mj-column></mj-section></mj-wrapper>`;
  }
  
  if (isImageBlock(b)) {
    const border = b.border?.width
      ? ` border="${b.border.width}px solid ${b.border.color ?? "#000000"}"`
      : "";
    const width = b.width ? ` width="${b.width}px"` : "";
    const href = b.href ? ` href="${b.href}"` : "";
    return `<mj-image${width} align="${b.align}"${paddingAttrs(b.spacing)}${border} alt="${b.alt ?? ""}" src="${b.src || ""}"${href} />`;
  }
  
  if (isButtonBlock(b)) {
    const editId = b.editable && (b.id || b.editRegionName) ? generateEditId(b, 'button') : null;
    const radius = b.border?.radius ? ` border-radius="${b.border.radius}px"` : "";
    const border = b.border?.width
      ? ` border="${b.border.width}px solid ${b.border.color ?? b.backgroundColor}"`
      : "";
    const content = `<mj-button href="${b.href}" align="${b.align}" background-color="${b.backgroundColor}" color="${b.color}" ${textStyle(b.typography)}${radius}${border}${paddingAttrs(b.spacing)}>${b.text}</mj-button>`;
    
    if (editId) {
      return `<div mc:edit="${editId}">${content}</div>`;
    }
    return content;
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
    const cols = s.columns.map((c) => {
      const width = c.widthPercent ? ` width="${c.widthPercent}%"` : "";
      const padCol = paddingAttrs(c.spacing);
      const blocks = c.blocks.map(renderBlock).join("\n");
      return `<mj-column${width}${padCol}>${blocks}</mj-column>`;
    }).join("\n");
    return `<mj-section${bg}${full}${pad}>${cols}</mj-section>`;
  }).join("\n");

  return `
<mjml>
  <mj-body width="${ast.width}"${ast.background?.color ? ` background-color="${ast.background.color}"` : ""}>
    ${sections}
  </mj-body>
</mjml>
`.trim();
}