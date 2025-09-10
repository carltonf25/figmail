// Email template definitions for FigMail plugin
// These define the structure and content for premade email templates

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

// Newsletter Template
export const newsletterTemplate: EmailTemplate = {
  name: 'Newsletter Layout',
  description: 'Classic newsletter with header, content sections, and footer',
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
          content: 'Scientists have made an incredible breakthrough that will change everything we know about...',
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

// 2-Column Basic Template
export const twoColumnBasicTemplate: EmailTemplate = {
  name: '2-Column Basic',
  description: 'Simple two-column layout with image and text',
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
          x: 20,
          y: 20,
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
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center'
            }
          ]
        },
        {
          type: 'frame',
          name: 'Email/Column/Right',
          x: 310,
          y: 20,
          width: 270,
          height: 310,
          children: [
            {
              type: 'text',
              name: 'Email/Product Description',
              x: 0,
              y: 0,
              width: 270,
              height: 80,
              content: 'This incredible product will transform the way you work. With innovative features and intuitive design...',
              fontSize: 16,
              textAlign: 'left'
            },
            {
              type: 'frame',
              name: 'Email/Button/Buy Now',
              x: 60,
              y: 100,
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
                  fontSize: 16,
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

// Template registry
export const templates: Record<string, EmailTemplate> = {
  'newsletter': newsletterTemplate,
  'promotional': promotionalTemplate,
  'product-showcase': productShowcaseTemplate,
  'event-invite': eventInviteTemplate,
  'welcome': welcomeTemplate,
  '2-column-basic': twoColumnBasicTemplate,
  '3-column-features': threeColumnFeaturesTemplate,
};
