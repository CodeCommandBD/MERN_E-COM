const criticalCss = `
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.606 0.25 292.717);
  --primary-foreground: oklch(0.969 0.016 293.756);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --border: oklch(0.92 0.004 286.32);
  --ring: oklch(0.606 0.25 292.717);
  --radius: 0.65rem;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: "Assistant", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea,
select {
  font: inherit;
}
`;

export default criticalCss;
