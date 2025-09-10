# 📧 Example Figma Email Document

Here's a complete example of how to structure your Figma email designs for optimal HTML conversion. This example follows all the best practices from our Figma conventions.

## 🎯 **Complete Email Structure**

### **Main Email Frame**
```
📄 Frame: "Newsletter Template"
├── 📏 Width: 600px
├── 🎨 Background: White (#FFFFFF)
└── 📦 Contents: All email sections
```

---

## 📧 **Section 1: Header**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/Header Section"
│   ├── 📄 Frame: "Email/Logo Area"
│   │   └── 🖼️ Rectangle: "Email/Image/Company Logo"
│   ├── 📝 Text: "Email/Main Headline"
│   │   └── Content: "Welcome to Our Newsletter!"
│   └── 📝 Text: "Email/Subheadline"
│       └── Content: "Your weekly dose of amazing content"
```

### **What This Creates:**
```html
<!-- Header Section -->
<mj-section background-color="#FFFFFF" padding="20px">
  <mj-column>
    <!-- Logo Image -->
    <mj-image src="..." alt="Company Logo" />

    <!-- Editable Headline -->
    <div mc:edit="main_headline">
      <mj-text font-size="28px" font-weight="bold" align="center">
        Welcome to Our Newsletter!
      </mj-text>
    </div>

    <!-- Editable Subheadline -->
    <div mc:edit="subheadline">
      <mj-text font-size="16px" color="#666666" align="center">
        Your weekly dose of amazing content
      </mj-text>
    </div>
  </mj-column>
</mj-section>
```

---

## 📰 **Section 2: Featured Article**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/Featured Article"
│   ├── 🖼️ Rectangle: "Email/Image/Hero Image"
│   │   └── 📏 Size: 600x300px
│   ├── 📝 Text: "Email/Article Title"
│   │   └── Content: "Breaking News: Amazing Discovery!"
│   ├── 📝 Text: "Email/Article Excerpt"
│   │   └── Content: "Scientists have made an incredible breakthrough..."
│   └── 📄 Frame: "Email/Button/Read More"
│       ├── 📝 Text: "Read More"
│       │   └── 🔗 Link: https://example.com/article
│       └── 🎨 Background: Blue (#007BFF)
```

### **Figma Setup Steps:**
1. **Create the hero image:**
   - Draw a rectangle (600x300px)
   - Name it: `Email/Image/Hero Image`
   - Add your image as fill

2. **Create the article title:**
   - Add text layer
   - Name it: `Email/Article Title`
   - Style: 24px bold, center aligned

3. **Create the excerpt:**
   - Add text layer below title
   - Name it: `Email/Article Excerpt`
   - Style: 16px regular, left aligned

4. **Create the button:**
   - Create a frame (200x50px)
   - Name it: `Email/Button/Read More`
   - Add text inside: "Read More"
   - Add link to text: Cmd+K → enter URL
   - Style frame: Blue background, rounded corners

---

## 🔗 **Section 3: Content with Links**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/Content Section"
│   ├── 📝 Text: "Email/Body Text"
│   │   └── Content: "Check out our [latest blog post](https://blog.example.com) for more details."
│   ├── 📄 Frame: "Email/Button/Visit Blog"
│   │   ├── 📝 Text: "Visit Our Blog"
│   │   │   └── 🔗 Link: https://blog.example.com
│   │   └── 🎨 Background: Green (#28A745)
│   └── 📄 Frame: "Email/Button/Contact Us"
│       ├── 📝 Text: "Get in Touch"
│       │   └── 🔗 Link: mailto:hello@example.com
│       └── 🎨 Background: Orange (#FF6B35)
```

### **How to Create Text Links:**
1. **Select the text** you want to link
2. **Press Cmd+K** (or right-click → "Add link")
3. **Enter the URL** (https://example.com or mailto:email@example.com)
4. **Result**: Clickable link in the email

### **Generated HTML:**
```html
<!-- Body text with inline link -->
<div mc:edit="body_text">
  <mj-text font-size="16px" line-height="1.6">
    Check out our <a href="https://blog.example.com">latest blog post</a> for more details.
  </mj-text>
</div>

<!-- Button links -->
<div mc:edit="visit_blog">
  <mj-button background-color="#28A745" href="https://blog.example.com">
    Visit Our Blog
  </mj-button>
</div>

<div mc:edit="contact_us">
  <mj-button background-color="#FF6B35" href="mailto:hello@example.com">
    Get in Touch
  </mj-button>
</div>
```

---

## 🎨 **Section 4: Colored Background**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Rectangle: "Background Container"
│   ├── 🎨 Fill: Light Blue (#E3F2FD)
│   ├── 📏 Size: 600x200px
│   └── 📝 Text: "Email/Newsletter Signup"
│       └── Content: "Stay updated with our latest news!"
```

### **How to Create:**
1. **Draw a rectangle** (600x200px)
2. **Add solid color fill** (not white)
3. **Place text on top** of the rectangle
4. **Result**: Colored background section in email

---

## 📧 **Section 5: Footer**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/Footer Section"
│   ├── 📝 Text: "Email/Footer Text"
│   │   └── Content: "© 2024 Company Name. All rights reserved."
│   ├── 📝 Text: "Email/Unsubscribe Link"
│   │   └── Content: "Unsubscribe"
│   │   └── 🔗 Link: *|UNSUBSCRIBE|*
│   └── 📄 Frame: "Email/Social Links"
│       ├── 📝 Text: "Follow us:"
│       └── 🔗 Multiple text links for social media
```

---

## 🚀 **Complete Figma File Structure**

Here's the full hierarchy you should see in Figma:

```
📄 Newsletter Template (Frame, 600px width)
├── 📄 Email/Header Section (Frame)
│   ├── 📄 Email/Logo Area (Frame)
│   │   └── 🖼️ Email/Image/Company Logo (Rectangle)
│   ├── 📝 Email/Main Headline (Text)
│   └── 📝 Email/Subheadline (Text)
│
├── 📄 Email/Featured Article (Frame)
│   ├── 🖼️ Email/Image/Hero Image (Rectangle)
│   ├── 📝 Email/Article Title (Text)
│   ├── 📝 Email/Article Excerpt (Text)
│   └── 📄 Email/Button/Read More (Frame)
│       └── 📝 Read More (Text with link)
│
├── 📄 Email/Content Section (Frame)
│   ├── 📝 Email/Body Text (Text with inline links)
│   ├── 📄 Email/Button/Visit Blog (Frame)
│   └── 📄 Email/Button/Contact Us (Frame)
│
├── 🟦 Background Container (Rectangle, colored)
│   └── 📝 Email/Newsletter Signup (Text)
│
└── 📄 Email/Footer Section (Frame)
    ├── 📝 Email/Footer Text (Text)
    ├── 📝 Email/Unsubscribe Link (Text with link)
    └── 📄 Email/Social Links (Frame)
```

---

## 📊 **Section 6: 2-Column Layout**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/2-Column Section"
│   ├── 📄 Frame: "Email/Column/Left"
│   │   ├── 🖼️ Email/Image/Product Image (Rectangle)
│   │   └── 📝 Email/Product Title (Text)
│   └── 📄 Frame: "Email/Column/Right"
│       ├── 📝 Email/Product Description (Text)
│       └── 📄 Email/Button/Shop Now (Frame)
│           └── 📝 Shop Now (Text with link)
```

### **Figma Setup Steps:**
1. **Create section frame**: "Email/2-Column Section"
2. **Create left column**:
   - Create child frame: "Email/Column/Left"
   - Add product image: Rectangle → "Email/Image/Product Image"
   - Add title: Text → "Email/Product Title"
3. **Create right column**:
   - Create child frame: "Email/Column/Right"
   - Add description: Text → "Email/Product Description"
   - Add button: Frame → "Email/Button/Shop Now"

### **Generated HTML:**
```html
<!-- 2-Column Product Section -->
<mj-section background-color="#FFFFFF" padding="20px">
  <mj-column width="50%">
    <mj-image src="..." alt="Product Image" />
    <div mc:edit="product_title">
      <mj-text font-size="24px" font-weight="bold">Amazing Product</mj-text>
    </div>
  </mj-column>
  <mj-column width="50%">
    <div mc:edit="product_description">
      <mj-text font-size="16px">This product will change your life...</mj-text>
    </div>
    <div mc:edit="shop_now">
      <mj-button href="https://example.com/shop">Shop Now</mj-button>
    </div>
  </mj-column>
</mj-section>
```

---

## 📐 **Section 7: 3-Column Layout**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/3-Column Section"
│   ├── 📄 Frame: "Email/Column/33%"
│   │   ├── 🖼️ Email/Image/Icon 1 (Rectangle)
│   │   ├── 📝 Email/Feature Title 1 (Text)
│   │   └── 📝 Email/Feature Desc 1 (Text)
│   ├── 📄 Frame: "Email/Column/34%"
│   │   ├── 🖼️ Email/Image/Icon 2 (Rectangle)
│   │   ├── 📝 Email/Feature Title 2 (Text)
│   │   └── 📝 Email/Feature Desc 2 (Text)
│   └── 📄 Frame: "Email/Column/33%"
│       ├── 🖼️ Email/Image/Icon 3 (Rectangle)
│       ├── 📝 Email/Feature Title 3 (Text)
│       └── 📝 Email/Feature Desc 3 (Text)
```

### **Figma Setup Steps:**
1. **Create section frame**: "Email/3-Column Section"
2. **Create three columns** with explicit percentages:
   - "Email/Column/33%" (left column)
   - "Email/Column/34%" (center column)
   - "Email/Column/33%" (right column)
3. **Add content to each column**:
   - Icon image at top
   - Feature title
   - Feature description

### **Generated HTML:**
```html
<!-- 3-Column Features Section -->
<mj-section background-color="#F8F9FA" padding="20px">
  <mj-column width="33%">
    <mj-image src="..." width="60px" />
    <div mc:edit="feature_title_1">
      <mj-text font-size="18px" font-weight="bold">Feature 1</mj-text>
    </div>
    <div mc:edit="feature_desc_1">
      <mj-text font-size="14px">Description of feature 1</mj-text>
    </div>
  </mj-column>
  <mj-column width="34%">
    <mj-image src="..." width="60px" />
    <div mc:edit="feature_title_2">
      <mj-text font-size="18px" font-weight="bold">Feature 2</mj-text>
    </div>
    <div mc:edit="feature_desc_2">
      <mj-text font-size="14px">Description of feature 2</mj-text>
    </div>
  </mj-column>
  <mj-column width="33%">
    <mj-image src="..." width="60px" />
    <div mc:edit="feature_title_3">
      <mj-text font-size="18px" font-weight="bold">Feature 3</mj-text>
    </div>
    <div mc:edit="feature_desc_3">
      <mj-text font-size="14px">Description of feature 3</mj-text>
    </div>
  </mj-column>
</mj-section>
```

---

## 🎨 **Section 8: Mixed Layout**

### **Figma Structure:**
```
📄 Frame: "Newsletter Template"
├── 📄 Frame: "Email/Mixed Section"
│   ├── 📄 Frame: "Email/Column/25%"
│   │   └── 🖼️ Email/Image/Small Logo (Rectangle)
│   ├── 📄 Frame: "Email/Column/50%"
│   │   ├── 📝 Email/Main Content (Text)
│   │   └── 📄 Email/Button/Read More (Frame)
│   └── 📄 Frame: "Email/Column/25%"
│       ├── 📝 Email/Sidebar Title (Text)
│       └── 📝 Email/Sidebar Links (Text with links)
```

### **Figma Setup Steps:**
1. **Create section frame**: "Email/Mixed Section"
2. **Create asymmetric columns**:
   - "Email/Column/25%" (narrow left column)
   - "Email/Column/50%" (wide center column)
   - "Email/Column/25%" (narrow right column)
3. **Add appropriate content** to each column width

### **Generated HTML:**
```html
<!-- Mixed Layout Section -->
<mj-section background-color="#FFFFFF" padding="20px">
  <mj-column width="25%">
    <mj-image src="..." alt="Small Logo" />
  </mj-column>
  <mj-column width="50%">
    <div mc:edit="main_content">
      <mj-text font-size="16px">Main article content here...</mj-text>
    </div>
    <div mc:edit="read_more">
      <mj-button href="...">Read More</mj-button>
    </div>
  </mj-column>
  <mj-column width="25%">
    <div mc:edit="sidebar_title">
      <mj-text font-size="14px" font-weight="bold">Related Links</mj-text>
    </div>
    <div mc:edit="sidebar_links">
      <mj-text font-size="14px">
        <a href="https://example.com/link1">Link 1</a><br>
        <a href="https://example.com/link2">Link 2</a>
      </mj-text>
    </div>
  </mj-column>
</mj-section>
```

---

## 🎯 **Step-by-Step Creation Guide**

### **Step 1: Create Main Frame**
1. **Create new frame**: Click Frame tool → Draw 600px wide frame
2. **Name it**: "Newsletter Template"
3. **Set background**: White (#FFFFFF)

### **Step 2: Add Header Section**
1. **Create child frame**: Inside main frame, create new frame
2. **Name it**: "Email/Header Section"
3. **Add logo**: Rectangle → Name "Email/Image/Company Logo"
4. **Add headline**: Text → Name "Email/Main Headline"
5. **Add subheadline**: Text → Name "Email/Subheadline"

### **Step 3: Add Featured Article**
1. **Create section frame**: "Email/Featured Article"
2. **Add hero image**: Rectangle (600x300px) → "Email/Image/Hero Image"
3. **Add title**: Text → "Email/Article Title"
4. **Add excerpt**: Text → "Email/Article Excerpt"
5. **Add button**: Frame → "Email/Button/Read More"
   - Add text inside: "Read More"
   - Link text: Cmd+K → enter URL
   - Style frame: Blue background, rounded corners

### **Step 4: Add Content Section**
1. **Create section frame**: "Email/Content Section"
2. **Add body text**: Text with inline links → "Email/Body Text"
3. **Add buttons**: Multiple button frames with links

### **Step 5: Add Colored Background**
1. **Draw rectangle**: Same width as main frame
2. **Add color fill**: Choose non-white color
3. **Add text on top**: Place text over colored rectangle

### **Step 6: Add Footer**
1. **Create footer frame**: "Email/Footer Section"
2. **Add copyright text**: "Email/Footer Text"
3. **Add unsubscribe link**: "Email/Unsubscribe Link" with Mailchimp merge tag
4. **Add social links**: Text links in a group

---

## 🎨 **Visual Layout Tips**

### **Spacing & Alignment**
- **Use Auto Layout** for consistent spacing
- **Center align** headers and buttons
- **Left align** body text
- **Maintain consistent** padding (20px recommended)

### **Typography Hierarchy**
- **Main headlines**: 28-32px, bold
- **Section titles**: 24px, bold
- **Body text**: 16px, regular
- **Captions**: 14px, regular
- **Footer**: 12-14px, light

### **Color Consistency**
- **Primary buttons**: Blue (#007BFF)
- **Secondary buttons**: Green (#28A745)
- **Accent**: Orange (#FF6B35)
- **Text**: Black (#000000) or Dark Gray (#333333)
- **Links**: Blue (#007BFF)

---

## 🚀 **Testing Your Design**

### **Before Exporting:**
1. **Check layer names** follow `Email/[Name]` pattern
2. **Verify links** are properly attached (Cmd+K)
3. **Test button styling** looks good
4. **Ensure proper hierarchy** in layers panel

### **After HTML Generation:**
1. **Open HTML file** in browser
2. **Test all links** work correctly
3. **Check responsive design** on mobile
4. **Verify button styling** preserved
5. **Test in email clients** if possible

### **Mailchimp Testing:**
1. **Upload template** using "Compile & Push"
2. **Create test campaign**
3. **Verify editable regions** work
4. **Test content editing** in Mailchimp

---

## 📊 **Multi-Column Layout Tips**

### **Column Width Options**
```
✅ Explicit Percentages (Recommended):
- Email/Column/50% (perfect two-column)
- Email/Column/33% (three equal columns)
- Email/Column/25% + 50% + 25% (asymmetric layout)

✅ Descriptive Names (Auto-width):
- Email/Column/Left (33% in 3-column)
- Email/Column/Center (34% in 3-column)
- Email/Column/Right (33% in 3-column)

✅ Mixed Approach:
- Email/Column/25% (explicit)
- Email/Column/Content (auto - gets remaining 75%)
```

### **Layout Best Practices**
- **2 columns**: Use 50% each for equal width
- **3 columns**: Use 33% + 34% + 33% to handle rounding
- **Asymmetric**: Specify key columns with percentages first
- **Content hierarchy**: Put main content in wider columns
- **Mobile responsiveness**: Columns stack vertically on mobile

### **Content Distribution**
- **Left column**: Images, icons, or secondary content
- **Center column**: Main content, headlines, body text
- **Right column**: Calls-to-action, sidebars, links
- **Equal columns**: Feature lists, testimonials, product grids

---

## 🎯 **Common Issues & Solutions**

### **"HTML looks wrong"**
- **Check**: Layer names follow `Email/[Name]` pattern
- **Check**: Using Frames, not Groups for containers
- **Check**: Proper nesting structure

### **"Links not working"**
- **Check**: Used Figma's link feature (Cmd+K)
- **Check**: URLs are complete (https://...)
- **Check**: Links attached to text/button content

### **"Layout broken"**
- **Check**: Frame widths match main container
- **Check**: No overlapping elements
- **Check**: Proper Auto Layout usage

### **"Editable regions missing"**
- **Check**: Layer names start with `Email/`
- **Check**: No `/NoEdit` suffix unless intended
- **Check**: Unique, descriptive names

### **"Multi-column layout not working"**
- **Check**: Column frames are named `Email/Column/[Name]`
- **Check**: Columns are direct children of section frame
- **Check**: Use percentages like `Email/Column/50%` for explicit widths
- **Check**: Use descriptive names like `Email/Column/Left` for automatic widths

### **"Columns have wrong widths"**
- **Check**: Percentage values add up to 100% (e.g., 33% + 34% + 33%)
- **Check**: Use explicit percentages for precise control
- **Check**: Let system auto-distribute if no percentages specified

---

This structure will produce clean, professional HTML emails that work great in Mailchimp and other email clients! 🎉
