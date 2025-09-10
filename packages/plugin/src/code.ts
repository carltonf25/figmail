import type { EmailAst, Section, Column, Block } from "@figmc/shared";

figma.showUI(__html__, { width: 380, height: 580 });

const BACKEND = "http://localhost:4000";

// Generate editable region name from Figma layer name
function generateEditRegionName(nodeName: string): { editRegionName?: string; editable: boolean } {
  // Check if editing is disabled
  if (nodeName.includes("/NoEdit")) {
    return { editable: false };
  }

  // Extract region name from Email/ prefix
  if (nodeName.startsWith("Email/")) {
    const regionName = nodeName
      .replace(/^Email\//, "")
      .replace(/\/NoEdit$/, "")
      .replace(/[^a-zA-Z0-9\s]/g, " ")
      .trim();

    if (regionName) {
      return { editRegionName: regionName, editable: true };
    }
  }

  // Use cleaned node name as fallback
  const cleanName = nodeName.replace(/[^a-zA-Z0-9\s]/g, " ").trim();
  return {
    editRegionName: cleanName || "Content",
    editable: true
  };
}

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
      figma.ui.postMessage({ type: "PROGRESS", step: "Opening Mailchimp OAuth..." });

      // Open OAuth URL in user's default browser
      const oauthUrl = `${BACKEND}/auth/mailchimp/start`;

      try {
        // For Figma plugin, we'll show instructions to user
        figma.notify("Opening Mailchimp authorization in your browser...", { timeout: 3000 });

        // Show user-friendly message with next steps
        const message = `
🎯 Mailchimp Authorization Required

1. Click the link that opens in your browser
2. Sign in to your Mailchimp account
3. Grant permission for FigChimp to access your templates and campaigns
4. You'll be redirected back and can continue using the plugin

The authorization page should open automatically.
        `.trim();

        // Since we can't directly open URLs in Figma plugins, show clear instructions
        figma.ui.postMessage({
          type: "OAUTH_REQUIRED",
          url: oauthUrl,
          message: message
        });

        figma.ui.postMessage({ type: "DONE" });

      } catch (error) {
        console.error("OAuth initiation error:", error);
        figma.ui.postMessage({
          type: "ERROR",
          message: "Failed to initiate Mailchimp authorization. Please try again."
        });
      }
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
      const response = await fetch(`${BACKEND}/compile-and-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ast,
          images,
          templateName: msg.templateName,
          subject: msg.subject,
          preheader: msg.preheader,
          createCampaign: msg.createCampaign,
          listId: msg.listId,
          replyTo: msg.replyTo
        })
      });

      if (!response.ok) {
        try {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} ${response.statusText}\n${errorText || 'No error details'}`);
        } catch (textError) {
          console.error("Failed to read error response:", textError);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      // Try to parse as JSON, fallback to text if it fails
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.log("JSON parsing failed, trying text response:", jsonError);
        try {
          // If JSON parsing fails, the response might be HTML/text (like error pages)
          const textContent = await response.text();
          console.log("Got text content:", textContent?.substring(0, 100));
          if (response.ok) {
            // If response is OK but not JSON, treat as success
            result = { success: true, message: "Operation completed successfully", content: textContent };
          } else {
            // If response is not OK and not JSON, it's likely an error
            const errorMsg = `Server returned non-JSON response: ${textContent || 'No content'}`;
            console.error("Response error:", errorMsg);
            throw new Error(errorMsg);
          }
        } catch (textError) {
          console.error("Failed to read response as text:", textError);
          throw new Error("Failed to read server response");
        }
      }
      figma.ui.postMessage({ type: "DONE", result });
    }

    if (msg.type === "DOWNLOAD_HTML") {
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
      console.log("Starting buildAstAndImages for download:", selection.name);
      const { ast, images } = await buildAstAndImages(selection);
      console.log("buildAstAndImages completed for download, AST:", ast);

      figma.ui.postMessage({ type: "PROGRESS", step: "Compiling HTML..." });
      const response = await fetch(`${BACKEND}/compile-and-download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ast,
          images,
          templateName: msg.templateName,
          subject: msg.subject,
          preheader: msg.preheader
        })
      });

      if (!response.ok) {
        try {
          const errorText = await response.text();
          throw new Error(`Server error: ${response.status} ${response.statusText}\n${errorText || 'No error details'}`);
        } catch (textError) {
          console.error("Failed to read error response:", textError);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      // Get the HTML content as text instead of blob
      console.log("Response received, getting text content...");
      const htmlContent = await response.text();
      console.log("HTML content received, length:", htmlContent.length);

      // Send the HTML content directly to the UI for download
      console.log("Sending download ready message to UI");
      figma.ui.postMessage({
        type: "DOWNLOAD_READY",
        htmlContent: htmlContent,
        filename: msg.templateName ? `${msg.templateName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.html` : "figma-template.html"
      });

      figma.ui.postMessage({ type: "DONE" });
      console.log("Download HTML completed successfully");
    }
  } catch (e) {
    console.error("Plugin error:", e);
    figma.ui.postMessage({ type: "ERROR", message: e.message || e.toString() });
  }
};

async function buildAstAndImages(frame: FrameNode): Promise<{ ast: EmailAst, images: Record<string, string> }> {
  console.log("buildAstAndImages called with frame:", frame.name, "type:", frame.type);

  const ast: EmailAst = {
    name: frame.name,
    width: Math.min(Math.max(frame.width, 320), 700), // Clamp to 320-700px
    background: { color: toHex((frame as any).fills) ?? "#FFFFFF" },
    sections: []
  };

  const images: Record<string, string> = {};

  const sectionNodes = frame.children.filter((n): n is FrameNode => n.type === "FRAME").reverse();

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

    // Process all children of the main frame as blocks (reverse order for correct visual stacking)
    for (const child of frame.children.slice().reverse()) {
      const block = await toBlock(child as SceneNode, images);
      if (block) col.blocks.push(block);
    }

    section.columns.push(col);
    ast.sections.push(section);
  } else {
    // Process each child frame as a section
    for (const sectionNode of sectionNodes) {
      const section: Section = {
        id: sectionNode.id,
        name: sectionNode.name || "Section",
        type: "section",
        background: { color: toHex((sectionNode as any).fills) ?? undefined },
        spacing: paddingFrom(sectionNode),
        fullWidth: /Email\/SectionFull/i.test(sectionNode.name),
        columns: []
      };

      // Check if this section contains column frames (multi-column layout)
      const columnFrames = sectionNode.children.filter((n): n is FrameNode => n.type === "FRAME" && n.name.startsWith("Email/Column"));
      const nonColumnChildren = sectionNode.children.filter((n) => !(n.type === "FRAME" && n.name.startsWith("Email/Column")));

      if (columnFrames.length > 0) {
        // Multi-column layout: process each column frame
        const columnsWithWidths: Array<{ frame: FrameNode; widthPercent?: number }> = [];

        // First pass: parse widths from frame names
        for (const columnFrame of columnFrames.slice().reverse()) {
          const widthPercent = parseColumnWidth(columnFrame.name, sectionNode.width);
          columnsWithWidths.push({ frame: columnFrame, widthPercent });
        }

        // Second pass: assign widths to columns without explicit widths
        const totalExplicitWidth = columnsWithWidths.reduce((sum, col) => sum + (col.widthPercent || 0), 0);
        const remainingColumns = columnsWithWidths.filter(col => !col.widthPercent);
        const remainingWidth = 100 - totalExplicitWidth;
        const evenWidth = remainingColumns.length > 0 ? Math.floor(remainingWidth / remainingColumns.length) : 0;

        // Assign even widths to remaining columns
        remainingColumns.forEach((col, index) => {
          col.widthPercent = evenWidth;
          // Add any remainder to the last column
          if (index === remainingColumns.length - 1) {
            col.widthPercent = remainingWidth - (evenWidth * (remainingColumns.length - 1));
          }
        });

        // Process each column
        for (const { frame: columnFrame, widthPercent } of columnsWithWidths) {
          const col: Column = {
            id: columnFrame.id,
            name: columnFrame.name || "Column",
            type: "column",
            widthPercent: widthPercent,
            spacing: paddingFrom(columnFrame),
            blocks: []
          };

          // Process all children of this column as blocks (reverse order for correct visual stacking)
          for (const child of columnFrame.children.slice().reverse()) {
            const block = await toBlock(child as SceneNode, images);
            if (block) col.blocks.push(block);
          }

          section.columns.push(col);
        }
      } else {
        // Single column layout: process all children as blocks in one column
        const col: Column = {
          id: sectionNode.id + "-col",
          name: "Column",
          type: "column",
          widthPercent: undefined,
          spacing: paddingFrom(sectionNode as any),
          blocks: []
        };

        // Process all children of this section as blocks (reverse order for correct visual stacking)
        for (const child of sectionNode.children.slice().reverse()) {
          const block = await toBlock(child as SceneNode, images);
          if (block) col.blocks.push(block);
        }

        section.columns.push(col);
      }

      ast.sections.push(section);
    }
  }

  return { ast, images };
}

// Parse column width from frame name (e.g., "Email/Column/50%" or "Email/Column/Left")
function parseColumnWidth(columnName: string, sectionWidth: number): number | undefined {
  // Look for percentage in the name (e.g., "Email/Column/50%")
  const percentMatch = columnName.match(/(\d+)%/);
  if (percentMatch) {
    const percent = parseInt(percentMatch[1]);
    return Math.min(Math.max(percent, 1), 100); // Clamp between 1-100
  }

  // Look for common column patterns
  const name = columnName.toLowerCase();
  if (name.includes('left') && name.includes('right')) {
    return 50; // Two-column layout
  }
  if (name.includes('left')) {
    return 33; // Left column in 3-column layout
  }
  if (name.includes('center') || name.includes('middle')) {
    return 34; // Center column in 3-column layout
  }
  if (name.includes('right')) {
    return 33; // Right column in 3-column layout
  }

  // Return undefined for automatic width distribution
  return undefined;
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
        let segmentText = seg.characters.replace(/\n/g, "<br/>");

        // Check for hyperlinks in text segments
        if (seg.hyperlink && seg.hyperlink.type === "URL") {
          segmentText = `<a href="${seg.hyperlink.value}" style="color: inherit; text-decoration: underline;">${segmentText}</a>`;
        }

        return segmentText;
      }).join("");
      console.log("Converted to HTML:", html);
    } catch (segError) {
      console.error("Error in segments processing:", segError);
      // Fallback to simple text extraction
      html = (node as TextNode).characters || "";

      // Check for hyperlinks in the node itself as fallback
      try {
        const textNode = node as TextNode;
        if (textNode.hyperlink && textNode.hyperlink.type === "URL") {
          html = `<a href="${textNode.hyperlink.value}" style="color: inherit; text-decoration: underline;">${html}</a>`;
        }
      } catch (linkError) {
        console.log("No hyperlink data available");
      }
    }

    // Generate mc:edit properties
    const { editRegionName, editable } = generateEditRegionName((node as any).name || "");

    return {
      id: node.id,
      name: (node as any).name,
      type: "text",
      html,
      typography: {
        fontFamily: fontFamily(node as any),
        fontSize: Number((node as any).fontSize) || 16,
        color: toHex(((node as any).fills) as any) || "#000000",
        lineHeight: typeof (node as any).lineHeight === "number" ? (node as any).lineHeight : 1.4
      },
      align: ((node as any).textAlignHorizontal && (node as any).textAlignHorizontal.toLowerCase()) || "left",
      spacing: paddingFrom(node as any),
      // Mailchimp Template Language support
      editable,
      editRegionName,
    };
  }

  if (node.type === "FRAME" && /Email\/Button/i.test(nm)) {
    console.log("Processing BUTTON node:", node.id, "name:", nm);

    // Find text child for button text
    const textChild = node.children.find((c): c is TextNode => c.type === "TEXT");
    const btnText = textChild ? textChild.characters : "Button";

    // Find href from text hyperlink or use default
    let btnHref = "#";
    if (textChild && textChild.hyperlink && textChild.hyperlink.type === "URL") {
      btnHref = textChild.hyperlink.value;
    }

    // Extract colors from frame fills
    const bgColor = toHex((node as any).fills) || "#007bff";
    const textColor = textChild ? (toHex((textChild as any).fills) || "#ffffff") : "#ffffff";

    // Extract corner radius
    const cornerRadius = (node as any).cornerRadius || 0;

    // Generate mc:edit properties for button
    const { editRegionName, editable } = generateEditRegionName(nm);

    return {
      id: node.id,
      name: nm,
      type: "button",
      text: btnText,
      href: btnHref,
      backgroundColor: bgColor,
      color: textColor,
      typography: {
        fontFamily: textChild ? fontFamily(textChild as any) : undefined,
        fontSize: textChild ? Number((textChild as any).fontSize) || 16 : 16,
        color: textColor,
        lineHeight: textChild && typeof (textChild as any).lineHeight === "number" ? (textChild as any).lineHeight : 1.4
      },
      align: "center",
      border: { radius: cornerRadius },
      spacing: paddingFrom(node as any),
      // Mailchimp Template Language support
      editable,
      editRegionName,
    };
  }

  if (node.type === "RECTANGLE") {
    // Check if this rectangle should be a background container or an image
    const backgroundColor = toHex(((node as any).fills) as any);

    if (backgroundColor && backgroundColor !== "#FFFFFF") {
      // Rectangle with color - create a container block
      return {
        id: node.id,
        name: (node as any).name,
        type: "container",
        backgroundColor,
        width: Math.round((node as LayoutMixin).width),
        height: Math.round((node as LayoutMixin).height),
        spacing: paddingFrom(node as any)
      };
    } else {
      // Rectangle without color - treat as image
      const bytes = await (node as GeometryMixin).exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });
      const key = node.id;
      images[key] = `data:image/png;base64,${figma.base64Encode(bytes)}`;
      return {
        id: node.id,
        name: (node as any).name,
        type: "image",
        key,
        alt: (node as any).name ?? "",
        width: Math.round(((node as LayoutMixin).width)),
        align: "center",
        border: {},
        spacing: paddingFrom(node as any)
      };
    }
  }

  if (node.type === "FRAME" && /Email\/Image/i.test(nm)) {
    const bytes = await (node as GeometryMixin).exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 2 } });
    const key = node.id;
    images[key] = `data:image/png;base64,${figma.base64Encode(bytes)}`;
    return {
      id: node.id,
      name: (node as any).name,
      type: "image",
      key,
      alt: (node as any).name ?? "",
      width: Math.round(((node as LayoutMixin).width)),
      align: "center",
      border: {},
      spacing: paddingFrom(node as any)
    };
  }

  if (node.type === "LINE" || /Email\/Divider/i.test(nm)) {
    return {
      id: node.id,
      name: (node as any).name,
      type: "divider",
      color: toHex(((node as any).fills) as any) || "#dddddd",
      thickness: (node as any).strokeWeight || 1,
      spacing: paddingFrom(node as any)
    };
  }

  if (node.type === "FRAME" && /Email\/Spacer/i.test(nm)) {
    return {
      id: node.id,
      name: (node as any).name,
      type: "spacer",
      height: Math.round((node as LayoutMixin).height)
    };
  }

  console.log("Skipping unsupported node type:", node.type, "name:", nm);
  return null;
}

function fontFamily(node: any): string | undefined {
  if (node.fontName && typeof node.fontName === "object") {
    return node.fontName.family;
  }
  return undefined;
}

function toHex(fills: any): string | undefined {
  if (!fills || !Array.isArray(fills) || fills.length === 0) return undefined;
  const fill = fills[0];
  if (fill.type === "SOLID" && fill.color) {
    const { r, g, b } = fill.color;
    const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return undefined;
}

function paddingFrom(node: any): any {
  return {
    paddingTop: node.paddingTop || 0,
    paddingRight: node.paddingRight || 0,
    paddingBottom: node.paddingBottom || 0,
    paddingLeft: node.paddingLeft || 0,
  };
}