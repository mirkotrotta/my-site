# GlobalContainer Component

A reusable container component that enforces consistent horizontal padding and margin across all pages, from mobile to ultra-wide monitors.

## Features

- Responsive padding that scales with screen size
- Configurable max-width constraints
- Option to use as a fluid container (no max-width)
- Ability to render as any HTML element (div, section, article, etc.)
- Compatible with existing layout components

## Usage

```tsx
import GlobalContainer from "@/components/ui/GlobalContainer";

// Basic usage
<GlobalContainer>
  <p>Content with consistent padding on all screen sizes</p>
</GlobalContainer>

// With additional classes
<GlobalContainer className="py-8 bg-gray-100">
  <p>Container with extra spacing and background</p>
</GlobalContainer>

// As a fluid container (no max-width constraints)
<GlobalContainer fluid>
  <p>Full-width container that still maintains consistent padding</p>
</GlobalContainer>

// Using a different HTML element
<GlobalContainer as="section">
  <p>This renders as a section element instead of a div</p>
</GlobalContainer>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to be wrapped by the container |
| className | string | "" | Additional CSS classes to apply to the container |
| as | ElementType | "div" | HTML element to render the container as |
| fluid | boolean | false | Whether to use max-width constraints (false) or full width (true) |

## Responsive Behavior

The GlobalContainer component adapts to different screen sizes with the following responsive behavior:

| Breakpoint | Screen Size | Padding | Max Width (non-fluid) |
|------------|-------------|---------|--------------|
| Default (xs) | < 640px | 1rem (16px) | 640px |
| sm | ≥ 640px | 1.5rem (24px) | 768px |
| md | ≥ 768px | 2rem (32px) | 1024px |
| lg | ≥ 1024px | 3rem (48px) | 1280px |
| xl | ≥ 1280px | 3rem (48px) | 1536px |
| 2xl | ≥ 1536px | 3rem (48px) | 1536px |

## Integration with Layout

The GlobalContainer component is designed to work seamlessly with the existing Layout component. It has been integrated into the header, main content area, and footer to provide consistent padding throughout the site.

## Test Page

There is a test page available at `/container-test` that demonstrates the various configurations of the GlobalContainer component across different screen sizes.

## Implementation Notes

- The component uses Tailwind's built-in responsive classes for padding and max-width
- For screens larger than 2xl (1536px), the container will center its content with increasing margins
- Fluid containers will always extend to the full width of the viewport minus padding 