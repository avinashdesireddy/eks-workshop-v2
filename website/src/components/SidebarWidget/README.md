# SidebarWidget Component

A React component for the EKS Workshop website that allows users to open external URLs in a sidebar overlay, enabling side-by-side work with documentation and external resources.

## Features

- **Sidebar Overlay**: Opens content in a floating sidebar that doesn't navigate away from the current page
- **Resizable**: Toggle between normal and expanded view
- **External Link**: Option to open content in a new browser tab
- **Responsive**: Automatically adapts to mobile screens
- **Dark Mode**: Full support for Docusaurus dark theme
- **Secure**: Uses iframe sandbox attributes for security

## Usage

### In MDX/Markdown Files

```jsx
<SidebarWidget 
  url="https://kubernetes.io/docs/concepts/" 
  title="Kubernetes Documentation" 
  width="500px"
  height="700px"
/>
```

### In React Components

```jsx
import SidebarWidget from '@site/src/components/SidebarWidget';

function MyComponent() {
  return (
    <SidebarWidget 
      url="https://example.com"
      title="Example Site"
      width="400px"
      height="600px"
    />
  );
}
```

## Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `url` | string | - | ✅ | The URL to display in the sidebar |
| `title` | string | "External Content" | ❌ | Display title for the widget |
| `width` | string | "400px" | ❌ | Width of the sidebar in normal view |
| `height` | string | "600px" | ❌ | Height of the sidebar in normal view |

## Styling

The component uses SCSS modules and CSS custom properties for theming. It automatically adapts to:

- Docusaurus light/dark themes
- Mobile responsive breakpoints
- Custom CSS variables from the site theme

## Security

The iframe uses the following sandbox attributes for security:
- `allow-scripts`: Allows JavaScript execution
- `allow-same-origin`: Allows same-origin requests
- `allow-forms`: Allows form submissions
- `allow-popups`: Allows popups
- `allow-popups-to-escape-sandbox`: Allows popups to escape sandbox

## Browser Compatibility

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for tablets and mobile devices

## Development

The component is built with:
- React 18+
- FontAwesome icons
- SCSS for styling
- Docusaurus theming system