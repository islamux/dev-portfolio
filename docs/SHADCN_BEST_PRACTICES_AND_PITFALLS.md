# shadcn/ui Best Practices and Common Pitfalls

## Introduction

This document outlines best practices and common pitfalls when working with shadcn/ui. It's designed to help you avoid mistakes and follow established patterns for optimal results.

## Best Practices

### 1. Component Organization

**✅ DO:**
```
src/
├── components/
│   ├── ui/          # shadcn/ui components (direct from CLI)
│   ├── common/      # Custom wrapper components
│   ├── sections/    # Page-specific components
│   └── layout/      # Layout components
└── hooks/          # Custom hooks
```

**❌ DON'T:**
```
src/
├── components/
│   ├── Button.tsx   # Custom button (should use shadcn)
│   ├── Input.tsx    # Custom input (should use shadcn)
│   └── ...
```

### 2. Import Strategy

**✅ DO (Production):**
```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

**✅ DO (Development/Storybook):**
```tsx
import { Button, Input, Card } from '@/components/ui'
```

**❌ DON'T:**
```tsx
// Avoid in production - increases bundle size
import * as ui from '@/components/ui'
```

### 3. Type Safety

**✅ DO:**
```tsx
interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
  }
}

function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>
}
```

**❌ DON'T:**
```tsx
function UserCard(user: any) {
  return <div>{user.name}</div>
}
```

### 4. Accessibility

**✅ DO:**
```tsx
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

**❌ DON'T:**
```tsx
<Input type="email" placeholder="Email" />
```

### 5. Dark Mode Support

**✅ DO:**
```tsx
<Button className="bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-700">
  Action
</Button>
```

**❌ DON'T:**
```tsx
<Button className="bg-brand-500 hover:bg-brand-600 text-white">
  Action
</Button>
```

### 6. Class Merging

**✅ DO:**
```tsx
import { cn } from '@/lib/utils'

<Button className={cn(
  'bg-brand-500 hover:bg-brand-600',
  isDisabled && 'opacity-50 cursor-not-allowed',
  isLoading && 'grayscale'
)}>
  Submit
</Button>
```

**❌ DON'T:**
```tsx
<Button className={`bg-brand-500 hover:bg-brand-600 ${isDisabled ? 'opacity-50' : ''}`}>
  Submit
</Button>
```

### 7. Component Composition

**✅ DO:**
```tsx
<Button asChild>
  <Link href="/about">About</Link>
</Button>
```

**❌ DON'T:**
```tsx
<div className="button-wrapper">
  <Button>Click</Button>
</div>
```

### 8. Responsive Design

**✅ DO:**
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

**❌ DON'T:**
```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

### 9. Form Handling

**✅ DO:**
```tsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input id="name" name="name" required />
  </div>
  
  <Button type="submit">Submit</Button>
</form>
```

**❌ DON'T:**
```tsx
<div className="form-container">
  <input type="text" placeholder="Name" />
  <button>Submit</button>
</div>
```

### 10. State Management

**✅ DO:**
```tsx
function Parent() {
  const [value, setValue] = useState('')
  
  return (
    <>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => alert(value)}>
        Submit
      </Button>
    </>
  )
}
```

**❌ DON'T:**
```tsx
function Parent() {
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  )
}

function Child1() {
  const [value, setValue] = useState('')
  return <Input value={value} onChange={(e) => setValue(e.target.value)} />
}

function Child2() {
  // Can't access value from Child1
  return <Button onClick={() => alert('Cannot access value')}>Submit</Button>
}
```

## Common Pitfalls

### 1. Missing 'use client' Directive

**Problem:** Client components don't work without 'use client'

**Solution:**
```tsx
'use client'

import { Button } from '@/components/ui/button'

export function MyComponent() {
  return <Button>Click me</Button>
}
```

### 2. Incorrect Import Paths

**Problem:** Importing from wrong location

**❌ Wrong:**
```tsx
import { Button } from '@/components/Button'
```

**✅ Correct:**
```tsx
import { Button } from '@/components/ui/button'
```

### 3. Overriding Component Styles Incorrectly

**Problem:** Custom className not applying

**❌ Wrong:**
```tsx
<Button className="bg-red-500">
  Button
</Button>
```

**✅ Correct:**
```tsx
<Button className="bg-red-500 hover:bg-red-600">
  Button
</Button>
```

### 4. Not Using cn Utility

**Problem:** Classes not merging properly

**❌ Wrong:**
```tsx
<Button className={`bg-brand-500 ${isDisabled ? 'opacity-50' : ''}`}>
  Button
</Button>
```

**✅ Correct:**
```tsx
import { cn } from '@/lib/utils'

<Button className={cn('bg-brand-500', isDisabled && 'opacity-50')}>
  Button
</Button>
```

### 5. Forgetting to Export Variants

**Problem:** Can't use variants in custom components

**✅ Correct:**
```tsx
import { buttonVariants } from '@/components/ui/button'

const customVariants = cva(buttonVariants, {
  variants: {
    ...buttonVariants.variants,
    custom: {
      brand: 'bg-brand-500 text-white',
    },
  },
})
```

### 6. Not Handling Dark Mode Properly

**Problem:** Components look bad in dark mode

**❌ Wrong:**
```tsx
<Button className="bg-white text-black">
  Button
</Button>
```

**✅ Correct:**
```tsx
<Button className="bg-background text-foreground">
  Button
</Button>
```

### 7. Overusing the Index File

**Problem:** Increased bundle size

**❌ Wrong (in production):**
```tsx
import { Button, Input, Card, Sheet, Alert } from '@/components/ui'
```

**✅ Correct (in production):**
```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
```

### 8. Not Using Semantic HTML

**Problem:** Poor accessibility and SEO

**❌ Wrong:**
```tsx
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
  </div>
  <div className="card-content">
    <p>Content</p>
  </div>
</div>
```

**✅ Correct:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
</Card>
```

### 9. Ignoring TypeScript Errors

**Problem:** Runtime errors due to type mismatches

**❌ Wrong:**
```tsx
// @ts-ignore
<Button variant="invalid-variant">
  Button
</Button>
```

**✅ Correct:**
```tsx
<Button variant="outline">
  Button
</Button>
```

### 10. Not Testing Components

**Problem:** Undiscovered bugs in production

**✅ Correct:**
```tsx
// src/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### 11. Not Documenting Components

**Problem:** Team members don't know how to use components

**✅ Correct:**
```markdown
# Button Component

A primary action button with multiple variants and sizes.

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `className`: Additional CSS classes

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
```
```

### 12. Not Using CSS Variables for Theming

**Problem:** Hard to change theme colors

**❌ Wrong:**
```css
:root {
  --primary: #3b82f6;
}

.dark {
  --primary: #60a5fa;
}
```

**✅ Correct:**
```css
:root {
  --primary: 210 100% 50%;
}

.dark {
  --primary: 210 100% 60%;
}
```

### 13. Over-customizing Components

**Problem:** Losing the benefits of shadcn/ui

**❌ Wrong:**
```tsx
// Modifying the source component directly
const buttonVariants = cva(
  'my-custom-base-styles',
  {
    variants: {
      variant: {
        myCustomVariant: 'my-custom-styles',
      },
    },
  }
)
```

**✅ Correct:**
```tsx
// Create a wrapper component
import { Button } from '@/components/ui/button'

export function CustomButton({ className, ...props }) {
  return (
    <Button className={cn('my-custom-styles', className)} {...props} />
  )
}
```

### 14. Not Using the asChild Pattern

**Problem:** Missing out on composition benefits

**❌ Wrong:**
```tsx
<Button asChild>
  <Link href="/about">About</Link>
</Button>
```

**✅ Correct:**
```tsx
<Button asChild>
  <Link href="/about">About</Link>
</Button>
```

### 15. Ignoring Performance

**Problem:** Slow page loads

**❌ Wrong:**
```tsx
import HeavyComponent from '@/components/ui/heavy-component'
```

**✅ Correct:**
```tsx
const HeavyComponent = dynamic(
  () => import('@/components/ui/heavy-component'),
  { loading: () => <Skeleton className="h-32 w-full" />, ssr: false }
)
```

## Debugging Tips

### 1. Component Not Rendering

**Check:**
1. ✅ 'use client' directive present
2. ✅ Correct import path
3. ✅ All dependencies installed
4. ✅ No TypeScript errors

### 2. Styles Not Applying

**Check:**
1. ✅ Tailwind CSS configured
2. ✅ className prop passed correctly
3. ✅ No CSS conflicts
4. ✅ Using cn utility for merging

### 3. Dark Mode Not Working

**Check:**
1. ✅ next-themes installed
2. ✅ ThemeProvider wrapping app
3. ✅ CSS variables defined
4. ✅ dark class on html element

### 4. TypeScript Errors

**Check:**
1. ✅ Valid variant values
2. ✅ Component properly typed
3. ✅ All required props provided
4. ✅ No @ts-ignore comments

### 5. Accessibility Issues

**Check:**
1. ✅ Proper ARIA attributes
2. ✅ Labels associated with inputs
3. ✅ Semantic HTML elements
4. ✅ Keyboard navigation working

## Performance Optimization

### 1. Code Splitting

```tsx
const HeavyComponent = dynamic(
  () => import('@/components/ui/heavy-component'),
  { loading: () => <Skeleton className="h-32 w-full" />, ssr: false }
)
```

### 2. Memoization

```tsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering
  return <div>{data}</div>
})
```

### 3. Virtualization

```bash
pnpm add @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

const parentRef = useRef<HTMLDivElement>(null)
const rowVirtualizer = useVirtualizer({
  count: 1000,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 40,
})
```

### 4. Bundle Analysis

```bash
pnpm add -D @next/bundle-analyzer
ANALYZE=true pnpm run build
```

## Testing Strategies

### 1. Unit Testing

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
  })
})
```

### 2. Integration Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from './ContactForm'

describe('ContactForm', () => {
  it('submits form data', () => {
    const handleSubmit = vi.fn()
    render(<ContactForm onSubmit={handleSubmit} />)
    
    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' },
    })
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Test User',
    })
  })
})
```

### 3. Visual Testing

```bash
pnpm add -D @storybook/react @storybook/addon-essentials
```

```tsx
// src/components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'destructive', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    children: 'Button',
  },
}
```

## Community Resources

### Official Documentation
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [class-variance-authority](https://cva.style/docs)

### Community
- [shadcn/ui Discord](https://discord.gg/shadcn)
- [GitHub Issues](https://github.com/shadcn-ui/ui/issues)
- [Twitter](https://twitter.com/shadcn)

### Learning Resources
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [WebAIM Accessibility](https://webaim.org/)

## Final Checklist

Before deploying your shadcn/ui implementation:

- [ ] ✅ All components using shadcn/ui
- [ ] ✅ Consistent styling across components
- [ ] ✅ Dark mode support implemented
- [ ] ✅ Responsive design verified
- [ ] ✅ Accessibility tested
- [ ] ✅ TypeScript types defined
- [ ] ✅ Unit tests written
- [ ] ✅ Integration tests written
- [ ] ✅ Documentation updated
- [ ] ✅ Build passing
- [ ] ✅ Performance optimized
- [ ] ✅ Environment variables configured

## Conclusion

By following these best practices and avoiding common pitfalls, you'll create a maintainable, accessible, and performant UI using shadcn/ui. Remember that shadcn/ui is designed to give you full control while providing sensible defaults - use it as a foundation, not a limitation.

---

**Document Prepared By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
