# shadcn/ui Tutorial - Part 2: Components Deep Dive

## Introduction

Welcome to **Part 2** of the shadcn/ui tutorial! In this part, we'll dive deep into how shadcn/ui components work, how to add them to your project, and how to customize them.

## Adding Your First Component

Let's start by adding a Button component - the most common UI element.

### Step 1: Add the Button Component

Run the shadcn/ui CLI to add a button:

```bash
npx shadcn-ui@latest add button
```

This will create `src/components/ui/button.tsx` and `src/components/ui/button.css` (if using CSS).

### Step 2: Examine the Button Component

Let's look at the generated button component:

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { className, variant, size, asChild = false, ...props }, ref
) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = 'Button'

export { Button, buttonVariants }
```

## Understanding Component Structure

Let's break down what makes a shadcn/ui component:

### 1. Imports

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
```

- **React**: For component creation and hooks
- **Slot**: From Radix UI for component composition
- **cva**: Class Variance Authority for variant management
- **cn**: Our utility for merging classes

### 2. Variants with cva

```tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

**Key concepts:**
- **Base classes**: Common styles applied to all variants
- **Variants**: Different visual styles (default, destructive, outline, etc.)
- **Sizes**: Different dimensions (sm, default, lg, icon)
- **Default variants**: Fallback values

### 3. Component Props

```tsx
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}
```

- Extends HTML button attributes for full compatibility
- Includes VariantProps from cva for type-safe variants
- Adds custom props like `asChild`

### 4. Component Implementation

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { className, variant, size, asChild = false, ...props }, ref
) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
```

**Key features:**
- Uses `forwardRef` for proper ref forwarding
- `asChild` pattern for composition
- `cn` utility merges base, variant, and custom classes
- Spreads all HTML attributes

## Using the Button Component

### Basic Usage

```tsx
import { Button } from '@/components/ui/button'

<Button>Click me</Button>
```

### With Variants

```tsx
<Button variant="outline">Outline Button</Button>
<Button variant="destructive">Destructive Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="link">Link Button</Button>
```

### With Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

### With Custom Styles

```tsx
<Button className="bg-brand-500 hover:bg-brand-600 text-white">
  Custom Styled Button
</Button>
```

### As Child Component

```tsx
<Button asChild>
  <Link href="/about">About Page</Link>
</Button>
```

### With Icons

```tsx
<Button size="icon">
  <Icon name="menu" size={24} />
</Button>
```

## Adding More Components

Let's add a few more essential components:

### Adding Input Component

```bash
npx shadcn-ui@latest add input
```

### Adding Card Component

```bash
npx shadcn-ui@latest add card
```

### Adding Form Components

```bash
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea
```

## Understanding Component Composition

One of the powerful features of shadcn/ui is component composition using the `asChild` pattern.

### What is `asChild`?

The `asChild` prop allows you to replace the root element with your own component while preserving all the styling and behavior.

### Example: Button as Link

```tsx
// Without asChild
<Button onClick={handleClick}>Click me</Button>

// With asChild
<Button asChild>
  <Link href="/about">About Page</Link>
</Button>
```

Both render the same styles, but the second one is a Link component instead of a button.

### Example: Sheet Trigger

```tsx
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Icon name="menu" size={24} />
    </Button>
  </SheetTrigger>
  <SheetContent>
    {/* Sheet content */}
  </SheetContent>
</Sheet>
```

## Working with Compound Components

Some components are compound components (multiple related components that work together).

### Card Component Example

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Project description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View Project</Button>
  </CardFooter>
</Card>
```

### Sheet Component Example

```tsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'

<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Form content */}
    </div>
    <SheetFooter>
      <Button>Save Changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## Customizing Components

### Method 1: Using className Prop

The simplest way to customize is by adding a className:

```tsx
<Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8">
  Custom Button
</Button>
```

### Method 2: Extending Variants

For more complex customizations, you can extend the variants:

```tsx
import { buttonVariants } from '@/components/ui/button'

// Use the variants directly
<div className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'bg-brand-500')}>
  Custom Styled
</div>
```

### Method 3: Creating Custom Components

You can create wrapper components with predefined styles:

```tsx
// src/components/ui/brand-button.tsx
import { Button, type ButtonProps } from './button'

export function BrandButton({ children, ...props }: ButtonProps) {
  return (
    <Button
      className="bg-brand-500 hover:bg-brand-600 text-white"
      {...props}
    >
      {children}
    </Button>
  )
}

// Usage
import { BrandButton } from '@/components/ui/brand-button'

<BrandButton>Branded Button</BrandButton>
```

## Best Practices for Using Components

### 1. Use Individual Imports in Production

```tsx
// ✅ Recommended for production
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

```tsx
// ❌ Avoid in production (increases bundle size)
import { Button, Input, Card } from '@/components/ui'
```

### 2. Leverage Type Safety

```tsx
// ✅ Type-safe variant usage
<Button variant="outline" size="lg">
  Button
</Button>

// ❌ TypeScript will catch errors
<Button variant="invalid-variant">
  Button
</Button>
```

### 3. Use cn Utility for Class Merging

```tsx
import { cn } from '@/lib/utils'

// ✅ Proper class merging
<Button className={cn(
  'bg-brand-500 hover:bg-brand-600',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  Button
</Button>
```

### 4. Follow Accessibility Guidelines

```tsx
// ✅ Proper label association
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// ❌ Missing label association
<Label>Email</Label>
<Input type="email" />
```

### 5. Use Semantic HTML

```tsx
// ✅ Semantic HTML
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>

// ❌ Non-semantic
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-content">
    <p>Content</p>
  </div>
</div>
```

## Common Component Patterns

### Form Pattern

```tsx
<form className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" type="text" placeholder="Your name" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="your@email.com" />
  </div>

  <div className="space-y-2">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" placeholder="Your message" />
  </div>

  <Button type="submit" className="w-full">
    Send Message
  </Button>
</form>
```

### Card Grid Pattern

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {projects.map((project) => (
    <Card key={project.id} className="hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <Button>View Project</Button>
      </CardContent>
    </Card>
  ))}
</div>
```

### Mobile Menu Pattern

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="md:hidden">
      <Icon name="menu" size={24} />
    </Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[300px]">
    <nav className="flex flex-col space-y-4 mt-8">
      <Link href="/" className="text-lg font-medium">Home</Link>
      <Link href="/about" className="text-lg font-medium">About</Link>
      <Link href="/projects" className="text-lg font-medium">Projects</Link>
    </nav>
  </SheetContent>
</Sheet>
```

## Troubleshooting Component Issues

### Issue 1: Components not rendering

**Solution:**
1. Check that the component has `'use client'` directive
2. Verify the import path is correct
3. Ensure all dependencies are installed

### Issue 2: Styles not applying

**Solution:**
1. Check that Tailwind CSS is properly configured
2. Verify className props are being passed correctly
3. Ensure no CSS conflicts

### Issue 3: TypeScript errors on variants

**Solution:**
1. Check that you're using valid variant values
2. Verify the component is properly typed
3. Ensure all required props are provided

### Issue 4: Accessibility warnings

**Solution:**
1. Add proper ARIA attributes
2. Ensure labels are associated with inputs
3. Use semantic HTML elements

## Next Steps

You're now ready to learn about styling and theming! In **Part 3**, we'll cover:

- Customizing component styles
- Working with dark mode
- Creating custom themes
- Using CSS variables effectively

Continue to [Part 3: Styling & Theming](SHADCN_TUTORIAL_PART_3_STYLING.md)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives)
- [class-variance-authority](https://cva.style/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Tutorial Prepared By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
