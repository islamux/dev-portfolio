# shadcn/ui Tutorial - Part 4: Advanced Patterns

## Introduction

Welcome to **Part 4** of the shadcn/ui tutorial! In this part, we'll explore advanced patterns and techniques for working with shadcn/ui components. You'll learn how to create custom hooks, build complex components, implement accessibility features, and optimize performance.

## Creating Custom Hooks for Components

Custom hooks can encapsulate component logic and make your code more reusable.

### Example: useToast Hook

```tsx
// src/hooks/use-toast.ts
import { useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

type Toast = {
  id: string
  title: string
  description?: string
  type: ToastType
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (title: string, options?: { description?: string; type?: ToastType }) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title,
      description: options?.description,
      type: options?.type || 'info',
    }

    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, toast, removeToast }
}
```

### Using the Toast Hook

```tsx
// src/components/ui/toast.tsx
'use client'

import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from './alert'
import { cn } from '@/lib/utils'

export function ToastProvider() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          variant={toast.type}
          className={cn(
            'w-full max-w-sm',
            toast.type === 'success' && 'border-green-200 dark:border-green-800',
            toast.type === 'error' && 'border-red-200 dark:border-red-800',
            toast.type === 'warning' && 'border-yellow-200 dark:border-yellow-800',
            toast.type === 'info' && 'border-blue-200 dark:border-blue-800'
          )}
        >
          <AlertTitle className={cn(
            toast.type === 'success' && 'text-green-800 dark:text-green-400',
            toast.type === 'error' && 'text-red-800 dark:text-red-400',
            toast.type === 'warning' && 'text-yellow-800 dark:text-yellow-400',
            toast.type === 'info' && 'text-blue-800 dark:text-blue-400'
          )}>
            {toast.title}
          </AlertTitle>
          {toast.description && (
            <AlertDescription>
              {toast.description}
            </AlertDescription>
          )}
        </Alert>
      ))}
    </div>
  )
}
```

### Using Toast in Components

```tsx
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <div className="space-x-4">
      <Button onClick={() => toast('Success!', { type: 'success' })}>
        Show Success
      </Button>
      <Button onClick={() => toast('Error!', { type: 'error' })}>
        Show Error
      </Button>
      <Button onClick={() => toast('Info', { type: 'info' })}>
        Show Info
      </Button>
    </div>
  )
}
```

## Building Complex Compound Components

Compound components are groups of related components that work together.

### Example: Tabs Component

```tsx
// src/components/ui/tabs.tsx
'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

### Using Tabs Component

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="p-4">Account settings content</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="p-4">Password settings content</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="p-4">Settings content</p>
      </TabsContent>
    </Tabs>
  )
}
```

## Implementing Accessibility Features

Accessibility is a core principle of shadcn/ui. Let's explore how to implement key accessibility features.

### Keyboard Navigation

```tsx
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'

export function AccessibleButton() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        button.click()
      }
    }

    button.addEventListener('keydown', handleKeyDown)
    return () => button.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <Button ref={buttonRef} onClick={() => alert('Button clicked!')}>
      Accessible Button
    </Button>
  )
}
```

### Focus Management

```tsx
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'

export function AccessibleSheet() {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const content = contentRef.current
    const trigger = triggerRef.current

    if (!content || !trigger) return

    const handleOpen = () => {
      // Focus the first focusable element in the sheet
      const firstFocusable = content.querySelector('[tabindex="0"]')
      if (firstFocusable) {
        (firstFocusable as HTMLElement).focus()
      }
    }

    const handleClose = () => {
      // Return focus to the trigger
      trigger.focus()
    }

    // Add event listeners for open/close
    // ...
  }, [])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button ref={triggerRef}>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent ref={contentRef}>
        {/* Sheet content */}
      </SheetContent>
    </Sheet>
  )
}
```

### ARIA Attributes

```tsx
import { Button } from '@/components/ui/button'

export function AriaButton() {
  return (
    <Button
      aria-label="Close menu"
      aria-describedby="menu-description"
      aria-expanded={false}
      aria-haspopup="true"
    >
      <span id="menu-description" className="sr-only">
        Closes the navigation menu
      </span>
      Close
    </Button>
  )
}
```

### Screen Reader Only Text

```tsx
import { cn } from '@/lib/utils'

export function SrOnly({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Usage
<Button>
  <Icon name="menu" size={20} />
  <SrOnly>Menu</SrOnly>
</Button>
```

## Performance Optimization

### Code Splitting

```tsx
// Dynamic import for heavy components
const HeavyComponent = dynamic(
  () => import('@/components/ui/heavy-component'),
  { loading: () => <Skeleton className="h-32 w-full" />, ssr: false }
)

export function Page() {
  return (
    <div>
      <HeavyComponent />
    </div>
  )
}
```

### Memoization

```tsx
import { memo } from 'react'
import { Button } from '@/components/ui/button'

const MemoizedButton = memo((props: React.ComponentProps<typeof Button>) => {
  // Expensive rendering logic here
  return <Button {...props} />
})

MemoizedButton.displayName = 'MemoizedButton'

export function ButtonList() {
  const buttons = Array(100).fill(0)

  return (
    <div className="space-y-2">
      {buttons.map((_, i) => (
        <MemoizedButton key={i}>Button {i}</MemoizedButton>
      ))}
    </div>
  )
}
```

### Virtualization

For long lists, use virtualization:

```bash
pnpm add @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button } from '@/components/ui/button'

export function VirtualizedList() {
  const parentRef = useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: 1000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  })

  return (
    <div 
      ref={parentRef}
      className="h-[300px] overflow-auto border rounded-lg"
    >
      <div 
        style={{ 
          height: `${rowVirtualizer.getTotalSize()}px`, 
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <div 
            key={virtualRow.key}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Button className="w-full justify-start">
              Item {virtualRow.index}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Creating Custom Component Libraries

### Step 1: Organize Your Components

```
src/
├── components/
│   ├── ui/          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── common/      # Custom components
│   │   ├── brand-button.tsx
│   │   ├── card-grid.tsx
│   │   └── ...
│   └── layout/      # Layout components
│       ├── header.tsx
│       ├── footer.tsx
│       └── ...
└── hooks/          # Custom hooks
    ├── use-toast.ts
    └── ...
```

### Step 2: Create a Component Index

```tsx
// src/components/index.ts
// UI Components
export * from './ui/button'
export * from './ui/input'
export * from './ui/label'
export * from './ui/textarea'
export * from './ui/card'
export * from './ui/badge'
export * from './ui/sheet'
export * from './ui/alert'
export * from './ui/separator'
export * from './ui/skeleton'
export * from './ui/tooltip'

// Common Components
export * from './common/brand-button'
export * from './common/card-grid'

// Layout Components
export * from './layout/header'
export * from './layout/footer'

// Hooks
export * from '../hooks/use-toast'
```

### Step 3: Document Your Components

```markdown
# Components Documentation

## UI Components

### Button

A primary action button with multiple variants and sizes.

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `className`: Additional CSS classes
- All standard HTML button attributes

**Usage:**
```tsx
import { Button } from '@/components/ui/button'

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button size="icon">
  <Icon name="menu" size={20} />
</Button>
```

## Common Components

### BrandButton

A button styled with the project's brand colors.

**Props:** Same as Button, plus:
- `variant`: "primary" | "secondary" | "outline"

**Usage:**
```tsx
import { BrandButton } from '@/components/common/brand-button'

<BrandButton>Branded Action</BrandButton>
<BrandButton variant="outline">Outline Branded</BrandButton>
```
```

## Advanced Patterns: Testing Components

### Unit Testing

```tsx
// src/components/ui/button.test.tsx
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

  it('calls onClick handler', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Integration Testing

```tsx
// src/components/ui/form.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Form } from './form'

describe('Form', () => {
  it('submits form data', () => {
    const handleSubmit = vi.fn()
    render(
      <Form onSubmit={handleSubmit}>
        <input type="text" name="name" />
        <button type="submit">Submit</button>
      </Form>
    )

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Test User' },
    })
    fireEvent.click(screen.getByRole('button'))
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Test User',
    })
  })
})
```

### Visual Testing

Use Storybook for visual testing:

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

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

export const Icon: Story = {
  args: {
    children: 'Icon Button',
    size: 'icon',
  },
}
```

## Debugging Techniques

### Using React DevTools

1. Install React DevTools browser extension
2. Inspect component props and state
3. Check component hierarchy
4. Identify unnecessary re-renders

### Console Logging

```tsx
import { useEffect } from 'react'

export function DebugComponent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('Component rendered', {
      children: React.Children.toArray(children).map(c => 
        (c as React.ReactElement).type?.name
      ),
    })
  }, [children])

  return <>{children}</>
}
```

### Error Boundaries

```tsx
import { Component, ErrorInfo, ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  public state = { hasError: false }

  public static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            An error occurred. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Best Practices for Advanced Patterns

### 1. Component Composition

```tsx
// ✅ Good: Use asChild for composition
<Button asChild>
  <Link href="/about">About</Link>
</Button>

// ❌ Avoid: Wrapping components unnecessarily
<div className="button-wrapper">
  <Button>Click</Button>
</div>
```

### 2. State Management

```tsx
// ✅ Good: Lift state up when needed
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

// ❌ Avoid: Unnecessary state lifting
function Parent() {
  return (
    <>
      <Child1 />
      <Child2 />
    </>
  )
}
```

### 3. Performance

```tsx
// ✅ Good: Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering
  return <div>{data}</div>
})

// ❌ Avoid: Unnecessary re-renders
function ExpensiveComponent({ data }) {
  // Expensive rendering on every render
  return <div>{data}</div>
}
```

### 4. Accessibility

```tsx
// ✅ Good: Proper label association
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>

// ❌ Avoid: Missing labels
<Input type="email" placeholder="Email" />
```

### 5. Type Safety

```tsx
// ✅ Good: Strong typing
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

// ❌ Avoid: Weak typing
function UserCard(user: any) {
  return <div>{user.name}</div>
}
```

## Next Steps

You're now ready to apply what you've learned to the current project! In **Part 5**, we'll cover:

- Applying shadcn/ui to the dev_portfolio project
- Migrating existing components
- Creating custom components for the project
- Optimizing the implementation

Continue to [Part 5: Applying to Current Project](SHADCN_TUTORIAL_PART_5_APPLICATION.md)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/docs/primitives)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Storybook](https://storybook.js.org/)
- [TanStack Virtual](https://tanstack.com/virtual/v3)
- [React DevTools](https://react.dev/learn/react-developer-tools)

---

**Tutorial Prepared By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
