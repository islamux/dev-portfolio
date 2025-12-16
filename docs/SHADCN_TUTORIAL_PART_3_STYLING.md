# shadcn/ui Tutorial - Part 3: Styling & Theming

## Introduction

Welcome to **Part 3** of the shadcn/ui tutorial! In this part, we'll dive deep into styling and theming. You'll learn how to customize component styles, work with dark mode, and create consistent themes across your application.

## Understanding shadcn/ui Styling

shadcn/ui uses a unique approach to styling that combines:

1. **Tailwind CSS** - For utility-first styling
2. **CSS Variables** - For theming and dark mode
3. **class-variance-authority** - For variant management
4. **clsx and tailwind-merge** - For intelligent class merging

## CSS Variables and Theming

### How CSS Variables Work

CSS variables (custom properties) are defined in your `globals.css` file and used throughout your components. They allow you to:

- Define colors, spacing, and other design tokens in one place
- Easily switch between light and dark themes
- Maintain consistency across your application

### Default CSS Variables

Here's what the default CSS variables look like:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}
```

### Understanding HSL Color Format

shadcn/ui uses HSL (Hue, Saturation, Lightness) format for colors:

- **Hue**: 0-360 degrees (color on the color wheel)
- **Saturation**: 0-100% (intensity of the color)
- **Lightness**: 0-100% (brightness of the color)

**Example**: `222.2 47.4% 11.2%` = A blue-gray color that's quite dark

### Customizing CSS Variables

To customize your theme, modify the CSS variables in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 20 14.3% 4.1%;
  
  --primary: 262.1 83.3% 57.8%; /* Purple */
  --primary-foreground: 210 40% 98%;
  
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 20 14.3% 4.1%;
  
  /* ... other variables ... */
  
  --radius: 0.75rem; /* Larger border radius */
}
```

## Working with Dark Mode

### How Dark Mode Works

shadcn/ui uses class-based dark mode through `next-themes`:

1. CSS variables are defined for both light and dark modes
2. The `dark` class is added to the `html` element
3. Components automatically adapt based on these variables

### Dark Mode CSS Variables

```css
.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 210 40% 98%;
  
  --primary: 262.1 83.3% 60.6%; /* Lighter purple for dark mode */
  --primary-foreground: 20 14.3% 4.1%;
  
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  
  /* ... other dark mode variables ... */
}
```

### Toggling Dark Mode

```tsx
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={20} />
    </Button>
  )
}
```

### System Preference Detection

The `next-themes` provider automatically detects system preference:

```tsx
<ThemeProvider 
  attribute="class" 
  defaultTheme="system" 
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## Customizing Component Styles

### Method 1: Using className Prop

The simplest way to customize a component:

```tsx
<Button className="bg-blue-500 hover:bg-blue-600 text-white h-12 px-8">
  Custom Button
</Button>
```

### Method 2: Extending Variants

For more complex customizations, extend the cva configuration:

```tsx
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Create a custom variant
const customButtonVariants = cva(buttonVariants, {
  variants: {
    ...buttonVariants.variants,
    customVariant: {
      brand: 'bg-brand-500 hover:bg-brand-600 text-white',
      outlineBrand: 'border border-brand-500 text-brand-500 hover:bg-brand-50',
    },
  },
  defaultVariants: {
    ...buttonVariants.defaultVariants,
    customVariant: 'brand',
  },
})

// Use the extended variants
<Button className={cn(buttonVariants({ variant: 'default' }), 'bg-brand-500')}>
  Custom Styled
</Button>
```

### Method 3: Creating Custom Components

Create wrapper components with predefined styles:

```tsx
// src/components/ui/brand-button.tsx
'use client'

import { Button, type ButtonProps } from './button'

export function BrandButton({ children, variant = 'default', ...props }: ButtonProps) {
  return (
    <Button
      className="bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-700"
      {...props}
    >
      {children}
    </Button>
  )
}

// Usage
import { BrandButton } from '@/components/ui/brand-button'

<BrandButton>Branded Button</BrandButton>
<BrandButton variant="outline">Outline Branded</BrandButton>
```

### Method 4: Modifying Component Source

For complete control, modify the component source directly:

```tsx
// src/components/ui/button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: 'bg-brand-500 text-white hover:bg-brand-600', // Custom variant
        // ... other variants
      },
      size: {
        default: 'h-9 px-4 py-2',
        lg: 'h-11 px-6 py-3 text-base', // Custom size
        // ... other sizes
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

## Working with Brand Colors

### Adding Brand Colors to Tailwind

Update your `tailwind.config.js`:

```javascript
module.exports = {
  // ... existing config
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Primary brand color
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
    },
  },
  // ... rest of config
}
```

### Using Brand Colors in Components

```tsx
<Button className="bg-brand-500 hover:bg-brand-600 text-white">
  Primary Action
</Button>

<Button className="bg-brand-100 text-brand-800 hover:bg-brand-200">
  Secondary Action
</Button>

<Input className="border-brand-300 focus:ring-brand-500" />
```

### Creating Brand-Themed Components

```tsx
// src/components/ui/brand-card.tsx
import { Card, CardContent, type CardProps } from './card'

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

// Usage
import { BrandCard } from '@/components/ui/brand-card'

<BrandCard>
  <CardContent>
    <h3 className="text-brand-800 dark:text-brand-200">Branded Card</h3>
  </CardContent>
</BrandCard>
```

## Advanced Styling Techniques

### Conditional Styling

```tsx
import { cn } from '@/lib/utils'

<Button 
  className={cn(
    'bg-brand-500 hover:bg-brand-600',
    isLoading && 'opacity-50 cursor-not-allowed',
    isSuccess && 'bg-green-500 hover:bg-green-600'
  )}
>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Responsive Styling

```tsx
<Button 
  className="sm:h-10 sm:px-6 sm:text-base h-9 px-4 text-sm"
>
  Responsive Button
</Button>
```

### State-Based Styling

```tsx
<Button 
  className={cn(
    'transition-all duration-200',
    isActive && 'scale-105 shadow-lg',
    isDisabled && 'grayscale opacity-50'
  )}
>
  State Button
</Button>
```

### Animation and Transitions

```tsx
<Button 
  className="hover:scale-105 active:scale-95 transition-transform duration-200"
>
  Animated Button
</Button>

<Card className="hover:shadow-xl transition-all duration-300">
  <CardContent>
    Hover me for shadow effect
  </CardContent>
</Card>
```

## Creating a Design System

### Step 1: Define Your Color Palette

```css
:root {
  /* Brand colors */
  --brand-50: 210 100% 98%;
  --brand-100: 210 100% 94%;
  --brand-500: 210 100% 50%;
  --brand-600: 210 100% 45%;
  --brand-700: 210 100% 40%;
  
  /* Semantic colors */
  --success-500: 142 76% 48%;
  --warning-500: 48 96% 50%;
  --danger-500: 0 84% 60%;
  
  /* ... other variables ... */
}
```

### Step 2: Create Utility Components

```tsx
// src/components/ui/brand-button.tsx
'use client'

import { Button, type ButtonProps } from './button'

export function BrandButton({ children, variant = 'default', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white',
    secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200',
    outline: 'border border-brand-500 text-brand-500 hover:bg-brand-50',
  }
  
  return (
    <Button 
      className={cn(variants[variant])}
      {...props}
    >
      {children}
    </Button>
  )
}
```

### Step 3: Create Layout Components

```tsx
// src/components/ui/container.tsx
import { cn } from '@/lib/utils'

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

// src/components/ui/section.tsx
import { cn } from '@/lib/utils'

export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn('py-16 sm:py-24', className)}>
      <Container>
        {children}
      </Container>
    </section>
  )
}
```

### Step 4: Create Typographic Components

```tsx
// src/components/ui/typography.tsx
import { cn } from '@/lib/utils'

export function Heading({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h1 className={cn('text-4xl font-bold tracking-tight sm:text-5xl', className)}>
      {children}
    </h1>
  )
}

export function Subheading({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={cn('text-2xl font-semibold tracking-tight', className)}>
      {children}
    </h2>
  )
}

export function Body({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <p className={cn('text-base text-muted-foreground', className)}>
      {children}
    </p>
  )
}
```

## Theming Best Practices

### 1. Use CSS Variables for Colors

```css
:root {
  --primary: 210 100% 50%;
  --primary-foreground: 210 100% 98%;
}

.dark {
  --primary: 210 100% 60%;
  --primary-foreground: 210 100% 10%;
}
```

### 2. Maintain Color Contrast

Ensure text is readable on all backgrounds:

```tsx
// ✅ Good contrast
<Button className="bg-brand-500 text-white">
  Button
</Button>

// ❌ Poor contrast
<Button className="bg-brand-100 text-brand-500">
  Button
</Button>
```

### 3. Use Semantic Color Names

```css
:root {
  --primary: 210 100% 50%;
  --secondary: 210 100% 80%;
  --success: 142 76% 48%;
  --warning: 48 96% 50%;
  --danger: 0 84% 60%;
}
```

### 4. Provide Dark Mode Variants

```tsx
<Button 
  className="bg-brand-500 hover:bg-brand-600 text-white dark:bg-brand-600 dark:hover:bg-brand-700"
>
  Dark Mode Ready
</Button>
```

### 5. Use Consistent Spacing

```tsx
<div className="space-y-4">
  {/* Items with consistent vertical spacing */}
</div>

<div className="grid gap-6">
  {/* Grid items with consistent gap */}
</div>
```

### 6. Document Your Design System

Create a `DESIGN_SYSTEM.md` file:

```markdown
# Design System

## Colors

- **Primary**: `#3b82f6` (blue-500)
- **Secondary**: `#e5e7eb` (gray-200)
- **Success**: `#10b981` (green-500)
- **Warning**: `#f59e0b` (amber-500)
- **Danger**: `#ef4444` (red-500)

## Typography

- **Heading**: `font-bold text-4xl`
- **Subheading**: `font-semibold text-2xl`
- **Body**: `text-base text-muted-foreground`

## Spacing

- **Small**: `space-y-2`
- **Medium**: `space-y-4`
- **Large**: `space-y-6`
```

## Troubleshooting Styling Issues

### Issue 1: Styles not applying

**Solution:**
1. Check that Tailwind CSS is properly configured
2. Verify className props are being passed correctly
3. Ensure no CSS conflicts with other styles
4. Check that the component has `'use client'` directive

### Issue 2: Dark mode not working

**Solution:**
1. Ensure `next-themes` is installed and configured
2. Check that ThemeProvider is wrapping the app
3. Verify CSS variables are defined for both light and dark modes
4. Ensure the `dark` class is being added to the `html` element

### Issue 3: Custom styles being overridden

**Solution:**
1. Use the `cn` utility to properly merge classes
2. Check the order of className props
3. Ensure you're not using conflicting Tailwind classes
4. Inspect the element to see which styles are being applied

### Issue 4: Inconsistent spacing

**Solution:**
1. Use consistent spacing utilities (space-y-*, gap-*, p-*, etc.)
2. Create utility components for common spacing patterns
3. Document your spacing system

## Next Steps

You're now ready to learn about advanced patterns! In **Part 4**, we'll cover:

- Creating custom hooks for components
- Building complex compound components
- Implementing accessibility features
- Performance optimization techniques

Continue to [Part 4: Advanced Patterns](SHADCN_TUTORIAL_PART_4_ADVANCED.md)

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Tricks: CSS Variables](https://css-tricks.com/using-css-custom-properties/)
- [WebAIM: Color Contrast](https://webaim.org/resources/contrastchecker/)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

---

**Tutorial Prepared By**: Mistral Vibe AI Assistant
**Date**: 2025-12-16
**Project**: dev_portfolio
