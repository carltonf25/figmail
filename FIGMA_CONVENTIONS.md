# Figma → Mailchimp Plugin: Design Conventions

This document outlines the design conventions and best practices for creating email designs in Figma that will translate correctly to HTML emails.

## 🎯 **Core Structure**

### **Main Email Frame**
- **Name**: Any descriptive name
- **Type**: Frame (top-level)
- **Width**: Recommended 600-700px (will be clamped to 320-700px)
- **Purpose**: Represents the entire email document

### **Sections (Optional)**
- **Type**: Child frames within the main frame
- **Layout**: 
  - **Vertical stack**: Multiple sections
  - **Horizontal layout**: Multi-column sections
- **Naming**: 
  - `Email/SectionFull` → Full-width section
  - Any other name → Standard width section

---

## 🔗 **Link Handling (NEW)**

### **Text Links**
- **How to create**: 
  1. Select text in Figma
  2. Right-click → "Add link" (or Cmd+K)
  3. Enter the URL
- **Result**: Text will become clickable `<a>` tags in email
- **Styling**: Links inherit text color and get underline styling

### **Button Links**
- **Naming convention**: Include `Email/Button` in the frame name
- **Structure**: Frame containing text layer
- **Link storage**: Set `href` in plugin data (or we'll add UI for this)
- **Styling**: Uses frame background color and corner radius

---

## 🖼️ **Images & Graphics**

### **Standard Images**
- **Types**: Rectangle or Frame
- **Naming**: Include `Email/Image` to force image treatment
- **Export**: Automatically exported as PNG at 2x resolution

### **Colored Background Containers (NEW)**
- **How to create**:
  1. Create a rectangle with a background color (not white)
  2. The rectangle will become a colored background section in the email
- **Result**: Colored background block in email (no image processing needed)
- **Best practice**: Use solid colors rather than gradients or images for reliable email client support

---

## 📝 **Text Elements**

### **Regular Text**
- **Type**: Text layers
- **Styling**: Font family, size, color, alignment are preserved
- **Line breaks**: Use Shift+Enter for `<br>` tags
- **Hyperlinks**: Use Figma's native link feature

### **Rich Text**
- **Support**: Basic formatting (bold, italic, color changes)
- **Links**: Per-text-segment linking supported

---

## 🎨 **Special Elements**

### **Buttons**
- **Naming**: `Email/Button` (case insensitive)
- **Structure**: Frame with text layer inside
- **Styling**: Background color, corner radius, padding
- **Link**: Store URL in plugin data or use naming convention

### **Dividers**
- **Naming**: `Email/Divider` (case insensitive)
- **Result**: Horizontal line (`<hr>` equivalent)
- **Color**: Uses default gray (#E0E0E0)

### **Spacers**
- **Naming**: `Email/Spacer` (case insensitive)
- **Height**: Uses element height for spacing
- **Purpose**: Vertical spacing between elements

---

## 📐 **Layout Best Practices**

### ✅ **DO:**
- Use frames for containers and sections
- Place text **inside** rectangles for overlay effects
- Use horizontal layout for multi-column designs
- Name elements descriptively
- Test with realistic content lengths
- Use consistent spacing and alignment

### ❌ **DON'T:**
- Overlap elements unless intentionally creating overlays
- Use complex nested structures unnecessarily
- Rely on absolute positioning
- Create extremely narrow or wide layouts
- Use unsupported Figma features (effects, complex masks)

---

## 🔧 **Advanced Features**

### **Spatial Layout Detection (NEW)**
The plugin now detects when text is placed within rectangles/frames and automatically creates proper overlays instead of placing elements sequentially.

### **Hyperlink Detection (NEW)**
- Figma native links in text are preserved
- Both segment-level and text-level linking supported
- Links maintain text styling with added underlines

### **Smart Container Handling (NEW)**
- Rectangles with background colors become colored background sections
- White/transparent rectangles become images (if they have visual content)
- Frames with children become layout containers
- Standalone elements remain as individual blocks

---

## 🚀 **Tips for Best Results**

1. **Preview Early**: Test your design with the plugin frequently
2. **Use Web Fonts**: Stick to web-safe fonts or specify fallbacks
3. **Consider Email Clients**: Some features may not work in all email clients
4. **Test Responsiveness**: Keep mobile viewing in mind
5. **Optimize Images**: Use appropriate image sizes for email

---

## 🐛 **Troubleshooting**

### **Links Not Working?**
- Ensure you used Figma's native link feature (Cmd+K)
- Check that the URL is valid and complete

### **Text Not Overlaying Image?**
- Verify text is spatially within the rectangle bounds
- Check that the rectangle is behind the text in layer order

### **Layout Issues?**
- Use frames for containers, not groups
- Ensure proper nesting structure
- Check element naming conventions

---

*For technical support or feature requests, check the plugin documentation or GitHub repository.*
