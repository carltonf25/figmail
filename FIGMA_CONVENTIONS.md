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
- **Result**: Clickable links in the email
- **Best practice**: Use descriptive link text

### **Button Links**
- **How to create**: 
  1. Create a frame named `Email/Button/[Button Name]`
  2. Add text inside the frame
  3. Add link to the text (Cmd+K)
- **Result**: Clickable button with link
- **Best practice**: Use clear, action-oriented button text

---

## 🎨 **Element Types**

### **Text Elements**
- **Type**: Text layers
- **Styling**: Font family, size, weight, color, line height
- **Alignment**: Left, center, right
- **Result**: HTML text with preserved styling

### **Images**
- **Type**: Rectangles or frames named `Email/Image/[Name]`
- **Format**: PNG export at 2x scale
- **Result**: Optimized images in email
- **Best practice**: Use high-quality source images

### **Buttons**
- **Type**: Frames named `Email/Button/[Name]`
- **Content**: Text layer inside the frame
- **Styling**: Background color, text color, corner radius
- **Result**: Styled button with link functionality

### **Dividers**
- **Type**: Lines or frames named `Email/Divider`
- **Styling**: Color, thickness
- **Result**: Horizontal divider line

### **Spacers**
- **Type**: Frames named `Email/Spacer`
- **Purpose**: Add vertical spacing
- **Result**: Empty space in email

### **Colored Background Containers (NEW)**
- **How to create**:
  1. Create a rectangle with a background color (not white)
  2. The rectangle will become a colored background section in the email
- **Result**: Colored background block in email (no image processing needed)
- **Best practice**: Use solid colors rather than gradients or images for reliable email client support

### **Multi-Column Layouts (NEW)**
- **How to create**:
  1. Create a section frame (e.g., `Email/2-Column Section`)
  2. Add column frames as direct children
  3. Name columns: `Email/Column/50%`, `Email/Column/Left`, etc.
- **Column width options**:
  - Explicit: `Email/Column/50%`, `Email/Column/33%`
  - Automatic: `Email/Column/Left`, `Email/Column/Right`, `Email/Column/Center`
  - Mixed: Combine explicit percentages with automatic distribution
- **Result**: Responsive multi-column email layouts
- **Best practice**: Use explicit percentages for precise control, let system auto-distribute for flexibility

---

## 🎛️ **Mailchimp Editable Regions (NEW)**

The plugin automatically creates editable regions in Mailchimp templates, allowing content editors to modify text and button labels without redesigning in Figma.

### **Text Editing**
- **Default Behavior**: All text blocks are automatically editable in Mailchimp
- **Custom Region Names**: 
  - Layer name: `Email/Headline` → Becomes `mc:edit="headline"`
  - Layer name: `Email/Body Content` → Becomes `mc:edit="body_content"`
  - Layer name: `Email/Footer Text` → Becomes `mc:edit="footer_text"`
- **Disable Editing**: Add `/NoEdit` to layer name
  - Example: `Email/Company Logo/NoEdit` → Not editable in Mailchimp

### **Button Editing**
- **Default Behavior**: Button text is editable in Mailchimp
- **Custom Region Names**: 
  - Frame name: `Email/Button/Shop Now` → Button text becomes `mc:edit="shop_now"`
  - Frame name: `Email/Button/Learn More` → Button text becomes `mc:edit="learn_more"`
  - Frame name: `Email/Button/Get Started` → Button text becomes `mc:edit="get_started"`
- **Disable Editing**: Add `/NoEdit` to button frame name
  - Example: `Email/Button/Fixed CTA/NoEdit` → Button text not editable

### **Best Practices for Editable Regions**

#### **Naming Conventions**
- Use descriptive, unique names for each editable region
- Avoid special characters (use spaces, letters, numbers only)
- Be consistent with naming across your email designs
- Examples of good names:
  - `Email/Main Headline`
  - `Email/Product Description`
  - `Email/Call to Action`
  - `Email/Footer Disclaimer`

#### **Content Organization**
- Group related content with consistent naming patterns
- Use meaningful descriptions that content editors will understand
- Keep region names short but descriptive
- Avoid generic names like "Text 1", "Text 2"

#### **Testing Workflow**
1. Design your email in Figma with properly named layers
2. Use "Compile & Push" to create the Mailchimp template
3. In Mailchimp, create a new campaign using your template
4. Verify that all expected regions are editable
5. Test editing content to ensure it works as expected

### **Technical Details**

#### **How It Works**
- Text blocks with Figma layer names automatically become `mc:edit` regions
- Layer names are converted to safe identifiers (spaces become underscores)
- Each editable region gets a unique identifier in the HTML template
- Content editors can modify text directly in Mailchimp's campaign editor

#### **Generated HTML Structure**
```html
<!-- Text with editable region -->
<div mc:edit="headline">
  <mj-text font-size="24px" font-weight="bold">
    Your Editable Headline Here
  </mj-text>
</div>

<!-- Button with editable text -->
<div mc:edit="cta_button">
  <mj-button background-color="#007bff" href="https://example.com">
    Editable Button Text
  </mj-button>
</div>
```

#### **Content Preservation**
- Switching between templates preserves content when region names match
- Use consistent naming across template versions for seamless updates
- Mailchimp automatically maps content to regions with matching identifiers

---

## 📋 **Quick Reference**

### **Layer Naming Patterns**
```
✅ Good Examples:
- Email/Header Title
- Email/Product Name
- Email/Price Display
- Email/Button/Buy Now
- Email/Footer/Contact Info
- Email/Column/50% (two-column layout)
- Email/Column/Left (automatic width)
- Email/Column/33% (three-column layout)

❌ Avoid:
- Text Layer 1
- Button
- Content
- Untitled
- Column (missing Email/ prefix)
```

### **Editable vs Non-Editable**
```
✅ Editable (default):
- Email/Headline
- Email/Button/Shop Now
- Product Description

🔒 Non-Editable:
- Email/Company Logo/NoEdit
- Email/Legal Text/NoEdit
- Email/Button/Fixed Link/NoEdit
```

---

## 🚨 **Troubleshooting**

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

### **Editable Regions Not Working?**
- Verify layer names follow the `Email/[Name]` pattern
- Check that `/NoEdit` suffix is not accidentally added
- Ensure region names are unique and descriptive
- Test in Mailchimp's campaign editor after template creation

### **Multi-Column Layout Issues?**
- Ensure column frames are direct children of section frames
- Verify column names start with `Email/Column/`
- Check that percentage values sum to 100% when using explicit widths
- Use descriptive names (Left/Center/Right) for automatic width distribution

---

*For technical support or feature requests, check the plugin documentation or GitHub repository.*