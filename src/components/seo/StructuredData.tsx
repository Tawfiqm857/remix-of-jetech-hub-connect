import { Helmet } from 'react-helmet-async';

// Business constants for consistent NAP across site
export const BUSINESS_INFO = {
  name: "Joe Express Tech Hub",
  alternateName: "JE Tech Hub",
  description: "Joe Express Tech Hub offers professional tech training courses including Software Development, Data Analysis, UI/UX Design, Graphics Design, and AI-generated content. We also provide phone and gadget sales, swapping, repairs, website development, and delivery services in Gwagwalada, Abuja, Nigeria.",
  url: "https://jetechhub.com",
  phone: "+234 810 794 1349",
  email: "Jetechhub@gmail.com",
  address: {
    streetAddress: "Suit 4, Along Doma Fueling Station",
    addressLocality: "Gwagwalada",
    addressRegion: "Abuja",
    postalCode: "",
    addressCountry: "NG"
  },
  geo: {
    latitude: 8.9478,
    longitude: 7.0701
  },
  openingHours: [
    "Mo-Fr 09:00-18:00",
    "Sa 10:00-16:00"
  ],
  priceRange: "₦₦",
  sameAs: [
    "https://wa.me/2348107941349"
  ]
};

// Organization Schema
export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": BUSINESS_INFO.name,
    "alternateName": BUSINESS_INFO.alternateName,
    "url": BUSINESS_INFO.url,
    "logo": `${BUSINESS_INFO.url}/favicon.png`,
    "description": BUSINESS_INFO.description,
    "email": BUSINESS_INFO.email,
    "telephone": BUSINESS_INFO.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_INFO.address.streetAddress,
      "addressLocality": BUSINESS_INFO.address.addressLocality,
      "addressRegion": BUSINESS_INFO.address.addressRegion,
      "addressCountry": BUSINESS_INFO.address.addressCountry
    },
    "sameAs": BUSINESS_INFO.sameAs
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// LocalBusiness Schema
export const LocalBusinessSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization", "Store"],
    "name": BUSINESS_INFO.name,
    "alternateName": BUSINESS_INFO.alternateName,
    "image": `${BUSINESS_INFO.url}/og-image.png`,
    "url": BUSINESS_INFO.url,
    "telephone": BUSINESS_INFO.phone,
    "email": BUSINESS_INFO.email,
    "priceRange": BUSINESS_INFO.priceRange,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_INFO.address.streetAddress,
      "addressLocality": BUSINESS_INFO.address.addressLocality,
      "addressRegion": BUSINESS_INFO.address.addressRegion,
      "addressCountry": BUSINESS_INFO.address.addressCountry
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_INFO.geo.latitude,
      "longitude": BUSINESS_INFO.geo.longitude
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Tech Training & Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Tech Training Courses",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Software Development Training" } },
            { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Data Analysis Training" } },
            { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "UI/UX Design Training" } },
            { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "Graphics Design Training" } },
            { "@type": "Offer", "itemOffered": { "@type": "Course", "name": "AI Content Creation Training" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Tech Services",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Website & App Development" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Phone Repair Services" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Gadget Sales & Swapping" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Delivery Services" } }
          ]
        }
      ]
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Gwagwalada"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Abuja"
      },
      {
        "@type": "Country",
        "name": "Nigeria"
      }
    ],
    "sameAs": BUSINESS_INFO.sameAs
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Course Schema
interface CourseSchemaProps {
  name: string;
  description: string;
  price?: number;
  duration?: string;
  level?: string;
}

export const CourseSchema = ({ name, description, price, duration, level }: CourseSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": BUSINESS_INFO.name,
      "url": BUSINESS_INFO.url
    },
    "educationalLevel": level || "Beginner",
    "timeRequired": duration,
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "NGN",
        "availability": "https://schema.org/InStock"
      }
    }),
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "onsite",
      "location": {
        "@type": "Place",
        "name": BUSINESS_INFO.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": BUSINESS_INFO.address.streetAddress,
          "addressLocality": BUSINESS_INFO.address.addressLocality,
          "addressRegion": BUSINESS_INFO.address.addressRegion,
          "addressCountry": BUSINESS_INFO.address.addressCountry
        }
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// FAQ Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export const FAQSchema = ({ faqs }: FAQSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Product Schema for Gadgets
interface ProductSchemaProps {
  name: string;
  description: string;
  price: number;
  image?: string;
  inStock: boolean;
  category: string;
}

export const ProductSchema = ({ name, description, price, image, inStock, category }: ProductSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": name,
    "description": description,
    "image": image,
    "category": category,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "NGN",
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": BUSINESS_INFO.name
      }
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Service Schema
interface ServiceSchemaProps {
  name: string;
  description: string;
}

export const ServiceSchema = ({ name, description }: ServiceSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": BUSINESS_INFO.name,
      "telephone": BUSINESS_INFO.phone,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": BUSINESS_INFO.address.streetAddress,
        "addressLocality": BUSINESS_INFO.address.addressLocality,
        "addressRegion": BUSINESS_INFO.address.addressRegion,
        "addressCountry": BUSINESS_INFO.address.addressCountry
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Gwagwalada, Abuja"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
