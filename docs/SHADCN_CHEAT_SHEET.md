# shadcn/ui Cheat Sheet

## 🎯 Quick Reference Guide

### 🚀 Essential Commands

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# Add components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add alert

# Build and analyze
pnpm run build
ANALYZE=true pnpm run build
```

### 📦 Essential Imports

```tsx
// Utility functions
import { cn } from '@/lib/utils'

// Individual components (recommended for production)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

// Index file (convenient for development)
import { Button, Input, Card, Sheet, Alert } from '@/components/ui'
```

### 🎨 Essential Patterns

#### Component Composition

```tsx
// Button as Link
<Button asChild>
  <Link href="/about">About</Link>
</Button>

// Sheet Trigger as Button
<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Icon name="menu" size={20} />
    </Button>
  </SheetTrigger>
  <SheetContent>
    {/* Content */}
  </SheetContent>
</Sheet>
```

#### Class Merging

```tsx
import { cn } from '@/lib/utils'

// Basic merging
<Button className={cn('bg-brand-500', 'hover:bg-brand-600')}>
  Button
</Button>

// Conditional classes
<Button className={cn(
  'bg-brand-500 hover:bg-brand-600',
  isDisabled && 'opacity-50 cursor-not-allowed',
  isLoading && 'grayscale'
)}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

#### Dark Mode Support

```tsx
// Basic dark mode
<Button className="bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-700">
  Action
</Button>

// Using CSS variables
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</Button>
```

#### Form Pattern

```tsx
<form className="space-y-6" onSubmit={handleSubmit}>
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" name="name" required />
  </div>

  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" name="email" type="email" required />
  </div>

  <div className="space-y-2">
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" name="message" required />
  </div>

  <Button type="submit" disabled={isSubmitting}>
    {isSubmitting ? 'Sending...' : 'Send Message'}
  </Button>
</form>
```

#### Card Pattern

```tsx
<Card className="hover:shadow-xl transition-all">
  <CardHeader>
    <CardTitle>Project Title</CardTitle>
    <CardDescription>Project description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Project content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>View Project</Button>
  </CardFooter>
</Card>
```

#### Grid Pattern

```tsx
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {projects.map((project) => (
    <Card key={project.id}>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <Button>View Project</Button>
      </CardContent>
    </Card>
  ))}
</div>
```

#### Alert Pattern

```tsx
// Success alert
<Alert variant="success" className="border-green-200 dark:border-green-800">
  <AlertTitle className="text-green-800 dark:text-green-400">
    Success!
  </AlertTitle>
  <AlertDescription>
    Message sent successfully!
  </AlertDescription>
</Alert>

// Error alert
<Alert variant="destructive" className="border-red-200 dark:border-red-800">
  <AlertTitle className="text-red-800 dark:text-red-400">
    Error
  </AlertTitle>
  <AlertDescription>
    Error sending message. Please try again.
  </AlertDescription>
</Alert>
```

### 🎯 Component Props Reference

#### Button

```tsx
<Button
  variant="default" // default, destructive, outline, secondary, ghost, link
  size="default"    // default, sm, lg, icon
  className="custom-classes"
  asChild={false}
  disabled={false}
  onClick={handleClick}
>
  Click me
</Button>
```

#### Input

```tsx
<Input
  id="email"
  name="email"
  type="email"
  placeholder="your@email.com"
  className="custom-classes"
  required
  disabled={false}
  onChange={handleChange}
/>
```

#### Card

```tsx
<Card className="custom-classes">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    Footer
  </CardFooter>
</Card>
```

#### Sheet

```tsx
<Sheet>
  <SheetTrigger asChild>
    <Button>Open</Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[300px]">
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>
        Make changes to your profile here.
      </SheetDescription>
    </SheetHeader>
    <div className="py-4">
      {/* Content */}
    </div>
    <SheetFooter>
      <Button>Save changes</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### 🎨 Styling Reference

#### Spacing

```tsx
// Vertical spacing
<div className="space-y-2">  {/* 0.5rem gap */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<div className="space-y-4">  {/* 1rem gap */}
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Horizontal spacing
<div className="space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Padding
<div className="p-4">  {/* 1rem padding */}
  Content
</div>

<div className="px-4 py-2">  {/* horizontal 1rem, vertical 0.5rem */}
  Content
</div>
```

#### Colors

```tsx
// Background colors
<div className="bg-background">Content</div>
<div className="bg-primary">Content</div>
<div className="bg-secondary">Content</div>

// Text colors
<div className="text-foreground">Text</div>
<div className="text-primary">Text</div>
<div className="text-muted-foreground">Text</div>

// Brand colors
<div className="bg-brand-500">Content</div>
<div className="text-brand-500">Text</div>
<div className="border-brand-500">Content</div>
```

#### Dark Mode

```tsx
// Light mode only
<div className="block dark:hidden">
  Only visible in light mode
</div>

// Dark mode only
<div className="hidden dark:block">
  Only visible in dark mode
</div>

// Different styles for each mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Content
</div>
```

### ⚡ Performance Tips

```tsx
// Dynamic import for heavy components
const HeavyComponent = dynamic(
  () => import('@/components/ui/heavy-component'),
  { loading: () => <Skeleton className="h-32 w-full" />, ssr: false }
)

// Memoization
const MemoizedComponent = React.memo(({ data }) => {
  // Expensive rendering
  return <div>{data}</div>
})

// Virtualization for long lists
import { useVirtualizer } from '@tanstack/react-virtual'

const parentRef = useRef<HTMLDivElement>(null)
const rowVirtualizer = useVirtualizer({
  count: 1000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40,
})
```

### 🔍 Debugging Tips

#### Component Not Rendering

```bash
# Check for:
1. 'use client' directive
2. Correct import path
3. All dependencies installed
4. TypeScript errors
```

#### Styles Not Applying

```bash
# Check for:
1. Tailwind CSS configured
2. className prop passed
3. Using cn utility
4. CSS conflicts
```

#### Dark Mode Not Working

```bash
# Check for:
1. next-themes installed
2. ThemeProvider wrapping app
3. CSS variables defined
4. dark class on html element
```

### 📋 Best Practices Checklist

#### ✅ DO
- Use individual imports in production
- Leverage TypeScript types
- Use semantic HTML
- Associate labels with inputs
- Support dark mode
- Use consistent spacing
- Test components
- Document components

#### ❌ DON'T
- Overuse the index file in production
- Ignore TypeScript errors
- Use placeholder text instead of labels
- Hardcode colors
- Use inconsistent spacing
- Forget to test
- Skip documentation

### 🎯 Project-Specific Tips

#### Migration Strategy

1. **Start with foundation** (Container, Header, Footer)
2. **Then forms** (ContactForm)
3. **Then content** (ProjectCard, etc.)
4. **Finally polish** (animations, micro-interactions)

#### Custom Components

```tsx
// BrandButton
import { Button, type ButtonProps } from './button'
import { cn } from '@/lib/utils'

export function BrandButton({ className, ...props }: ButtonProps) {
  return (
    <Button 
      className={cn(
        'bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-700',
        className
      )}
      {...props}
    />
  )
}

// BrandCard
import { Card, type CardProps } from './card'
import { cn } from '@/lib/utils'

export function BrandCard({ className, ...props }: CardProps) {
  return (
    <Card 
      className={cn(
        'border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900/10',
        className
      )}
      {...props}
    />
  )
}
```

### 📚 Resources

#### Official Documentation
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Next.js](https://nextjs.org/docs)

#### Community
- [shadcn/ui Discord](https://discord.gg/shadcn)
- [GitHub Issues](https://github.com/shadcn-ui/ui/issues)
- [Twitter](https://twitter.com/shadcn)

#### Learning
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [WebAIM Accessibility](https://webaim.org/)

### 🎓 Tutorial Series

1. [Part 1: Setup & Installation](SHADCN_TUTORIAL_PART_1_SETUP.md)
2. [Part 2: Components Deep Dive](SHADCN_TUTORIAL_PART_2_COMPONENTS.md)
3. [Part 3: Styling & Theming](SHADCN_TUTORIAL_PART_3_STYLING.md)
4. [Part 4: Advanced Patterns](SHADCN_TUTORIAL_PART_4_ADVANCED.md)
5. [Part 5: Applying to Current Project](SHADCN_TUTORIAL_PART_5_APPLICATION.md)
6. [Best Practices & Pitfalls](SHADCN_BEST_PRACTICES_AND_PITFALLS.md)
7. [Tutorial Summary](SHADCN_TUTORIAL_SUMMARY.md)

---

**Cheat Sheet Created By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
