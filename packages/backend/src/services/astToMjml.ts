import { EmailAst, Block } from "@figmc/shared";

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

function renderBlock(b: Block): string {
  switch (b.type) {
    case "text":
      return `<mj-text ${textStyle(b.typography)} align="${b.align}"${paddingAttrs(b.spacing)}>${b.html}</mj-text>`;
    case "container": {
      const bgColor = (b as any).backgroundColor ? ` background-color="${(b as any).backgroundColor}"` : "";
      const height = (b as any).height ? ` height="${(b as any).height}px"` : "";
      const padding = paddingAttrs(b.spacing);
      // Create a wrapper with background color
      return `<mj-wrapper${bgColor}${padding}><mj-section><mj-column><mj-spacer${height} /></mj-column></mj-section></mj-wrapper>`;
    }
    case "image": {
      const border =
        b.border?.width
          ? ` border="${b.border.width}px solid ${b.border.color ?? "#000000"}"`
          : "";
      const width = b.width ? ` width="${b.width}px"` : "";
      const href = b.href ? ` href="${b.href}"` : "";
      return `<mj-image${width} align="${b.align}"${paddingAttrs(b.spacing)}${border} alt="${b.alt ?? ""}" src="${(b as any).src || ""}"${href} />`;
    }
    case "button": {
      const radius = b.border?.radius ? ` border-radius="${b.border.radius}px"` : "";
      const border =
        b.border?.width
          ? ` border="${b.border.width}px solid ${b.border.color ?? b.backgroundColor}"`
          : "";
      return `<mj-button href="${b.href}" align="${b.align}" background-color="${b.backgroundColor}" color="${b.color}" ${textStyle(b.typography)}${radius}${border}${paddingAttrs(b.spacing)}>${b.text}</mj-button>`;
    }
    case "divider":
      return `<mj-divider border-color="${b.color}" border-width="${b.thickness}px"${paddingAttrs(b.spacing)} />`;
    case "spacer":
      return `<mj-spacer height="${b.height}px" />`;
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
