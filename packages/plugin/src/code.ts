import type { EmailAst, Section, Column, Block } from "@figmc/shared";

figma.showUI(__html__, { width: 380, height: 580 });

const BACKEND = (figma.root.getPluginData("backendUrl") || "http://localhost:4000").toString().trim();

// Send initial selection status
function updateSelectionStatus() {
  const selection = figma.currentPage.selection[0];
  if (!selection) {
    figma.ui.postMessage({ type: "SELECTION_UPDATE", hasValidFrame: false, message: "No selection" });
  } else if (selection.type !== "FRAME") {
    figma.ui.postMessage({ type: "SELECTION_UPDATE", hasValidFrame: false, message: `Selected: ${selection.type.toLowerCase()}` });
  } else {
    figma.ui.postMessage({ type: "SELECTION_UPDATE", hasValidFrame: true, message: `Selected Frame: "${selection.name}"` });
  }
}

// Update selection status when selection changes
figma.on("selectionchange", updateSelectionStatus);

// Send initial status
updateSelectionStatus();

figma.ui.onmessage = async (msg) => {
  try {
    if (msg.type === "CONNECT") {
      figma.ui.postMessage({ type: "PROGRESS", step: "Opening OAuth..." });
      // MVP: instruct user to set .env on server; real flow would open auth URL
      figma.notify("Using server-side MC_ACCESS_TOKEN/MC_DC for now.");
      figma.ui.postMessage({ type: "DONE" });
    }

    if (msg.type === "PUSH") {
      const selection = figma.currentPage.selection[0];
      if (!selection) {
        figma.ui.postMessage({ type: "ERROR", message: "Please select a Frame in Figma first. Click on the email design frame you want to export." });
        return;
      }
      if (selection.type !== "FRAME") {
        figma.ui.postMessage({ type: "ERROR", message: "Please select a Frame (not " + selection.type.toLowerCase() + "). Click on the main email design frame you want to export." });
        return;
      }
      figma.ui.postMessage({ type: "PROGRESS", step: "Analyzing frame..." });
      console.log("Starting buildAstAndImages for frame:", selection.name);
      const { ast, images } = await buildAstAndImages(selection);
      console.log("buildAstAndImages completed, AST:", ast);

      figma.ui.postMessage({ type: "PROGRESS", step: "Compiling & pushing..." });
      const resp = await fetch(`${BACKEND}/compile-and-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ast, images, options: {
          subject: msg.subject, preheader: msg.preheader,
          templateName: msg.templateName, createCampaign: msg.createCampaign,
          listId: msg.listId
        } })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error((data && data.message) || "Compile & push failed");

      figma.ui.postMessage({ type: "DONE", data });
      figma.notify("Pushed to Mailchimp.");
      console.log("Template ID:", data.templateId, "Campaign ID:", data.campaignId);
      console.log("HTML:", data.html);
    }
  } catch (e: any) {
    console.error("Plugin error:", e);
    figma.ui.postMessage({ type: "ERROR", message: e.message || e.toString() });
  }
};

async function buildAstAndImages(frame: FrameNode): Promise<{ ast: EmailAst, images: Record<string, string> }> {
  const width = Math.round(frame.width);
  const ast: EmailAst = {
    id: frame.id,
    name: frame.name,
    type: "document",
    width: Math.min(700, Math.max(320, width)),
    background: { color: toHex((frame as any).fills) ?? "#FFFFFF" },
    sections: []
  };

  const images: Record<string, string> = {};

  const sectionNodes = frame.children.filter((n): n is FrameNode => n.type === "FRAME");
  
  // If no child frames found, treat the main frame as a single section
  if (sectionNodes.length === 0) {
    const section: Section = {
      id: frame.id,
      name: frame.name || "Main Section",
      type: "section",
      background: { color: toHex((frame as any).fills) ?? undefined },
      spacing: paddingFrom(frame),
      fullWidth: false,
      columns: []
    };

    // Create a single column containing all direct children
    const col: Column = {
      id: frame.id + "-col",
      name: "Main Column", 
      type: "column",
      widthPercent: undefined,
      spacing: paddingFrom(frame as any),
      blocks: []
    };

    // Process all children of the main frame as blocks
    for (const child of frame.children) {
      const block = await toBlock(child as SceneNode, images);
      if (block) col.blocks.push(block);
    }

    section.columns.push(col);
    ast.sections.push(section);
  } else {
    // Process child frames as sections (original logic)
    for (const sn of sectionNodes) {
      const section: Section = {
        id: sn.id,
        name: sn.name,
        type: "section",
        background: { color: toHex((sn as any).fills) ?? undefined },
        spacing: paddingFrom(sn),
        fullWidth: /Email\/SectionFull/i.test(sn.name ?? ""),
        columns: []
      };

      const isRow = (sn.layoutMode === "HORIZONTAL");
      const colNodes = isRow ? sn.children : [sn];
      const numCols = colNodes.length;

      for (const cn of colNodes) {
        const col: Column = {
          id: cn.id,
          name: cn.name,
          type: "column",
          widthPercent: isRow ? Math.round(100 / numCols) : undefined,
          spacing: paddingFrom(cn as any),
          blocks: []
        };

        const blockNodes = (cn as any).children ? (cn as any).children : [cn];
        for (const bn of blockNodes) {
          const block = await toBlock(bn as SceneNode, images);
          if (block) col.blocks.push(block);
        }

        section.columns.push(col);
      }
      ast.sections.push(section);
    }
  }

  return { ast, images };
}

async function toBlock(node: SceneNode, images: Record<string, string>): Promise<Block | null> {
  const nm = (node as any).name ?? "";
  if (node.type === "TEXT") {
    console.log("Processing TEXT node:", node.id, "name:", (node as any).name);
    console.log("getStyledTextSegments function exists:", typeof (node as TextNode).getStyledTextSegments);
    
    let html = "";
    try {
      console.log("About to call getStyledTextSegments...");
      const segments = await (node as TextNode).getStyledTextSegments(["fontName", "fontSize", "fills", "textDecoration", "fontWeight"]);
      console.log("Got segments:", segments, "type:", typeof segments, "isArray:", Array.isArray(segments));
      
      console.log("About to call map with segToHtml:", typeof segToHtml);
      console.log("segments.map exists:", typeof segments.map);
      html = segments.map((seg: any) => {
        console.log("Processing segment:", seg);
        return seg.characters.replace(/\n/g, "<br/>");
      }).join("");
      console.log("Converted to HTML:", html);
    } catch (segError) {
      console.error("Error in segments processing:", segError);
      // Fallback to simple text extraction
      html = (node as TextNode).characters || "";
    }
    return {
      id: node.id, name: (node as any).name, type: "text", html,
      typography: {
        fontFamily: fontFamily(node as any),
        fontSize: Number((node as any).fontSize) || 16,
        color: toHex(((node as any).fills) as any) || "#000000",
        lineHeight: typeof (node as any).lineHeight === "number" ? (node as any).lineHeight : 1.4
      },
      align: ((node as any).textAlignHorizontal && (node as any).textAlignHorizontal.toLowerCase()) || "left"
    };
  }

  if (/Email\/Button/i.test(nm) && node.type === "FRAME") {
    const textLayer = (node as FrameNode).findOne(n => n.type === "TEXT") as TextNode | null;
    const label = textLayer ? textLayer.characters : "Button";
    const href = ((node as BaseNode).getPluginData("href") || "#").toString();
    return {
      id: node.id, name: (node as any).name, type: "button",
      text: label, href,
      backgroundColor: toHex(((node as any).fills) as any) || "#000000",
      color: "#FFFFFF",
      typography: { fontSize: 16, fontWeight: 600 },
      border: { radius: Math.round(((node as FrameNode).cornerRadius as any) || 4) },
      spacing: paddingFrom(node as any),
      align: "center"
    };
  }

  if (node.type === "RECTANGLE" || (node.type === "FRAME" && /Email\/Image/i.test(nm))) {
    const bytes = await (node as GeometryMixin).exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });
    const key = node.id;
    images[key] = `data:image/png;base64,${figma.base64Encode(bytes)}`;
    return {
      id: node.id, name: (node as any).name, type: "image",
      key, alt: (node as any).name ?? "",
      width: Math.round(((node as LayoutMixin).width)),
      align: "center",
      border: {},
      spacing: paddingFrom(node as any)
    };
  }

  if (/Email\/Divider/i.test(nm)) {
    return { id: node.id, name: (node as any).name, type: "divider", color: "#E0E0E0", thickness: 1, spacing: {} };
  }

  if (/Email\/Spacer/i.test(nm)) {
    const h = Math.round(((node as any).height || 16));
    return { id: node.id, name: (node as any).name, type: "spacer", height: h };
  }

  return null;
}

/** Helpers */
function toHex(fills: Paint[] | readonly Paint[] | undefined): string | undefined {
  const paint = Array.isArray(fills) ? (fills as any).find((p: any) => p.type === "SOLID" && p.visible !== false) as SolidPaint : undefined;
  if (!paint) return;
  const { r, g, b } = paint.color;
  const to = (v: number) => Math.round(v * 255);
  return `#${[to(r), to(g), to(b)].map(n => n.toString(16).padStart(2,"0")).join("")}`;
}
function paddingFrom(n: any) {
  const p: any = {};
  if (typeof n.paddingTop === "number") p.paddingTop = Math.round(n.paddingTop);
  if (typeof n.paddingRight === "number") p.paddingRight = Math.round(n.paddingRight);
  if (typeof n.paddingBottom === "number") p.paddingBottom = Math.round(n.paddingBottom);
  if (typeof n.paddingLeft === "number") p.paddingLeft = Math.round(n.paddingLeft);
  return p;
}
function fontFamily(n: any): string | undefined {
  try { const f = n.fontName && n.fontName.family; return typeof f === "string" ? f : undefined; } catch { return undefined; }
}
function segToHtml(seg: any) {
  return seg.characters.replace(/\n/g, "<br/>");
}
