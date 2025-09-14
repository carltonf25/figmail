// Email template definitions for FigMail plugin
// These define the structure and content for premade email templates

// Utility function for responsive sizing
function responsiveSize(baseSize: number, mobileMultiplier: number = 0.8): { base: number; mobile: number } {
  return {
    base: baseSize,
    mobile: Math.round(baseSize * mobileMultiplier)
  };
}

// Utility function for responsive spacing
function responsiveSpacing(baseSpacing: number): { desktop: number; mobile: number } {
  return {
    desktop: baseSpacing,
    mobile: Math.max(10, Math.round(baseSpacing * 0.6))
  };
}

export interface EmailTemplate {
  name: string;
  description: string;
  width: number;
  height: number;
  sections: TemplateSection[];
}

export interface TemplateSection {
  type: 'section';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
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
  textAlign?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  borderRadius?: number;
  hyperlink?: string;
  children?: TemplateElement[];
}

// Newsletter Template - Responsive Design
export const newsletterTemplate: EmailTemplate = {
  name: 'Newsletter Layout',
  description: 'Classic newsletter with header, content sections, and footer - fully responsive',
  width: 600,
  height: 800,
  sections: [
    {
      type: 'section',
      name: 'Email/Header Section',
      x: 0,
      y: 0,
      width: 600,
      height: 150,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'frame',
          name: 'Email/Logo Area',
          x: 20,
          y: 20,
          width: 100,
          height: 60,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Company Logo',
              x: 0,
              y: 0,
              width: 100,
              height: 60,
              backgroundColor: '#E3F2FD'
            }
          ]
        },
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 140,
          y: 30,
          width: 440,
          height: 40,
          content: 'Welcome to Our Newsletter!',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Subheadline',
          x: 140,
          y: 80,
          width: 440,
          height: 30,
          content: 'Your weekly dose of amazing content',
          fontSize: 16,
          textAlign: 'left'
        }
      ]
    },
    {
      type: 'section',
      name: 'Email/Content Section',
      x: 0,
      y: 170,
      width: 600,
      height: 200,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Article Title',
          x: 20,
          y: 20,
          width: 560,
          height: 35,
          content: 'Breaking News: Amazing Discovery!',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Article Excerpt',
          x: 20,
          y: 65,
          width: 560,
          height: 50,
          content: 'Scientists have made an incredible breakthrough that will change everything we know about technology and innovation. This discovery promises to revolutionize how we approach...',
          fontSize: 16,
          textAlign: 'left'
        },
        {
          type: 'frame',
          name: 'Email/Button/Read More',
          x: 20,
          y: 130,
          width: 150,
          height: 40,
          backgroundColor: '#007BFF',
          borderRadius: 5,
          children: [
            {
              type: 'text',
              name: 'Read More',
              x: 0,
              y: 0,
              width: 150,
              height: 40,
              content: 'Read More',
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
              hyperlink: 'https://example.com/article'
            }
          ]
        }
      ]
    },
    {
      type: 'section',
      name: 'Email/Footer Section',
      x: 0,
      y: 390,
      width: 600,
      height: 80,
      backgroundColor: '#F8F9FA',
      children: [
        {
          type: 'text',
          name: 'Email/Footer Text',
          x: 20,
          y: 25,
          width: 560,
          height: 30,
          content: '© 2024 Your Company. All rights reserved.',
          fontSize: 14,
          textAlign: 'center'
        }
      ]
    }
  ]
};

// Promotional Email Template
export const promotionalTemplate: EmailTemplate = {
  name: 'Promotional Email',
  description: 'Eye-catching promotional layout with hero image and CTA',
  width: 600,
  height: 700,
  sections: [
    {
      type: 'section',
      name: 'Email/Hero Section',
      x: 0,
      y: 0,
      width: 600,
      height: 300,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'rectangle',
          name: 'Email/Image/Hero Image',
          x: 0,
          y: 0,
          width: 600,
          height: 250,
          backgroundColor: '#E3F2FD'
        },
        {
          type: 'text',
          name: 'Email/Hero Headline',
          x: 20,
          y: 260,
          width: 560,
          height: 40,
          content: 'Special Offer Inside!',
          fontSize: 32,
          fontWeight: 'bold',
          textAlign: 'center'
        }
      ]
    },
    {
      type: 'section',
      name: 'Email/Promo Section',
      x: 0,
      y: 320,
      width: 600,
      height: 150,
      backgroundColor: '#FFF3E0',
      children: [
        {
          type: 'text',
          name: 'Email/Promo Text',
          x: 20,
          y: 30,
          width: 560,
          height: 40,
          content: 'Limited time offer - 50% off everything!',
          fontSize: 20,
          textAlign: 'center'
        },
        {
          type: 'frame',
          name: 'Email/Button/Shop Now',
          x: 225,
          y: 80,
          width: 150,
          height: 50,
          backgroundColor: '#FF6B35',
          borderRadius: 8,
          children: [
            {
              type: 'text',
              name: 'Shop Now',
              x: 0,
              y: 0,
              width: 150,
              height: 50,
              content: 'Shop Now',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              hyperlink: 'https://example.com/shop'
            }
          ]
        }
      ]
    }
  ]
};

// 2-Column Basic Template - Mobile Responsive
export const twoColumnBasicTemplate: EmailTemplate = {
  name: '2-Column Basic',
  description: 'Simple two-column layout with image and text - stacks beautifully on mobile',
  width: 600,
  height: 400,
  sections: [
    {
      type: 'section',
      name: 'Email/2-Column Section',
      x: 0,
      y: 0,
      width: 600,
      height: 350,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'frame',
          name: 'Email/Column/Left',
          x: responsiveSpacing(20).desktop,
          y: responsiveSpacing(20).desktop,
          width: 270,
          height: 310,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Product Image',
              x: 0,
              y: 0,
              width: 270,
              height: 200,
              backgroundColor: '#F5F5F5'
            },
            {
              type: 'text',
              name: 'Email/Product Title',
              x: 0,
              y: 220,
              width: 270,
              height: 35,
              content: 'Amazing Product',
              fontSize: responsiveSize(20, 0.9).base,
              fontWeight: 'bold',
              textAlign: 'center'
            }
          ]
        },
        {
          type: 'frame',
          name: 'Email/Column/Right',
          x: 310,
          y: responsiveSpacing(20).desktop,
          width: 270,
          height: 310,
          children: [
            {
              type: 'text',
              name: 'Email/Product Description',
              x: 0,
              y: 0,
              width: 270,
              height: 100,
              content: 'This incredible product will transform the way you work. With innovative features and intuitive design, it adapts to your workflow seamlessly.',
              fontSize: responsiveSize(16, 0.9).base,
              textAlign: 'left'
            },
            {
              type: 'frame',
              name: 'Email/Button/Buy Now',
              x: 60,
              y: 120,
              width: 150,
              height: 45,
              backgroundColor: '#28A745',
              borderRadius: 6,
              children: [
                {
                  type: 'text',
                  name: 'Buy Now',
                  x: 0,
                  y: 0,
                  width: 150,
                  height: 45,
                  content: 'Buy Now',
                  fontSize: responsiveSize(16, 0.9).base,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  hyperlink: 'https://example.com/buy'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

// 3-Column Features Template
export const threeColumnFeaturesTemplate: EmailTemplate = {
  name: '3-Column Features',
  description: 'Three-column layout perfect for feature highlights',
  width: 600,
  height: 450,
  sections: [
    {
      type: 'section',
      name: 'Email/3-Column Section',
      x: 0,
      y: 0,
      width: 600,
      height: 400,
      backgroundColor: '#F8F9FA',
      children: [
        {
          type: 'frame',
          name: 'Email/Column/33%',
          x: 15,
          y: 20,
          width: 170,
          height: 360,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Icon 1',
              x: 60,
              y: 0,
              width: 50,
              height: 50,
              backgroundColor: '#007BFF',
              borderRadius: 25
            },
            {
              type: 'text',
              name: 'Email/Feature Title 1',
              x: 0,
              y: 70,
              width: 170,
              height: 30,
              content: 'Feature 1',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center'
            },
            {
              type: 'text',
              name: 'Email/Feature Desc 1',
              x: 0,
              y: 110,
              width: 170,
              height: 60,
              content: 'Amazing feature that saves you time and effort every day.',
              fontSize: 14,
              textAlign: 'center'
            }
          ]
        },
        {
          type: 'frame',
          name: 'Email/Column/34%',
          x: 205,
          y: 20,
          width: 170,
          height: 360,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Icon 2',
              x: 60,
              y: 0,
              width: 50,
              height: 50,
              backgroundColor: '#28A745',
              borderRadius: 25
            },
            {
              type: 'text',
              name: 'Email/Feature Title 2',
              x: 0,
              y: 70,
              width: 170,
              height: 30,
              content: 'Feature 2',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center'
            },
            {
              type: 'text',
              name: 'Email/Feature Desc 2',
              x: 0,
              y: 110,
              width: 170,
              height: 60,
              content: 'Seamlessly integrates with all your favorite tools.',
              fontSize: 14,
              textAlign: 'center'
            }
          ]
        },
        {
          type: 'frame',
          name: 'Email/Column/33%',
          x: 395,
          y: 20,
          width: 170,
          height: 360,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Icon 3',
              x: 60,
              y: 0,
              width: 50,
              height: 50,
              backgroundColor: '#FF6B35',
              borderRadius: 25
            },
            {
              type: 'text',
              name: 'Email/Feature Title 3',
              x: 0,
              y: 70,
              width: 170,
              height: 30,
              content: 'Feature 3',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center'
            },
            {
              type: 'text',
              name: 'Email/Feature Desc 3',
              x: 0,
              y: 110,
              width: 170,
              height: 60,
              content: 'Advanced analytics to track your success metrics.',
              fontSize: 14,
              textAlign: 'center'
            }
          ]
        }
      ]
    }
  ]
};

// Product Showcase Template
export const productShowcaseTemplate: EmailTemplate = {
  name: 'Product Showcase',
  description: 'Showcase multiple products in an attractive grid layout',
  width: 600,
  height: 600,
  sections: [
    {
      type: 'section',
      name: 'Email/Header Section',
      x: 0,
      y: 0,
      width: 600,
      height: 80,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 20,
          y: 25,
          width: 560,
          height: 30,
          content: 'New Arrivals',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center'
        }
      ]
    },
    {
      type: 'section',
      name: 'Email/Products Section',
      x: 0,
      y: 100,
      width: 600,
      height: 450,
      backgroundColor: '#FFFFFF',
      children: [
        // Product 1
        {
          type: 'frame',
          name: 'Email/Product 1',
          x: 20,
          y: 20,
          width: 180,
          height: 200,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Product 1',
              x: 0,
              y: 0,
              width: 180,
              height: 120,
              backgroundColor: '#E8F5E8'
            },
            {
              type: 'text',
              name: 'Email/Product 1 Name',
              x: 0,
              y: 130,
              width: 180,
              height: 25,
              content: 'Product Name',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center'
            },
            {
              type: 'text',
              name: 'Email/Product 1 Price',
              x: 0,
              y: 160,
              width: 180,
              height: 20,
              content: '$29.99',
              fontSize: 14,
              textAlign: 'center'
            }
          ]
        },
        // Product 2
        {
          type: 'frame',
          name: 'Email/Product 2',
          x: 210,
          y: 20,
          width: 180,
          height: 200,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Product 2',
              x: 0,
              y: 0,
              width: 180,
              height: 120,
              backgroundColor: '#E3F2FD'
            },
            {
              type: 'text',
              name: 'Email/Product 2 Name',
              x: 0,
              y: 130,
              width: 180,
              height: 25,
              content: 'Another Product',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center'
            },
            {
              type: 'text',
              name: 'Email/Product 2 Price',
              x: 0,
              y: 160,
              width: 180,
              height: 20,
              content: '$39.99',
              fontSize: 14,
              textAlign: 'center'
            }
          ]
        },
        // Product 3
        {
          type: 'frame',
          name: 'Email/Product 3',
          x: 400,
          y: 20,
          width: 180,
          height: 200,
          children: [
            {
              type: 'rectangle',
              name: 'Email/Image/Product 3',
              x: 0,
              y: 0,
              width: 180,
              height: 120,
              backgroundColor: '#FFF3E0'
            },
            {
              type: 'text',
              name: 'Email/Product 3 Name',
              x: 0,
              y: 130,
              width: 180,
              height: 25,
              content: 'Third Product',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center'
            },
            {
              type: 'text',
              name: 'Email/Product 3 Price',
              x: 0,
              y: 160,
              width: 180,
              height: 20,
              content: '$49.99',
              fontSize: 14,
              textAlign: 'center'
            }
          ]
        },
        // CTA Button
        {
          type: 'frame',
          name: 'Email/Button/View All',
          x: 225,
          y: 240,
          width: 150,
          height: 45,
          backgroundColor: '#007BFF',
          borderRadius: 6,
          children: [
            {
              type: 'text',
              name: 'View All Products',
              x: 0,
              y: 0,
              width: 150,
              height: 45,
              content: 'View All',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              hyperlink: 'https://example.com/products'
            }
          ]
        }
      ]
    }
  ]
};

// Event Invitation Template
export const eventInviteTemplate: EmailTemplate = {
  name: 'Event Invitation',
  description: 'Perfect for event announcements and invitations',
  width: 600,
  height: 650,
  sections: [
    {
      type: 'section',
      name: 'Email/Hero Section',
      x: 0,
      y: 0,
      width: 600,
      height: 200,
      backgroundColor: '#4A90E2',
      children: [
        {
          type: 'text',
          name: 'Email/Event Title',
          x: 20,
          y: 60,
          width: 560,
          height: 40,
          content: 'You\'re Invited!',
          fontSize: 32,
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Event Subtitle',
          x: 20,
          y: 110,
          width: 560,
          height: 30,
          content: 'Join us for an unforgettable experience',
          fontSize: 18,
          textAlign: 'center'
        }
      ]
    },
    {
      type: 'section',
      name: 'Email/Details Section',
      x: 0,
      y: 220,
      width: 600,
      height: 250,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Event Name',
          x: 20,
          y: 30,
          width: 560,
          height: 35,
          content: 'Annual Company Conference 2024',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Event Details',
          x: 20,
          y: 80,
          width: 560,
          height: 80,
          content: '📅 Date: March 15, 2024\n🕐 Time: 9:00 AM - 5:00 PM\n📍 Location: Downtown Conference Center\n🎟️ Limited seats available!',
          fontSize: 16,
          textAlign: 'center'
        },
        {
          type: 'frame',
          name: 'Email/Button/RSVP',
          x: 225,
          y: 180,
          width: 150,
          height: 50,
          backgroundColor: '#28A745',
          borderRadius: 8,
          children: [
            {
              type: 'text',
              name: 'RSVP Now',
              x: 0,
              y: 0,
              width: 150,
              height: 50,
              content: 'RSVP Now',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              hyperlink: 'https://example.com/rsvp'
            }
          ]
        }
      ]
    }
  ]
};

// Welcome Email Template
export const welcomeTemplate: EmailTemplate = {
  name: 'Welcome Email',
  description: 'Warm welcome email for new subscribers or customers',
  width: 600,
  height: 700,
  sections: [
    {
      type: 'section',
      name: 'Email/Welcome Header',
      x: 0,
      y: 0,
      width: 600,
      height: 150,
      backgroundColor: '#E8F5E8',
      children: [
        {
          type: 'text',
          name: 'Email/Welcome Headline',
          x: 20,
          y: 40,
          width: 560,
          height: 35,
          content: 'Welcome aboard! 🎉',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Welcome Subtext',
          x: 20,
          y: 85,
          width: 560,
          height: 25,
          content: 'Thank you for joining our community',
          fontSize: 16,
          textAlign: 'center'
        }
      ]
    },
    {
      type: 'section',
      name: 'Email/Content Section',
      x: 0,
      y: 170,
      width: 600,
      height: 300,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Personal Message',
          x: 20,
          y: 30,
          width: 560,
          height: 80,
          content: 'We\'re thrilled to have you here! Get ready to discover amazing content, exclusive offers, and connect with like-minded people who share your interests.',
          fontSize: 16,
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Next Steps',
          x: 20,
          y: 130,
          width: 560,
          height: 100,
          content: 'Here\'s what you can do next:\n\n• Complete your profile\n• Explore our latest content\n• Connect with other members\n• Set your preferences',
          fontSize: 16,
          textAlign: 'left'
        },
        {
          type: 'frame',
          name: 'Email/Button/Get Started',
          x: 225,
          y: 250,
          width: 150,
          height: 45,
          backgroundColor: '#007BFF',
          borderRadius: 6,
          children: [
            {
              type: 'text',
              name: 'Get Started',
              x: 0,
              y: 0,
              width: 150,
              height: 45,
              content: 'Get Started',
              fontSize: 16,
              fontWeight: 'bold',
              textAlign: 'center',
              hyperlink: 'https://example.com/dashboard'
            }
          ]
        }
      ]
    }
  ]
};

// Modern Newsletter Template - Compatible Version
export const modernNewsletterCompatTemplate: EmailTemplate = {
  name: 'Modern Newsletter',
  description: 'Clean, accessible newsletter with modern typography and optimal reading flow',
  width: 600,
  height: 900,
  sections: [
    // Header Section
    {
      type: 'section',
      name: 'Email/Header Section',
      x: 0,
      y: 0,
      width: 600,
      height: 120,
      backgroundColor: '#FFFFFF',
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
              x: 24,
              y: 16,
              width: 120,
              height: 40,
              backgroundColor: '#9DB2BF',
              borderRadius: 4
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
              x: 150,
              y: 26,
              width: 126,
              height: 20,
              content: 'December 2024',
              fontSize: 14,
              color: '#636E72',
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
      backgroundColor: '#F1F3F4',
      children: [
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 32,
          y: 40,
          width: 536,
          height: 80,
          content: 'The Future of Digital Experience Design',
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'left'
        },
        {
          type: 'text',
          name: 'Email/Hero Subtitle',
          x: 32,
          y: 130,
          width: 536,
          height: 50,
          content: 'Discover the latest trends, tools, and techniques that are reshaping how we create meaningful digital experiences.',
          fontSize: 18,
          textAlign: 'left'
        }
      ]
    },

    // Content Section
    {
      type: 'section',
      name: 'Email/Content Section',
      x: 0,
      y: 360,
      width: 600,
      height: 280,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'rectangle',
          name: 'Email/Image/Article Image',
          x: 32,
          y: 32,
          width: 536,
          height: 160,
          backgroundColor: '#4ECDC4',
          borderRadius: 8
        },
        {
          type: 'text',
          name: 'Email/Article Title',
          x: 32,
          y: 212,
          width: 536,
          height: 32,
          content: '5 Design Principles for Inclusive Digital Products',
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'left'
        },
        {
          type: 'frame',
          name: 'Email/Button/Read Article',
          x: 32,
          y: 252,
          width: 140,
          height: 44,
          backgroundColor: '#FF6B6B',
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
              fontSize: 16,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              hyperlink: 'https://example.com/article'
            }
          ]
        }
      ]
    },

    // Footer Section
    {
      type: 'section',
      name: 'Email/Footer Section',
      x: 0,
      y: 660,
      width: 600,
      height: 100,
      backgroundColor: '#2D3436',
      children: [
        {
          type: 'text',
          name: 'Email/Footer Text',
          x: 32,
          y: 24,
          width: 536,
          height: 20,
          content: '© 2024 Your Company • 123 Design Street, Creative City',
          fontSize: 14,
          color: '#F8F9FA',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Unsubscribe Link',
          x: 32,
          y: 56,
          width: 536,
          height: 20,
          content: 'Unsubscribe | Update Preferences | Privacy Policy',
          fontSize: 14,
          color: '#636E72',
          textAlign: 'center',
          hyperlink: 'https://example.com/unsubscribe'
        }
      ]
    }
  ]
};

// Modern Promotional Template - Compatible Version
export const modernPromotionalCompatTemplate: EmailTemplate = {
  name: 'Modern Promotional',
  description: 'High-converting promotional email with clear value proposition and strong CTA',
  width: 600,
  height: 700,
  sections: [
    // Hero Section
    {
      type: 'section',
      name: 'Email/Hero Section',
      x: 0,
      y: 0,
      width: 600,
      height: 320,
      backgroundColor: '#A8E6CF',
      children: [
        {
          type: 'text',
          name: 'Email/Hero Badge',
          x: 250,
          y: 48,
          width: 100,
          height: 24,
          content: 'EXCLUSIVE',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FF6B6B',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 32,
          y: 88,
          width: 536,
          height: 80,
          content: 'Upgrade Your Experience',
          fontSize: 32,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Value Proposition',
          x: 32,
          y: 178,
          width: 536,
          height: 48,
          content: 'Get 30% off premium features and unlock powerful tools that will transform how you work.',
          fontSize: 18,
          color: '#636E72',
          textAlign: 'center'
        },
        {
          type: 'frame',
          name: 'Email/Button/Claim Discount',
          x: 225,
          y: 242,
          width: 150,
          height: 50,
          backgroundColor: '#FF6B6B',
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
              fontSize: 16,
              fontWeight: 'bold',
              color: '#FFFFFF',
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
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Features Title',
          x: 32,
          y: 40,
          width: 536,
          height: 32,
          content: 'What You\'ll Get',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Feature List',
          x: 32,
          y: 90,
          width: 536,
          height: 120,
          content: '✓ Advanced analytics dashboard with real-time insights\n✓ Priority customer support with 2-hour response time\n✓ Unlimited projects and team collaboration tools',
          fontSize: 16,
          color: '#636E72',
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
      backgroundColor: '#FDCB6E',
      children: [
        {
          type: 'text',
          name: 'Email/Urgency Text',
          x: 32,
          y: 24,
          width: 536,
          height: 52,
          content: '⏰ Offer expires in 48 hours\nDon\'t miss out on this limited-time opportunity',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'center'
        }
      ]
    }
  ]
};

// Modern Welcome Template - Compatible Version
export const modernWelcomeCompatTemplate: EmailTemplate = {
  name: 'Modern Welcome',
  description: 'Warm, accessible welcome email that guides new users to success',
  width: 600,
  height: 800,
  sections: [
    // Welcome Header
    {
      type: 'section',
      name: 'Email/Welcome Header',
      x: 0,
      y: 0,
      width: 600,
      height: 220,
      backgroundColor: '#9DB2BF',
      children: [
        {
          type: 'text',
          name: 'Email/Welcome Headline',
          x: 32,
          y: 48,
          width: 536,
          height: 80,
          content: 'Welcome aboard! 👋',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FFFFFF',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Welcome Message',
          x: 32,
          y: 138,
          width: 536,
          height: 48,
          content: 'We\'re thrilled you\'ve joined our community. Let\'s help you get the most out of your new workspace.',
          fontSize: 18,
          color: '#F8F9FA',
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
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Steps Title',
          x: 32,
          y: 40,
          width: 536,
          height: 32,
          content: 'Get Started in 3 Steps',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'center'
        },

        // Step Icons
        {
          type: 'rectangle',
          name: 'Email/Image/Step 1 Icon',
          x: 80,
          y: 100,
          width: 48,
          height: 48,
          backgroundColor: '#4ECDC4',
          borderRadius: 24
        },
        {
          type: 'rectangle',
          name: 'Email/Image/Step 2 Icon',
          x: 276,
          y: 100,
          width: 48,
          height: 48,
          backgroundColor: '#FF6B6B',
          borderRadius: 24
        },
        {
          type: 'rectangle',
          name: 'Email/Image/Step 3 Icon',
          x: 472,
          y: 100,
          width: 48,
          height: 48,
          backgroundColor: '#FFD93D',
          borderRadius: 24
        },

        // Step Text
        {
          type: 'text',
          name: 'Email/Steps Text',
          x: 32,
          y: 170,
          width: 536,
          height: 100,
          content: '1. Complete Your Profile\nAdd your details to personalize your experience\n\n2. Explore Key Features\nTake a quick tour of the powerful tools available\n\n3. Create Your First Project\nPut everything together and see the magic happen',
          fontSize: 16,
          color: '#636E72',
          textAlign: 'left'
        },

        // CTA Button
        {
          type: 'frame',
          name: 'Email/Button/Get Started',
          x: 225,
          y: 300,
          width: 150,
          height: 48,
          backgroundColor: '#FF6B6B',
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
              fontSize: 16,
              fontWeight: 'bold',
              color: '#FFFFFF',
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
      backgroundColor: '#F8F9FA',
      children: [
        {
          type: 'text',
          name: 'Email/Support Title',
          x: 32,
          y: 32,
          width: 536,
          height: 28,
          content: 'Need Help?',
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Support Message',
          x: 32,
          y: 68,
          width: 536,
          height: 40,
          content: 'Our team is here to help. Check out our help center or reach out directly.',
          fontSize: 16,
          color: '#636E72',
          textAlign: 'center'
        }
      ]
    }
  ]
};

// Modern Product Showcase Template - Compatible Version
export const modernProductShowcaseCompatTemplate: EmailTemplate = {
  name: 'Modern Product Showcase',
  description: 'Clean product grid with modern card design and accessibility features',
  width: 600,
  height: 600,
  sections: [
    // Header
    {
      type: 'section',
      name: 'Email/Header Section',
      x: 0,
      y: 0,
      width: 600,
      height: 140,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'text',
          name: 'Email/Main Headline',
          x: 32,
          y: 32,
          width: 536,
          height: 40,
          content: 'New Arrivals',
          fontSize: 28,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'center'
        },
        {
          type: 'text',
          name: 'Email/Subtitle',
          x: 32,
          y: 80,
          width: 536,
          height: 28,
          content: 'Carefully curated products for creative professionals',
          fontSize: 18,
          color: '#636E72',
          textAlign: 'center'
        }
      ]
    },

    // Products Section
    {
      type: 'section',
      name: 'Email/Products Section',
      x: 0,
      y: 160,
      width: 600,
      height: 360,
      backgroundColor: '#F1F3F4',
      children: [
        // Product 1
        {
          type: 'rectangle',
          name: 'Email/Image/Product 1',
          x: 40,
          y: 40,
          width: 120,
          height: 120,
          backgroundColor: '#4ECDC4',
          borderRadius: 8
        },
        {
          type: 'text',
          name: 'Email/Product 1 Info',
          x: 40,
          y: 170,
          width: 120,
          height: 60,
          content: 'Modern Desk Lamp\n$89.99',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'left'
        },

        // Product 2
        {
          type: 'rectangle',
          name: 'Email/Image/Product 2',
          x: 200,
          y: 40,
          width: 120,
          height: 120,
          backgroundColor: '#A8E6CF',
          borderRadius: 8
        },
        {
          type: 'text',
          name: 'Email/Product 2 Info',
          x: 200,
          y: 170,
          width: 120,
          height: 60,
          content: 'Ergonomic Keyboard\n$149.99',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'left'
        },

        // Product 3
        {
          type: 'rectangle',
          name: 'Email/Image/Product 3',
          x: 360,
          y: 40,
          width: 120,
          height: 120,
          backgroundColor: '#FFD93D',
          borderRadius: 8
        },
        {
          type: 'text',
          name: 'Email/Product 3 Info',
          x: 360,
          y: 170,
          width: 120,
          height: 60,
          content: 'Monitor Stand Pro\n$79.99',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2D3436',
          textAlign: 'left'
        },

        // Product 4
        {
          type: 'rectangle',
          name: 'Email/Image/Product 4',
          x: 120,
          y: 250,
          width: 120,
          height: 80,
          backgroundColor: '#9DB2BF',
          borderRadius: 8
        },
        {
          type: 'text',
          name: 'Email/Product 4 Info',
          x: 120,
          y: 340,
          width: 120,
          height: 20,
          content: 'Precision Mouse - $59.99',
          fontSize: 12,
          color: '#2D3436',
          textAlign: 'left'
        },

        // Product 5
        {
          type: 'rectangle',
          name: 'Email/Image/Product 5',
          x: 280,
          y: 250,
          width: 120,
          height: 80,
          backgroundColor: '#FF6B6B',
          borderRadius: 8
        },
        {
          type: 'text',
          name: 'Email/Product 5 Info',
          x: 280,
          y: 340,
          width: 120,
          height: 20,
          content: 'Cable Organizer - $24.99',
          fontSize: 12,
          color: '#2D3436',
          textAlign: 'left'
        }
      ]
    },

    // CTA Section
    {
      type: 'section',
      name: 'Email/CTA Section',
      x: 0,
      y: 540,
      width: 600,
      height: 80,
      backgroundColor: '#FFFFFF',
      children: [
        {
          type: 'frame',
          name: 'Email/Button/Shop All',
          x: 225,
          y: 16,
          width: 150,
          height: 48,
          backgroundColor: '#2D3436',
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
              fontSize: 16,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              hyperlink: 'https://example.com/products'
            }
          ]
        }
      ]
    }
  ]
};

// Template registry - modern templates only (compatible versions)
export const templates: Record<string, EmailTemplate> = {
  // Modern template names
  'modern-newsletter': modernNewsletterCompatTemplate,
  'modern-promotional': modernPromotionalCompatTemplate,
  'modern-welcome': modernWelcomeCompatTemplate,
  'modern-product-showcase': modernProductShowcaseCompatTemplate,
  
  // Legacy template names for backward compatibility
  'newsletter': modernNewsletterCompatTemplate,
  'promotional': modernPromotionalCompatTemplate,
  'welcome': modernWelcomeCompatTemplate,
  'product-showcase': modernProductShowcaseCompatTemplate,
};
