# shadcn/ui Component Usage Guide

## Overview

This guide provides detailed information on how to use the shadcn/ui components in the dev_portfolio project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Component List](#component-list)
3. [Usage Examples](#usage-examples)
4. [Customization](#customization)
5. [Best Practices](#best-practices)
6. [Migration Guide](#migration-guide)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Importing Components

You can import components individually or use the index file for convenience:

```tsx
// Individual imports (recommended for production)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

// Or use the index file (convenient for development)
import { Button, Input, Card, CardContent } from "@/components/ui"
```

### Required Dependencies

Make sure these dependencies are installed:

```bash
pnpm add clsx tailwind-merge class-variance-authority
pnpm add @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-separator @radix-ui/react-tooltip
pnpm add lucide-react
```

## Component List

### 1. Button

**Purpose**: Primary action button with multiple variants and sizes

**Props**:
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" (default: "default")
- `size`: "default" | "sm" | "lg" | "icon" (default: "default")
- `className`: Additional CSS classes
- All standard HTML button attributes

**Example**:
```tsx
<Button className="bg-brand-500 hover:bg-brand-600 text-white">
  Click Me
</Button>

<Button variant="ghost" size="icon">
  <Icon name="menu" size={24} />
</Button>
```

### 2. Input

**Purpose**: Text input field with proper styling

**Props**:
- `className`: Additional CSS classes
- All standard HTML input attributes

**Example**:
```tsx
<Input
  id="name"
  type="text"
  placeholder="Your name"
  className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-brand-500"
/>
```

### 3. Label

**Purpose**: Form label with proper association

**Props**:
- `htmlFor`: ID of associated input
- `className`: Additional CSS classes
- All standard HTML label attributes

**Example**:
```tsx
<Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
  Email Address
</Label>
<Input id="email" type="email" />
```

### 4. Textarea

**Purpose**: Multi-line text input

**Props**:
- `className`: Additional CSS classes
- All standard HTML textarea attributes

**Example**:
```tsx
<Textarea
  id="message"
  placeholder="Your message"
  className="min-h-[160px] resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-brand-500"
/>
```

### 5. Card

**Purpose**: Container for grouped content

**Subcomponents**:
- `Card`: Main container
- `CardHeader`: Header section
- `CardTitle`: Title text
- `CardDescription`: Description text
- `CardContent`: Main content area
- `CardFooter`: Footer section

**Example**:
```tsx
<Card className="hover:shadow-xl transition-all duration-300">
  <CardContent className="p-6">
    <h3 className="text-xl font-bold mb-2">Project Title</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      Project description goes here...
    </p>
  </CardContent>
  <CardFooter className="p-6 pt-0 border-t border-gray-200 dark:border-gray-800">
    <Button>View Project</Button>
  </CardFooter>
</Card>
```

### 6. Badge

**Purpose**: Small label for categorization or status

**Props**:
- `variant`: "default" | "secondary" | "destructive" | "outline" (default: "default")
- `className`: Additional CSS classes
- All standard HTML div attributes

**Example**:
```tsx
<Badge className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border-none">
  2024
</Badge>

<Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
  React
</Badge>
```

### 7. Sheet

**Purpose**: Dialog component for mobile menus and modals

**Subcomponents**:
- `Sheet`: Root component
- `SheetTrigger`: Button to open sheet
- `SheetContent`: Sheet content with animations
- `SheetHeader`: Header section
- `SheetFooter`: Footer section

**Props**:
- `side`: "top" | "bottom" | "left" | "right" (default: "right")
- `className`: Additional CSS classes

**Example**:
```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Icon name="menu" size={24} />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[300px] border-l border-gray-200 dark:border-gray-800">
    <nav className="flex flex-col space-y-4 mt-8">
      <Link href="/" className="text-lg font-medium">Home</Link>
      <Link href="/about" className="text-lg font-medium">About</Link>
    </nav>
  </SheetContent>
</Sheet>
```

### 8. Alert

**Purpose**: Status message display

**Props**:
- `variant`: "default" | "destructive" | "success" (default: "default")
- `className`: Additional CSS classes
- All standard HTML div attributes

**Example**:
```tsx
<Alert variant="success" className="border-green-200 dark:border-green-800">
  <p className="text-gray-800 dark:text-green-400">
    ✓ Message sent successfully!
  </p>
</Alert>

<Alert variant="destructive" className="border-red-200 dark:border-red-800">
  <p className="text-red-800 dark:text-red-400">
    Error: Please check your input
  </p>
</Alert>
```

### 9. Separator

**Purpose**: Divider between sections

**Props**:
- `orientation`: "horizontal" | "vertical" (default: "horizontal")
- `decorative`: boolean (default: true)
- `className`: Additional CSS classes
- All standard HTML div attributes

**Example**:
```tsx
<Separator className="my-4" />

<Separator orientation="vertical" className="mx-2 h-6" />
```

### 10. Skeleton

**Purpose**: Loading state placeholder

**Props**:
- `className`: Additional CSS classes
- All standard HTML div attributes

**Example**:
```tsx
<Skeleton className="h-4 w-[250px] mb-2" />
<Skeleton className="h-4 w-[200px]" />
```

### 11. Tooltip

**Purpose**: Hover information display

**Subcomponents**:
- `Tooltip`: Root component
- `TooltipTrigger`: Button to show tooltip
- `TooltipContent`: Tooltip content
- `TooltipProvider`: Provider for multiple tooltips

**Example**:
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon">
      <Icon name="info" size={20} />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Additional information</p>
  </TooltipContent>
</Tooltip>
```

## Usage Examples

### Form Example

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
      Name
    </Label>
    <Input
      id="name"
      type="text"
      placeholder="Your name"
      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-brand-500"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
      Email
    </Label>
    <Input
      id="email"
      type="email"
      placeholder="your@email.com"
      className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-brand-500"
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="message" className="text-gray-700 dark:text-gray-300">
      Message
    </Label>
    <Textarea
      id="message"
      placeholder="Your message"
      className="min-h-[160px] resize-none bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:ring-brand-500"
    />
  </div>

  <Button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white w-full">
    Send Message
  </Button>
</form>
```

### Project Card Example

```tsx
<Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300">
  <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
    <Image src={project.image} alt={project.name} fill className="object-cover" />
  </div>
  <CardContent className="p-6">
    {project.year && (
      <Badge className="mb-3 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border-none">
        {project.year}
      </Badge>
    )}
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
      {project.name}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
      {project.description}
    </p>
    <div className="flex flex-wrap gap-2 mb-4">
      {project.tech.slice(0, 3).map((tech) => (
        <Badge
          key={tech}
          variant="outline"
          className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          {tech}
        </Badge>
      ))}
    </div>
  </CardContent>
  <CardFooter className="p-6 pt-0 border-t border-gray-200 dark:border-gray-800">
    <div className="flex items-center gap-4 w-full">
      {project.github && (
        <a href={project.github} target="_blank" rel="noopener noreferrer">
          <Button className="bg-brand-500 hover:bg-brand-600 text-white gap-2">
            <Icon name="github" size={16} />
            Code
          </Button>
        </a>
      )}
    </div>
  </CardFooter>
</Card>
```

### Mobile Menu Example

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" aria-label="Toggle menu">
      <Icon name="menu" size={24} />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[300px] border-l border-gray-200 dark:border-gray-800">
    <nav className="flex flex-col space-y-4 mt-8">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-lg font-medium transition-colors px-4 py-3 rounded-lg ${pathname === link.href
            ? "bg-brand-50 text-brand-500 dark:bg-amber-900/30"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {t(link.label)}
        </Link>
      ))}
    </nav>
  </SheetContent>
</Sheet>
```

## Customization

### Overriding Default Styles

All components support the `className` prop for customization:

```tsx
<Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8">
  Custom Button
</Button>
```

### Using Brand Colors

To maintain consistency with the project's brand colors:

```tsx
// Primary actions
<Button className="bg-brand-500 hover:bg-brand-600 text-white">
  Primary Action
</Button>

// Secondary actions
<Button className="bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
  Secondary Action
</Button>

// Input fields
<Input className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700 focus:ring-brand-500" />

// Alerts
<Alert variant="success" className="border-green-200 dark:border-green-800">
  Success message
</Alert>
```

### Dark Mode Support

All components automatically support dark mode through Tailwind's dark: prefix:

```tsx
<Button className="bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-700">
  Dark Mode Supported
</Button>

<Input className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700" />
```

## Best Practices

### 1. Accessibility

- Always associate labels with inputs using `htmlFor` and `id`
- Provide proper ARIA attributes when needed
- Use semantic HTML elements
- Ensure sufficient color contrast

```tsx
<Label htmlFor="email">Email Address</Label>
<Input id="email" type="email" />
```

### 2. Consistency

- Use consistent spacing (space-y-2 for form groups, space-y-6 for form sections)
- Maintain consistent button sizes and variants
- Use brand colors for primary actions
- Keep dark mode support consistent

### 3. Performance

- Use the index file for development, but individual imports for production
- Avoid unnecessary prop spreading
- Keep custom className minimal

### 4. Type Safety

- Leverage TypeScript autocompletion for props
- Use the provided type definitions
- Avoid `any` types

## Migration Guide

### From Custom Components to shadcn/ui

#### Button Migration

**Before**:
```tsx
import Button from "../ui/Button"

<Button variant="primary" size="lg">Click Me</Button>
```

**After**:
```tsx
import { Button } from "../ui/button"

<Button className="bg-brand-500 hover:bg-brand-600 text-white h-10 px-6 py-2 text-base">
  Click Me
</Button>
```

#### Form Elements Migration

**Before**:
```tsx
<label htmlFor="name" className="block text-sm font-medium ...">Name</label>
<input id="name" type="text" className="w-full px-4 py-2 ..." />
```

**After**:
```tsx
import { Label, Input } from "../ui"

<div className="space-y-2">
  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Name</Label>
  <Input id="name" type="text" className="bg-white dark:bg-gray-900 ..." />
</div>
```

#### Card Migration

**Before**:
```tsx
<article className="rounded-lg border border-border bg-card ...">
  <div className="p-6">
    <h3 className="text-lg font-semibold ...">Title</h3>
  </div>
</article>
```

**After**:
```tsx
import { Card, CardContent } from "../ui/card"

<Card className="...">
  <CardContent className="p-6">
    <h3 className="text-lg font-semibold ...">Title</h3>
  </CardContent>
</Card>
```

## Troubleshooting

### Common Issues

#### TypeScript Errors

**Issue**: "Cannot find module" errors

**Solution**: Ensure all dependencies are installed:
```bash
pnpm add clsx tailwind-merge class-variance-authority @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-separator @radix-ui/react-tooltip lucide-react
```

#### Styling Issues

**Issue**: Components not showing expected styles

**Solution**:
1. Check that Tailwind CSS is properly configured
2. Ensure the component has the "use client" directive
3. Verify className props are being applied correctly

#### Animation Issues

**Issue**: Animations not working

**Solution**:
1. Ensure Tailwind CSS has the animation plugins enabled
2. Check that the component is properly mounted
3. Verify no CSS conflicts

#### Dark Mode Issues

**Issue**: Dark mode not applying

**Solution**:
1. Ensure `next-themes` is properly configured
2. Check that the component uses dark: prefix correctly
3. Verify the theme provider is wrapping the application

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [class-variance-authority](https://cva.style/docs)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## Support

For issues or questions about the shadcn/ui implementation in this project, refer to:

- The project's `docs/` directory for phase-specific documentation
- The Git commit history for migration details
- The component source code for implementation details

---

**Guide Prepared By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
