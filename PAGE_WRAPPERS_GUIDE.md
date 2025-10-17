# Next.js Page Wrappers Guide

This guide demonstrates different approaches to creating page wrappers in Next.js that can be shared across multiple pages while allowing each page to have its own specific content and details.

## 🎯 Overview

Page wrappers are essential for maintaining consistent layouts, headers, footers, and common functionality across your application. This project demonstrates three main approaches:

1. **Custom PageWrapper Component** - Reusable component approach
2. **Nested Layouts** - Next.js App Router layout system
3. **Higher-Order Components (HOC)** - Functional composition approach

## 📁 Project Structure

```
app/
├── components/
│   ├── PageWrapper.tsx          # Reusable page wrapper component
│   └── withPageWrapper.tsx      # HOC for wrapping pages
├── dashboard/
│   ├── layout.tsx               # Nested layout for dashboard pages
│   └── page.tsx                 # Dashboard page (uses nested layout)
├── about/
│   └── page.tsx                 # About page (uses PageWrapper component)
├── contact/
│   └── page.tsx                 # Contact page (uses HOC approach)
└── page.tsx                     # Home page (original)
```

## 🛠️ Approach 1: Custom PageWrapper Component

### Usage
```tsx
import PageWrapper from "../components/PageWrapper";

export default function AboutPage() {
  return (
    <PageWrapper
      title="About Us"
      description="Learn more about our company"
      className="bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      {/* Your page content here */}
    </PageWrapper>
  );
}
```

### Features
- ✅ Flexible props for customization
- ✅ Optional header and footer
- ✅ Custom styling support
- ✅ Easy to use and understand
- ✅ TypeScript support

### Best For
- Pages that need different configurations
- When you want fine-grained control over each page
- Simple to moderate complexity applications

## 🏗️ Approach 2: Nested Layouts (Next.js App Router)

### Usage
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-base-200">
      {/* Dashboard-specific header and sidebar */}
      {children}
    </div>
  );
}

// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      {/* Page content automatically wrapped by layout */}
    </div>
  );
}
```

### Features
- ✅ Automatic wrapping of all pages in the route segment
- ✅ Nested layouts for different sections
- ✅ Shared state and context
- ✅ SEO-friendly (server-side rendering)
- ✅ Built into Next.js App Router

### Best For
- Section-specific layouts (dashboard, admin, public)
- When all pages in a section need the same wrapper
- Complex applications with multiple distinct areas

## 🔄 Approach 3: Higher-Order Components (HOC)

### Usage
```tsx
import { withPageWrapper } from "../components/withPageWrapper";

function ContactPageContent() {
  return (
    <div>
      {/* Your page content */}
    </div>
  );
}

const ContactPage = withPageWrapper(ContactPageContent, {
  title: "Contact Us",
  description: "Get in touch with our team",
  className: "bg-gradient-to-br from-green-50 to-emerald-100",
});

export default ContactPage;
```

### Features
- ✅ Functional composition
- ✅ Reusable wrapper logic
- ✅ Can be combined with other HOCs
- ✅ Good for complex wrapping logic
- ✅ TypeScript support

### Best For
- Complex wrapping logic
- When you need to compose multiple wrappers
- Advanced React patterns

## 🎨 Styling and Theming

All examples use DaisyUI with Tailwind CSS for consistent styling:

- **Light Theme**: Clean, modern appearance
- **Retro Theme**: Nostalgic, vintage styling
- **Responsive Design**: Mobile-first approach
- **Component Library**: DaisyUI components for consistency

## 🚀 Getting Started

1. **Choose your approach** based on your needs:
   - Use **PageWrapper Component** for flexibility
   - Use **Nested Layouts** for section-specific wrappers
   - Use **HOC** for complex composition needs

2. **Customize the wrapper** to match your design system

3. **Add your page content** inside the wrapper

## 📝 Examples in This Project

### About Page (`/about`)
- Uses `PageWrapper` component
- Demonstrates flexible configuration
- Shows team section and contact card

### Dashboard Page (`/dashboard`)
- Uses nested layout system
- Shows sidebar navigation
- Demonstrates stats cards and activity feed

### Contact Page (`/contact`)
- Uses HOC approach
- Shows contact form and information
- Demonstrates form handling

## 🔧 Customization

### Adding New Props to PageWrapper
```tsx
interface PageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  // Add your custom props here
  customProp?: string;
}
```

### Creating New Layouts
```tsx
// app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Admin-specific wrapper */}
      {children}
    </div>
  );
}
```

### Combining Approaches
You can combine these approaches:
- Use nested layouts for major sections
- Use PageWrapper components for specific pages
- Use HOCs for complex wrapping logic

## 🎯 Best Practices

1. **Consistency**: Choose one primary approach for your app
2. **Performance**: Nested layouts are most performant
3. **Flexibility**: PageWrapper components offer most flexibility
4. **Maintainability**: Keep wrapper logic simple and focused
5. **TypeScript**: Always use TypeScript for better development experience

## 🚀 Next Steps

1. Explore the example pages in your browser
2. Modify the wrappers to match your design system
3. Add your own pages using these patterns
4. Consider adding features like:
   - Authentication wrappers
   - Loading states
   - Error boundaries
   - SEO optimization

Happy coding! 🎉
