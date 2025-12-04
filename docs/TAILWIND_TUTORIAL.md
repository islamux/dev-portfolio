# Tailwind CSS Properties Tutorial

A comprehensive guide to all Tailwind CSS properties used in this portfolio project.

---

## Table of Contents
1. [Layout & Positioning](#layout--positioning)
2. [Spacing (Padding & Margin)](#spacing--padding--margin)
3. [Sizing (Width & Height)](#sizing--width--height)
4. [Typography](#typography)
5. [Colors & Backgrounds](#colors--backgrounds)
6. [Flexbox](#flexbox)
7. [Grid Layout](#grid-layout)
8. [Borders](#borders)
9. [Shadows](#shadows)
10. [Effects (Transitions & Transforms)](#effects--transitions--transforms)
11. [Display & Visibility](#display--visibility)
12. [Responsive Design](#responsive-design)
13. [Dark Mode](#dark-mode)
14. [Interactive States](#interactive-states)
15. [Custom/Brand Colors](#custombrand-colors)
16. [Other Utilities](#other-utilities)

---

## Layout & Positioning

### Container & Width
- **`mx-auto`** - Centers an element horizontally with automatic left and right margins
- **`max-w-7xl`** - Sets maximum width to 80rem (1280px)
- **`max-w-4xl`** - Sets maximum width to 56rem (896px)
- **`max-w-3xl`** - Sets maximum width to 48rem (768px)
- **`max-w-2xl`** - Sets maximum width to 42rem (672px)
- **`w-full`** - Sets width to 100% of the parent container
- **`min-h-screen`** - Sets minimum height to 100vh (full viewport height)

### Positioning
- **`relative`** - Positions element relative to its normal position
- **`absolute`** - Positions element relative to its nearest positioned ancestor
- **`sticky`** - Toggles sticky positioning (hybrid of relative and fixed)
- **`top-0`** - Positions element 0px from the top
- **`inset-0`** - Sets all positioning offsets (top, right, bottom, left) to 0

### Z-Index
- **`z-50`** - Sets z-index value to 50 (for layering elements)

---

## Spacing (Padding & Margin)

### Padding
- **`pt-4`** - padding to all sides 
- **`p-6`** - Applies padding of 1.5rem (24px) on all sides
- **`p-4`** - Applies padding of 1rem (16px) on all sides
- **`p-2`** - Applies padding of 0.5rem (8px) on all sides
- **`px-4`** - Applies horizontal padding of 1rem (16px) - left and right
- **`px-2`** - Applies horizontal padding of 0.5rem (8px) - left and right
- **`py-20`** - Applies vertical padding of 5rem (80px) - top and bottom
- **`py-12`** - Applies vertical padding of 3rem (48px) - top and bottom
- **`py-16`** - Applies vertical padding of 4rem (64px) - top and bottom
- **`py-24`** - Applies vertical padding of 6rem (96px) - top and bottom
- **`py-4`** - Applies vertical padding of 1rem (16px) - top and bottom
- **`px-3`** - Applies horizontal padding of 0.75rem (12px) - left and right
- **`py-1.5`** - Applies vertical padding of 0.375rem (6px) - top and bottom

### Margin
- **`mb-12`** - Applies margin-bottom of 3rem (48px)
- **`mb-8`** - Applies margin-bottom of 2rem (32px)
- **`mb-6`** - Applies margin-bottom of 1.5rem (24px)
- **`mb-4`** - Applies margin-bottom of 1rem (16px)
- **`mb-2`** - Applies margin-bottom of 0.5rem (8px)
- **`mb-3`** - Applies margin-bottom of 0.75rem (12px)
- **`mt-2`** - Applies margin-top of 0.5rem (8px)
- **`ml-auto`** - Applies auto margin-left (pushes element to the right in flexbox)

### Spacing Between Children
- **`space-y-12`** - Applies margin-top of 3rem (48px) between vertically stacked children
- **`space-y-6`** - Applies margin-top of 1.5rem (24px) between vertically stacked children
- **`space-y-2`** - Applies margin-top of 0.5rem (8px) between vertically stacked children
- **`gap-6`** - Applies gap of 1.5rem (24px) between flex/grid items
- **`gap-8`** - Applies gap of 2rem (32px) between flex/grid items
- **`gap-4`** - Applies gap of 1rem (16px) between flex/grid items
- **`gap-2`** - Applies gap of 0.5rem (8px) between flex/grid items
- **`gap-3`** - Applies gap of 0.75rem (12px) between flex/grid items

---

## Sizing (Width & Height)

### Width
- **`w-full`** - Sets width to 100%
- **`w-48`** - Sets width to 12rem (192px)
- **`w-4`** - Sets width to 1rem (16px)

### Height
- **`h-16`** - Sets height to 4rem (64px)
- **`h-full`** - Sets height to 100%
- **`h-48`** - Sets height to 12rem (192px)
- **`aspect-video`** - Sets aspect ratio to 16:9 (width/height)

---

## Typography

### Font Size
- **`text-5xl`** - Sets font size to 3rem (48px)
- **`text-4xl`** - Sets font size to 2.25rem (36px)
- **`text-3xl`** - Sets font size to 1.875rem (30px)
- **`text-2xl`** - Sets font size to 1.5rem (24px)
- **`text-xl`** - Sets font size to 1.25rem (20px)
- **`text-lg`** - Sets font size to 1.125rem (18px)
- **`text-base`** - Sets font size to 1rem (16px)
- **`text-sm`** - Sets font size to 0.875rem (14px)
- **`text-xs`** - Sets font size to 0.75rem (12px)

### Font Weight
- **`font-bold`** - Sets font weight to 700
- **`font-semibold`** - Sets font weight to 600
- **`font-medium`** - Sets font weight to 500

### Text Alignment & Spacing
- **`text-center`** - Centers text horizontally
- **`mb-4`** - Adds margin-bottom of 1rem (16px)

### Text Colors (Light)
- **`text-gray-900`** - Sets text color to gray-900
- **`text-gray-700`** - Sets text color to gray-700
- **`text-gray-600`** - Sets text color to gray-600
- **`text-gray-500`** - Sets text color to gray-500
- **`text-white`** - Sets text color to white
- **`text-blue-600`** - Sets text color to blue-600
- **`text-blue-800`** - Sets text color to blue-800
- **`text-green-600`** - Sets text color to green-600
- **`text-gray-300`** - Sets text color to gray-300 (light mode variant)

---

## Colors & Backgrounds

### Background Colors (Light)
- **`bg-white`** - Sets background color to white
- **`bg-gray-50`** - Sets background color to gray-50
- **`bg-gray-100`** - Sets background color to gray-100
- **`bg-gray-200`** - Sets background color to gray-200
- **`bg-gray-800`** - Sets background color to gray-800
- **`bg-gray-900`** - Sets background color to gray-900
- **`bg-gray-950`** - Sets background color to gray-950
- **`bg-blue-100`** - Sets background color to blue-100
- **`bg-blue-600`** - Sets background color to blue-600
- **`bg-blue-900`** - Sets background color to blue-900
- **`bg-brand-500`** - Sets background color to custom brand-500
- **`bg-brand-50`** - Sets background color to custom brand-50
- **`bg-amber-900`** - Sets background color to amber-900
- **`bg-transparent`** - Sets background to transparent
- **`bg-white/80`** - Sets background to white with 80% opacity
- **`bg-gray-900/80`** - Sets background to gray-900 with 80% opacity

### Background Gradients
- **`bg-gradient-to-b`** - Creates a gradient that fades from top to bottom
- **`from-white`** - Gradient starting color (white)
- **`to-gray-50`** - Gradient ending color (gray-50)
- **`dark:from-gray-950`** - Dark mode gradient starting color
- **`dark:to-gray-900`** - Dark mode gradient ending color

### Opacity
- **`opacity-10`** - Sets opacity to 10%
- **`opacity-50`** - Sets opacity to 50%

---

## Flexbox

### Container Properties
- **`flex`** - Displays element as a flex container
- **`flex-col`** - Direction of flex items is vertical (column)
- **`flex-wrap`** - Allows flex items to wrap to next line
- **`items-center`** - Aligns flex items to center vertically
- **`items-start`** - Aligns flex items to start vertically (top)
- **`justify-between`** - Distributes flex items with space between them
- **`justify-center`** - Centers flex items horizontally

### Item Properties
- **`gap-2`** - Gap of 0.5rem (8px) between flex items
- **`gap-3`** - Gap of 0.75rem (12px) between flex items
- **`gap-4`** - Gap of 1rem (16px) between flex items

---

## Grid Layout

### Container Properties
- **`grid`** - Displays element as a grid container
- **`grid-cols-1`** - Creates a grid with 1 column
- **`md:grid-cols-2`** - Creates 2 columns on medium screens and up
- **`lg:grid-cols-3`** - Creates 3 columns on large screens and up

### Item Properties
- **`gap-6`** - Gap of 1.5rem (24px) between grid items
- **`gap-8`** - Gap of 2rem (32px) between grid items

---

## Borders

### Border Width
- **`border`** - Sets border width to 1px on all sides
- **`border-b`** - Sets border width to 1px on bottom side
- **`border-t`** - Sets border width to 1px on top side

### Border Colors (Light)
- **`border-gray-200`** - Sets border color to gray-200
- **`border-gray-300`** - Sets border color to gray-300
- **`border-gray-700`** - Sets border color to gray-700
- **`border-gray-800`** - Sets border color to gray-800

### Border Colors (Dark)
- **`dark:border-gray-800`** - Sets border color to gray-800 in dark mode
- **`dark:border-gray-700`** - Sets border color to gray-700 in dark mode

### Rounded Corners
- **`rounded-lg`** - Applies border-radius of 0.5rem (8px)
- **`rounded-full`** - Applies full border-radius (circle/ellipse)

---

## Shadows

### Shadow Effects
- **`shadow-lg`** - Applies large shadow
- **`shadow`** - Applies default shadow
- **`shadow-xl`** - Applies extra large shadow

### Shadows (Dark Mode)
- **`dark:shadow-gray-800`** - Shadow with gray-800 color in dark mode

---

## Effects (Transitions & Transforms)

### Transitions
- **`transition-colors`** - Animates color changes (200ms by default)
- **`transition-all`** - Animates all transitionable properties
- **`transition-transform`** - Animates transform changes
- **`transition-shadow`** - Animates shadow changes
- **`duration-300`** - Sets transition duration to 300ms
- **`duration-200`** - Sets transition duration to 200ms

### Transforms
- **`group-hover:scale-110`** - Scales element to 110% on group hover
- **`group-hover:scale-105`** - Scales element to 105% on group hover

### Blur Effects
- **`backdrop-blur-sm`** - Applies small backdrop blur (4px)

---

## Display & Visibility

### Display Modes
- **`hidden`** - Sets display to none (element removed from layout)
- **`block`** - Sets display to block (takes full width)
- **`inline-flex`** - Displays element as inline-level flex container
- **`flex`** - Displays element as block-level flex container

### Overflow
- **`overflow-hidden`** - Hides content that overflows the element's box
- **`overflow-clip`** - Alternative to overflow-hidden (clip mode)

---

## Responsive Design

### Breakpoints
- **`sm:`** - Small screens (640px and up)
- **`md:`** - Medium screens (768px and up)
- **`lg:`** - Large screens (1024px and up)
- **`xl:`** - Extra large screens (1280px and up)
- **`2xl:`** - 2X large screens (1536px and up)

### Responsive Examples
- **`md:py-32`** - Applies py-32 padding on medium screens and up
- **`md:text-5xl`** - Applies text-5xl font size on medium screens and up
- **`lg:grid-cols-3`** - Applies 3-column grid on large screens and up
- **`md:grid-cols-2`** - Applies 2-column grid on medium screens and up
- **`md:flex`** - Shows flexbox on medium screens and up
- **`md:hidden`** - Hides element on medium screens and up
- **`md:flex items-center`** - Flex layout with centered items on medium screens and up
- **`hidden md:flex`** - Hidden on small screens, flex on medium screens and up

---

## Dark Mode

### Dark Mode Prefix
- **`dark:`** - Prefix for dark mode styles

### Dark Mode Examples
- **`dark:text-white`** - White text color in dark mode
- **`dark:text-gray-300`** - Gray-300 text color in dark mode
- **`dark:text-gray-400`** - Gray-400 text color in dark mode
- **`dark:bg-gray-900`** - Gray-900 background in dark mode
- **`dark:bg-gray-950`** - Gray-950 background in dark mode
- **`dark:bg-gray-800`** - Gray-800 background in dark mode
- **`dark:bg-gray-700`** - Gray-700 background in dark mode
- **`dark:bg-gray-800`** - Gray-800 background in dark mode
- **`dark:border-gray-800`** - Gray-800 border color in dark mode
- **`dark:border-gray-700`** - Gray-700 border color in dark mode
- **`dark:hover:bg-gray-800`** - Dark gray-800 background on hover in dark mode
- **`dark:hover:bg-gray-700`** - Dark gray-700 background on hover in dark mode
- **`dark:hover:bg-gray-800`** - Dark gray-800 background on hover in dark mode
- **`dark:bg-amber-900/30`** - Semi-transparent amber-900 background in dark mode
- **`dark:bg-blue-900/30`** - Semi-transparent blue-900 background in dark mode

---

## Interactive States

### Hover States
- **`hover:bg-brand-600`** - Changes background to brand-600 on hover
- **`hover:text-brand-500`** - Changes text color to brand-500 on hover
- **`hover:text-brand-600`** - Changes text color to brand-600 on hover
- **`hover:bg-gray-100`** - Changes background to gray-100 on hover
- **`hover:bg-gray-300`** - Changes background to gray-300 on hover
- **`hover:bg-gray-800`** - Changes background to gray-800 on hover
- **`hover:shadow-lg`** - Applies large shadow on hover
- **`hover:text-blue-500`** - Changes text color to blue-500 on hover

### Focus States
- **`focus-visible:ring-2`** - Applies 2px ring on focus-visible
- **`focus-visible:ring-brand-500`** - Applies brand-500 ring on focus-visible
- **`focus-visible:ring-gray-500`** - Applies gray-500 ring on focus-visible
- **`focus-visible:ring-offset-2`** - Offsets ring by 2px on focus-visible
- **`focus:ring-2`** - Applies 2px ring on focus
- **`focus:ring-brand-500`** - Applies brand-500 ring on focus
- **`focus:border-transparent`** - Makes border transparent on focus

### Disabled State
- **`disabled:opacity-50`** - Sets opacity to 50% when disabled
- **`disabled:cursor-not-allowed`** - Changes cursor to not-allowed when disabled

### Active States
- **`active:bg-brand-700`** - Applies brand-700 background when element is active (pressed)

---

## Custom/Brand Colors

### Brand Color Scale
The project uses a custom `brand` color palette defined in tailwind.config.js:
- **`bg-brand-50`** - Lightest brand color (background tint)
- **`bg-brand-100`** - Very light brand color
- **`bg-brand-500`** - Primary brand color (blue-500: #0ea5e9)
- **`bg-brand-600`** - Darker brand color
- **`bg-brand-700`** - Even darker brand color
- **`bg-brand-900`** - Very dark brand color
- **`bg-brand-950`** - Darkest brand color
- **`bg-brand-900/30`** - Semi-transparent dark brand color

### Usage Examples
- **`text-brand-500`** - Primary brand text color
- **`text-brand-600`** - Darker brand text color
- **`text-brand-400`** - Lighter brand text color
- **`hover:bg-brand-600`** - Brand background on hover
- **`hover:text-brand-500`** - Brand text color on hover
- **`hover:text-brand-600`** - Darker brand text color on hover
- **`focus-visible:ring-brand-500`** - Brand ring color on focus
- **`focus:ring-brand-500`** - Brand ring color on focus
- **`border-brand-500`** - Brand border color

---

## Other Utilities

### Antialiasing
- **`antialiased`** - Enables font antialiasing for smoother text

### Group Utilities
- **`group`** - Defines a parent group for group-hover states
- **`group-hover:** - Prefix for styles that apply when parent group is hovered

### Position & Layout
- **`fixed`** - Positions element relative to viewport
- **`rtl:space-x-reverse`** - Reverses horizontal spacing in RTL (right-to-left) layouts

### Accessibility
- **`aria-hidden="true"`** - Hides element from screen readers (used in Icon component)
- **`aria-label`** - Provides accessible label for interactive elements

### Font Display
- **`font-display`** - CSS property that controls font loading behavior

---

## Usage Examples from the Project

### Header Component
```tsx
<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
```
- Sticky positioning at top
- High z-index for layering
- Responsive border and background
- Dark mode support
- Backdrop blur effect

### Button Component
```tsx
className={`${baseStyles} ${varients[varient]} ${sizes[size]} ${className}`}
```
Variants:
- `primary`: `bg-brand-500 text-white hover:bg-brand-600`
- `secondary`: `bg-gray-200 text-gray-900 hover:bg-gray-300`
- `ghost`: `bg-transparent text-gray-700 hover:bg-gray-100`

### Container Component
```tsx
<Component className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
```
- Centered horizontally
- Responsive padding
- Maximum width constraint

### Flexbox Layout
```tsx
<div className="flex flex-wrap gap-4">
```
- Flexible layout
- Wrapping enabled
- Gapped spacing

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```
- Responsive grid
- 1 column mobile, 2 tablet, 3 desktop
- Gapped spacing

---

## Best Practices Demonstrated

1. **Consistent Spacing**: Using consistent spacing scale (4, 6, 8, 12, etc.)
2. **Dark Mode First**: All components support dark mode
3. **Responsive Design**: Mobile-first approach with sm, md, lg, xl breakpoints
4. **Component Variants**: Button component shows variant pattern
5. **State Management**: Hover, focus, and active states for interactivity
6. **Accessibility**: Proper aria-labels and semantic HTML
7. **Performance**: Using efficient utility classes
8. **Reusability**: Custom brand colors for consistency

---

## Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com/) - Interactive playground
- [Tailwind CSS Cheat Sheet](https://tailwindcss.com/cheat-sheet)

---

**Note**: This tutorial is generated from the actual Tailwind classes used in the portfolio project. It serves as a quick reference for understanding and utilizing the Tailwind utilities in this codebase.
