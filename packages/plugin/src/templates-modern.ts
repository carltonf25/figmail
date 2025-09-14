// Modern Email Templates Based on Litmus Best Practices
// Professional, accessible, and conversion-optimized templates

// Modern color palettes based on 2024 design trends
const modernColors = {
  primary: {
    sage: '#9DB2BF',      // Calming, professional
    coral: '#FF6B6B',     // Energy, action
    ocean: '#4ECDC4',     // Trust, reliability
    sunset: '#FFD93D',    // Optimism, attention
    lavender: '#A8E6CF'   // Peace, luxury
  },
  neutral: {
    charcoal: '#2D3436',  // Modern black
    stone: '#636E72',     // Sophisticated gray
    cloud: '#F8F9FA',     // Clean background
    pearl: '#FFFFFF',     // Pure white
    whisper: '#F1F3F4'    // Subtle background
  },
  semantic: {
    success: '#00B894',   // Modern green
    warning: '#FDCB6E',   // Friendly orange
    error: '#E17055',     // Gentle red
    info: '#74B9FF'       // Trustworthy blue
  }
};

// Typography system based on Litmus recommendations
const typography = {
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,    // Minimum for accessibility
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,   // 1.5x font size per Litmus
    relaxed: 1.6
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48
  }
};

export interface ModernEmailTemplate {
  name: string;
  description: string;
  category: 'newsletter' | 'promotional' | 'transactional' | 'lifecycle';
  width: number;
  height: number;
  sections: TemplateSection[];
  preHeader?: string;
  subjectLine?: string;
  accessibility: {
    contrastRatio: number;
    altTexts: boolean;
    semanticStructure: boolean;
  };
}

export interface TemplateSection {
  type: 'section';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  children: TemplateElement[];
}

export interface TemplateElement {
  type: 'frame' | 'text' | 'rectangle';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  color?: string;
  borderRadius?: number;
  hyperlink?: string;
  alt?: string;
  role?: string;
  children?: TemplateElement[];
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// 1. Modern Newsletter Template
export const modernNewsletterTemplate: ModernEmailTemplate = {
  name: 'Modern Newsletter',
  description: 'Clean, accessible newsletter with modern typography and optimal reading flow',
  category: 'newsletter',
  width: 600,
  height: 900,
  preHeader: 'Your weekly dose of insights and updates',
  subjectLine: 'This week: 3 trends shaping the future',
  accessibility: {
    contrastRatio: 4.5,
    altTexts: true,
    semanticStructure: true
  },
  sections: [
    // Header Section
    {
      type: 'section',
      name: 'Email/Header Section',
      x: 0,
      y: 0,
      width: 600,
      height: 120,
      backgroundColor: modernColors.neutral.pearl,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      children: [
        // Left column for logo
        {
          type: 'frame',
          name: 'Email/Column/Left',
          x: 0,
          y: 0,
          width: 300,
          height: 72,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Company Logo',
              x: 0,
              y: 16,
              width: 120,
              height: 40,
              backgroundColor: modernColors.primary.sage,
              borderRadius: 4,
              alt: 'Company Logo'
            }
          ]
        },
        // Right column for date
        {
          type: 'frame',
          name: 'Email/Column/Right',
          x: 300,
          y: 0,
          width: 300,
          height: 72,
          children: [
            {
              type: 'text',
              name: 'Email/Date Text',
              x: 174,
              y: 26,
              width: 126,
              height: 20,
              content: 'December 2024',
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.primary,
              color: modernColors.neutral.stone,
              textAlign: 'right'
            }
          ]
        }
      ]
    },

    // Hero Section
    {
      type: 'section',
      name: 'Email/Hero Section',
      x: 0,
      y: 140,
      width: 600,
      height: 200,
      backgroundColor: modernColors.neutral.whisper,
      padding: { top: 40, right: 32, bottom: 40, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 0,
          y: 0,
          width: 536,
          height: 80,
          content: 'The Future of Digital Experience Design',
          fontSize: typography.fontSize['3xl'],
          fontFamily: typography.fontFamily.heading,
          fontWeight: '700',
          lineHeight: typography.lineHeight.tight,
          color: modernColors.neutral.charcoal,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Hero Subtitle',
          x: 0,
          y: 90,
          width: 536,
          height: 50,
          content: 'Discover the latest trends, tools, and techniques that are reshaping how we create meaningful digital experiences.',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        }
      ]
    },

    // Content Section 1
    {
      type: 'section',
      name: 'Email/Content Section 1',
      x: 0,
      y: 360,
      width: 600,
      height: 280,
      backgroundColor: modernColors.neutral.pearl,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      children: [
        {
          type: 'rectangle',
          name: 'Email/Image/Article Image 1',
          x: 0,
          y: 0,
          width: 536,
          height: 160,
          backgroundColor: modernColors.primary.ocean,
          borderRadius: 8,
          alt: 'Feature article illustration'
        },
        {
          type: 'text',
          name: 'Email/Article Title 1',
          x: 0,
          y: 180,
          width: 536,
          height: 32,
          content: '5 Design Principles for Inclusive Digital Products',
          fontSize: typography.fontSize.xl,
          fontFamily: typography.fontFamily.heading,
          fontWeight: '600',
          lineHeight: typography.lineHeight.tight,
          color: modernColors.neutral.charcoal,
          textAlign: 'left'
        },
        {
          type: 'frame',
          name: 'Email/Button/Read Article 1',
          x: 0,
          y: 220,
          width: 140,
          height: 44,
          backgroundColor: modernColors.primary.coral,
          borderRadius: 6,
          children: [
            {
              type: 'text',
              name: 'Read Article',
              x: 0,
              y: 0,
              width: 140,
              height: 44,
              content: 'Read Article',
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.primary,
              fontWeight: '600',
              color: modernColors.neutral.pearl,
              textAlign: 'center',
              hyperlink: 'https://example.com/article1'
            }
          ]
        }
      ]
    },

    // Content Section 2
    {
      type: 'section',
      name: 'Email/Content Section 2',
      x: 0,
      y: 660,
      width: 600,
      height: 160,
      backgroundColor: modernColors.neutral.cloud,
      padding: { top: 24, right: 32, bottom: 24, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Quick Update Title',
          x: 0,
          y: 0,
          width: 536,
          height: 28,
          content: 'Quick Updates',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.heading,
          fontWeight: '600',
          color: modernColors.neutral.charcoal,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Updates List',
          x: 0,
          y: 40,
          width: 536,
          height: 72,
          content: '• New accessibility features in design tools\n• Industry report: Remote work trends 2024\n• Upcoming webinar: Advanced prototyping techniques',
          fontSize: typography.fontSize.base,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        }
      ]
    },

    // Footer Section
    {
      type: 'section',
      name: 'Email/Footer Section',
      x: 0,
      y: 840,
      width: 600,
      height: 100,
      backgroundColor: modernColors.neutral.charcoal,
      padding: { top: 24, right: 32, bottom: 24, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Footer Text',
          x: 0,
          y: 0,
          width: 536,
          height: 20,
          content: '© 2024 Your Company • 123 Design Street, Creative City',
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.primary,
          color: modernColors.neutral.cloud,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Unsubscribe Link',
          x: 0,
          y: 32,
          width: 536,
          height: 20,
          content: 'Unsubscribe | Update Preferences | Privacy Policy',
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.primary,
          color: modernColors.neutral.stone,
          textAlign: 'center',
          hyperlink: 'https://example.com/unsubscribe'
        }
      ]
    }
  ]
};

// 2. Modern Promotional Template
export const modernPromotionalTemplate: ModernEmailTemplate = {
  name: 'Modern Promotional',
  description: 'High-converting promotional email with clear value proposition and strong CTA',
  category: 'promotional',
  width: 600,
  height: 700,
  preHeader: 'Limited time: Save 30% on premium features',
  subjectLine: 'John, your exclusive 30% discount expires soon',
  accessibility: {
    contrastRatio: 4.5,
    altTexts: true,
    semanticStructure: true
  },
  sections: [
    // Hero Section with Value Prop
    {
      type: 'section',
      name: 'Email/Hero Section',
      x: 0,
      y: 0,
      width: 600,
      height: 320,
      backgroundColor: modernColors.primary.lavender,
      padding: { top: 48, right: 32, bottom: 48, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Hero Badge',
          x: 218,
          y: 0,
          width: 100,
          height: 24,
          content: 'EXCLUSIVE',
          fontSize: typography.fontSize.xs,
          fontFamily: typography.fontFamily.primary,
          fontWeight: '700',
          color: modernColors.primary.coral,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 0,
          y: 40,
          width: 536,
          height: 80,
          content: 'Upgrade Your Experience',
          fontSize: typography.fontSize['4xl'],
          fontFamily: typography.fontFamily.heading,
          fontWeight: '800',
          lineHeight: typography.lineHeight.tight,
          color: modernColors.neutral.charcoal,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Value Proposition',
          x: 0,
          y: 130,
          width: 536,
          height: 48,
          content: 'Get 30% off premium features and unlock powerful tools that will transform how you work.',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'center'
        },
        {
          type: 'frame',
          name: 'Email/Button/Claim Discount',
          x: 193,
          y: 194,
          width: 150,
          height: 50,
          backgroundColor: modernColors.primary.coral,
          borderRadius: 8,
          children: [
            {
              type: 'text',
              name: 'Claim 30% Off',
              x: 0,
              y: 0,
              width: 150,
              height: 50,
              content: 'Claim 30% Off',
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.primary,
              fontWeight: '700',
              color: modernColors.neutral.pearl,
              textAlign: 'center',
              hyperlink: 'https://example.com/claim-discount'
            }
          ]
        }
      ]
    },

    // Features Section
    {
      type: 'section',
      name: 'Email/Features Section',
      x: 0,
      y: 340,
      width: 600,
      height: 240,
      backgroundColor: modernColors.neutral.pearl,
      padding: { top: 40, right: 32, bottom: 40, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Features Title',
          x: 0,
          y: 0,
          width: 536,
          height: 32,
          content: "What You'll Get",
          fontSize: typography.fontSize['2xl'],
          fontFamily: typography.fontFamily.heading,
          fontWeight: '700',
          color: modernColors.neutral.charcoal,
          textAlign: 'center'
        },
        // Feature 1
        {
          type: 'text',
          name: 'Email/Feature 1',
          x: 0,
          y: 50,
          width: 536,
          height: 32,
          content: '✓ Advanced analytics dashboard with real-time insights',
          fontSize: typography.fontSize.base,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        },
        // Feature 2
        {
          type: 'text',
          name: 'Email/Feature 2',
          x: 0,
          y: 90,
          width: 536,
          height: 32,
          content: '✓ Priority customer support with 2-hour response time',
          fontSize: typography.fontSize.base,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        },
        // Feature 3
        {
          type: 'text',
          name: 'Email/Feature 3',
          x: 0,
          y: 130,
          width: 536,
          height: 32,
          content: '✓ Unlimited projects and team collaboration tools',
          fontSize: typography.fontSize.base,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        }
      ]
    },

    // Urgency Section
    {
      type: 'section',
      name: 'Email/Urgency Section',
      x: 0,
      y: 600,
      width: 600,
      height: 100,
      backgroundColor: modernColors.semantic.warning,
      padding: { top: 24, right: 32, bottom: 24, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Urgency Text',
          x: 0,
          y: 0,
          width: 536,
          height: 52,
          content: "⏰ Offer expires in 48 hours\nDon't miss out on this limited-time opportunity",
          fontSize: typography.fontSize.base,
          fontFamily: typography.fontFamily.primary,
          fontWeight: '600',
          lineHeight: typography.lineHeight.tight,
          color: modernColors.neutral.charcoal,
          textAlign: 'center'
        }
      ]
    }
  ]
};

// 3. Modern Welcome Template
export const modernWelcomeTemplate: ModernEmailTemplate = {
  name: 'Modern Welcome',
  description: 'Warm, accessible welcome email that guides new users to success',
  category: 'lifecycle',
  width: 600,
  height: 800,
  preHeader: "Welcome! Here's how to get started in 3 simple steps",
  subjectLine: 'Welcome to your new workspace, Sarah! 🎉',
  accessibility: {
    contrastRatio: 4.5,
    altTexts: true,
    semanticStructure: true
  },
  sections: [
    // Welcome Header
    {
      type: 'section',
      name: 'Email/Welcome Header',
      x: 0,
      y: 0,
      width: 600,
      height: 220,
      backgroundColor: modernColors.primary.sage,
      padding: { top: 48, right: 32, bottom: 48, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Welcome Headline',
          x: 0,
          y: 0,
          width: 536,
          height: 80,
          content: 'Welcome aboard! 👋',
          fontSize: typography.fontSize['3xl'],
          fontFamily: typography.fontFamily.heading,
          fontWeight: '700',
          lineHeight: typography.lineHeight.tight,
          color: modernColors.neutral.pearl,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Welcome Message',
          x: 0,
          y: 90,
          width: 536,
          height: 48,
          content: "We're thrilled you've joined our community. Let's help you get the most out of your new workspace.",
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.cloud,
          textAlign: 'center'
        }
      ]
    },

    // Getting Started Steps
    {
      type: 'section',
      name: 'Email/Getting Started Section',
      x: 0,
      y: 240,
      width: 600,
      height: 400,
      backgroundColor: modernColors.neutral.pearl,
      padding: { top: 40, right: 32, bottom: 40, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Steps Title',
          x: 0,
          y: 0,
          width: 536,
          height: 32,
          content: 'Get Started in 3 Steps',
          fontSize: typography.fontSize['2xl'],
          fontFamily: typography.fontFamily.heading,
          fontWeight: '700',
          color: modernColors.neutral.charcoal,
          textAlign: 'center'
        },

        // Step 1
        {
          type: 'rectangle',
          name: 'Email/Image/Step 1 Icon',
          x: 48,
          y: 60,
          width: 48,
          height: 48,
          backgroundColor: modernColors.primary.ocean,
          borderRadius: 24,
          alt: 'Step 1: Setup your profile'
        },
        {
          type: 'text',
          name: 'Email/Step 1 Title',
          x: 120,
          y: 60,
          width: 416,
          height: 24,
          content: '1. Complete Your Profile',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.heading,
          fontWeight: '600',
          color: modernColors.neutral.charcoal,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Step 1 Description',
          x: 120,
          y: 88,
          width: 416,
          height: 20,
          content: 'Add your details to personalize your experience',
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.primary,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        },

        // Step 2
        {
          type: 'rectangle',
          name: 'Email/Image/Step 2 Icon',
          x: 48,
          y: 140,
          width: 48,
          height: 48,
          backgroundColor: modernColors.primary.coral,
          borderRadius: 24,
          alt: 'Step 2: Explore features'
        },
        {
          type: 'text',
          name: 'Email/Step 2 Title',
          x: 120,
          y: 140,
          width: 416,
          height: 24,
          content: '2. Explore Key Features',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.heading,
          fontWeight: '600',
          color: modernColors.neutral.charcoal,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Step 2 Description',
          x: 120,
          y: 168,
          width: 416,
          height: 20,
          content: 'Take a quick tour of the powerful tools available',
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.primary,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        },

        // Step 3
        {
          type: 'rectangle',
          name: 'Email/Image/Step 3 Icon',
          x: 48,
          y: 220,
          width: 48,
          height: 48,
          backgroundColor: modernColors.primary.sunset,
          borderRadius: 24,
          alt: 'Step 3: Start your first project'
        },
        {
          type: 'text',
          name: 'Email/Step 3 Title',
          x: 120,
          y: 220,
          width: 416,
          height: 24,
          content: '3. Create Your First Project',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.heading,
          fontWeight: '600',
          color: modernColors.neutral.charcoal,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Step 3 Description',
          x: 120,
          y: 248,
          width: 416,
          height: 20,
          content: 'Put everything together and see the magic happen',
          fontSize: typography.fontSize.sm,
          fontFamily: typography.fontFamily.primary,
          color: modernColors.neutral.stone,
          textAlign: 'left'
        },

        // CTA Button
        {
          type: 'frame',
          name: 'Email/Button/Get Started',
          x: 193,
          y: 300,
          width: 150,
          height: 48,
          backgroundColor: modernColors.primary.coral,
          borderRadius: 8,
          children: [
            {
              type: 'text',
              name: 'Get Started Now',
              x: 0,
              y: 0,
              width: 150,
              height: 48,
              content: 'Get Started Now',
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.primary,
              fontWeight: '700',
              color: modernColors.neutral.pearl,
              textAlign: 'center',
              hyperlink: 'https://example.com/onboarding'
            }
          ]
        }
      ]
    },

    // Support Section
    {
      type: 'section',
      name: 'Email/Support Section',
      x: 0,
      y: 660,
      width: 600,
      height: 140,
      backgroundColor: modernColors.neutral.cloud,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Support Title',
          x: 0,
          y: 0,
          width: 536,
          height: 28,
          content: 'Need Help?',
          fontSize: typography.fontSize.xl,
          fontFamily: typography.fontFamily.heading,
          fontWeight: '600',
          color: modernColors.neutral.charcoal,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Support Message',
          x: 0,
          y: 36,
          width: 536,
          height: 40,
          content: 'Our team is here to help. Check out our help center or reach out directly.',
          fontSize: typography.fontSize.base,
          fontFamily: typography.fontFamily.primary,
          lineHeight: typography.lineHeight.normal,
          color: modernColors.neutral.stone,
          textAlign: 'center'
        }
      ]
    }
  ]
};

// 4. Modern Product Showcase Template
export const modernProductShowcaseTemplate: ModernEmailTemplate = {
  name: 'Modern Product Showcase',
  description: 'Clean product grid with modern card design and accessibility features',
  category: 'promotional',
  width: 600,
  height: 900,
  preHeader: 'New arrivals: 5 products that will transform your workflow',
  subjectLine: 'Fresh arrivals picked just for you ✨',
  accessibility: {
    contrastRatio: 4.5,
    altTexts: true,
    semanticStructure: true
  },
  sections: [
    // Header
    {
      type: 'section',
      name: 'Email/Header Section',
      x: 0,
      y: 0,
      width: 600,
      height: 140,
      backgroundColor: modernColors.neutral.pearl,
      padding: { top: 32, right: 32, bottom: 32, left: 32 },
      children: [
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 0,
          y: 0,
          width: 536,
          height: 40,
          content: 'New Arrivals',
          fontSize: typography.fontSize['3xl'],
          fontFamily: typography.fontFamily.heading,
          fontWeight: '700',
          color: modernColors.neutral.charcoal,
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Subtitle',
          x: 0,
          y: 48,
          width: 536,
          height: 28,
          content: 'Carefully curated products for creative professionals',
          fontSize: typography.fontSize.lg,
          fontFamily: typography.fontFamily.primary,
          color: modernColors.neutral.stone,
          textAlign: 'center'
        }
      ]
    },

    // Products Grid - First Row (3 columns)
    {
      type: 'section',
      name: 'Email/Products Section',
      x: 0,
      y: 160,
      width: 600,
      height: 320,
      backgroundColor: modernColors.neutral.whisper,
      padding: { top: 32, right: 24, bottom: 32, left: 24 },
      children: [
        // Column 1 - Product 1
        {
          type: 'frame',
          name: 'Email/Column/33%',
          x: 0,
          y: 0,
          width: 184,
          height: 256,
          children: [
            {
              type: 'frame',
              name: 'Email/Product Card 1',
              x: 0,
              y: 0,
              width: 176,
              height: 256,
              backgroundColor: modernColors.neutral.pearl,
              borderRadius: 12,
              children: [
                {
                  type: 'rectangle',
                  name: 'Email/Image/Product 1',
                  x: 16,
                  y: 16,
                  width: 144,
                  height: 144,
                  backgroundColor: modernColors.primary.ocean,
                  borderRadius: 8,
                  alt: 'Modern Desk Lamp - Adjustable LED with wireless charging'
                },
                {
                  type: 'text',
                  name: 'Email/Product 1 Name',
                  x: 16,
                  y: 172,
                  width: 144,
                  height: 24,
                  content: 'Modern Desk Lamp',
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: '600',
                  color: modernColors.neutral.charcoal,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 1 Price',
                  x: 16,
                  y: 200,
                  width: 144,
                  height: 24,
                  content: '$89.99',
                  fontSize: typography.fontSize.lg,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: '700',
                  color: modernColors.primary.coral,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 1 Description',
                  x: 16,
                  y: 228,
                  width: 144,
                  height: 20,
                  content: 'LED with wireless charging',
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: modernColors.neutral.stone,
                  textAlign: 'left'
                }
              ]
            }
          ]
        },
        // Column 2 - Product 2
        {
          type: 'frame',
          name: 'Email/Column/34%',
          x: 184,
          y: 0,
          width: 184,
          height: 256,
          children: [
            {
              type: 'frame',
              name: 'Email/Product Card 2',
              x: 0,
              y: 0,
              width: 176,
              height: 256,
              backgroundColor: modernColors.neutral.pearl,
              borderRadius: 12,
              children: [
                {
                  type: 'rectangle',
                  name: 'Email/Image/Product 2',
                  x: 16,
                  y: 16,
                  width: 144,
                  height: 144,
                  backgroundColor: modernColors.primary.lavender,
                  borderRadius: 8,
                  alt: 'Ergonomic Keyboard - Mechanical keys with backlight'
                },
                {
                  type: 'text',
                  name: 'Email/Product 2 Name',
                  x: 16,
                  y: 172,
                  width: 144,
                  height: 24,
                  content: 'Ergonomic Keyboard',
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: '600',
                  color: modernColors.neutral.charcoal,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 2 Price',
                  x: 16,
                  y: 200,
                  width: 144,
                  height: 24,
                  content: '$149.99',
                  fontSize: typography.fontSize.lg,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: '700',
                  color: modernColors.primary.coral,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 2 Description',
                  x: 16,
                  y: 228,
                  width: 144,
                  height: 20,
                  content: 'Mechanical keys with backlight',
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: modernColors.neutral.stone,
                  textAlign: 'left'
                }
              ]
            }
          ]
        },
        // Column 3 - Product 3
        {
          type: 'frame',
          name: 'Email/Column/33%',
          x: 368,
          y: 0,
          width: 184,
          height: 256,
          children: [
            {
              type: 'frame',
              name: 'Email/Product Card 3',
              x: 0,
              y: 0,
              width: 176,
              height: 256,
              backgroundColor: modernColors.neutral.pearl,
              borderRadius: 12,
              children: [
                {
                  type: 'rectangle',
                  name: 'Email/Image/Product 3',
                  x: 16,
                  y: 16,
                  width: 144,
                  height: 144,
                  backgroundColor: modernColors.primary.sunset,
                  borderRadius: 8,
                  alt: 'Monitor Stand - Adjustable height with storage'
                },
                {
                  type: 'text',
                  name: 'Email/Product 3 Name',
                  x: 16,
                  y: 172,
                  width: 144,
                  height: 24,
                  content: 'Monitor Stand Pro',
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: '600',
                  color: modernColors.neutral.charcoal,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 3 Price',
                  x: 16,
                  y: 200,
                  width: 144,
                  height: 24,
                  content: '$79.99',
                  fontSize: typography.fontSize.lg,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: '700',
                  color: modernColors.primary.coral,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 3 Description',
                  x: 16,
                  y: 228,
                  width: 144,
                  height: 20,
                  content: 'Adjustable with storage',
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: modernColors.neutral.stone,
                  textAlign: 'left'
                }
              ]
            }
          ]
        }
      ]
    },

    // Products Grid - Second Row (2 columns)
    {
      type: 'section',
      name: 'Email/Products Section 2',
      x: 0,
      y: 480,
      width: 600,
      height: 320,
      backgroundColor: modernColors.neutral.whisper,
      padding: { top: 32, right: 24, bottom: 32, left: 24 },
      children: [
        // Column 1 - Product 4
        {
          type: 'frame',
          name: 'Email/Column/50%',
          x: 92,
          y: 0,
          width: 184,
          height: 256,
          children: [
            {
              type: 'frame',
              name: 'Email/Product Card 4',
              x: 0,
              y: 0,
              width: 176,
              height: 256,
              backgroundColor: modernColors.neutral.pearl,
              borderRadius: 12,
              children: [
                {
                  type: 'rectangle',
                  name: 'Email/Image/Product 4',
                  x: 16,
                  y: 16,
                  width: 144,
                  height: 144,
                  backgroundColor: modernColors.primary.sage,
                  borderRadius: 8,
                  alt: 'Wireless Mouse - Precision tracking with long battery'
                },
                {
                  type: 'text',
                  name: 'Email/Product 4 Name',
                  x: 16,
                  y: 172,
                  width: 144,
                  height: 24,
                  content: 'Precision Mouse',
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: '600',
                  color: modernColors.neutral.charcoal,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 4 Price',
                  x: 16,
                  y: 200,
                  width: 144,
                  height: 24,
                  content: '$59.99',
                  fontSize: typography.fontSize.lg,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: '700',
                  color: modernColors.primary.coral,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 4 Description',
                  x: 16,
                  y: 228,
                  width: 144,
                  height: 20,
                  content: 'Wireless with long battery',
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: modernColors.neutral.stone,
                  textAlign: 'left'
                }
              ]
            }
          ]
        },
        // Column 2 - Product 5
        {
          type: 'frame',
          name: 'Email/Column/50%',
          x: 324,
          y: 0,
          width: 184,
          height: 256,
          children: [
            {
              type: 'frame',
              name: 'Email/Product Card 5',
              x: 0,
              y: 0,
              width: 176,
              height: 256,
              backgroundColor: modernColors.neutral.pearl,
              borderRadius: 12,
              children: [
                {
                  type: 'rectangle',
                  name: 'Email/Image/Product 5',
                  x: 16,
                  y: 16,
                  width: 144,
                  height: 144,
                  backgroundColor: modernColors.primary.coral,
                  borderRadius: 8,
                  alt: 'Cable Organizer - Magnetic desk cable management system'
                },
                {
                  type: 'text',
                  name: 'Email/Product 5 Name',
                  x: 16,
                  y: 172,
                  width: 144,
                  height: 24,
                  content: 'Cable Organizer',
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.heading,
                  fontWeight: '600',
                  color: modernColors.neutral.charcoal,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 5 Price',
                  x: 16,
                  y: 200,
                  width: 144,
                  height: 24,
                  content: '$24.99',
                  fontSize: typography.fontSize.lg,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: '700',
                  color: modernColors.primary.coral,
                  textAlign: 'left'
                },
                {
                  type: 'text',
                  name: 'Email/Product 5 Description',
                  x: 16,
                  y: 228,
                  width: 144,
                  height: 20,
                  content: 'Magnetic cable management',
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: modernColors.neutral.stone,
                  textAlign: 'left'
                }
              ]
            }
          ]
        }
      ]
    },

    // CTA Section
    {
      type: 'section',
      name: 'Email/CTA Section',
      x: 0,
      y: 800,
      width: 600,
      height: 80,
      backgroundColor: modernColors.neutral.pearl,
      padding: { top: 16, right: 32, bottom: 16, left: 32 },
      children: [
        {
          type: 'frame',
          name: 'Email/Button/Shop All',
          x: 193,
          y: 0,
          width: 150,
          height: 48,
          backgroundColor: modernColors.neutral.charcoal,
          borderRadius: 8,
          children: [
            {
              type: 'text',
              name: 'Shop All Products',
              x: 0,
              y: 0,
              width: 150,
              height: 48,
              content: 'Shop All Products',
              fontSize: typography.fontSize.base,
              fontFamily: typography.fontFamily.primary,
              fontWeight: '600',
              color: modernColors.neutral.pearl,
              textAlign: 'center',
              hyperlink: 'https://example.com/products'
            }
          ]
        }
      ]
    }
  ]
};

// Template registry with modern templates
export const modernTemplates: Record<string, ModernEmailTemplate> = {
  'modern-newsletter': modernNewsletterTemplate,
  'modern-promotional': modernPromotionalTemplate,
  'modern-welcome': modernWelcomeTemplate,
  'modern-product-showcase': modernProductShowcaseTemplate
};