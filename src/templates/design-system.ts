import { Project } from '@/types/project';

/**
 * Generates a .claude/skills/design-guide/SKILL.md — a machine-readable
 * design system specification that AI agents load when building UI.
 *
 * Inspired by Paperclip's design guide skill pattern: instead of burying
 * design rules inside CLAUDE.md, this is a standalone skill file that
 * agents load specifically when working on UI tasks.
 *
 * The skill format uses YAML frontmatter for metadata (compatible with
 * Claude Code's .claude/skills/ convention) followed by full design
 * system documentation.
 */
export function generateDesignSystemSkill(project: Project): string {
  const uiLib = project.stack.ui || 'shadcn/ui + Tailwind CSS';
  const framework = project.stack.framework || 'React';

  return `---
name: design-guide
description: >
  ${project.name} UI design system guide for building consistent, reusable
  frontend components. Use when creating new UI components, modifying
  existing ones, adding pages or features, or styling UI elements.
  Covers: design principles, tokens, typography, component hierarchy,
  composition patterns, layout system, and interactive patterns.
---

# ${project.name} Design Guide

${project.name}'s UI is a professional-grade application — clean, functional, and consistent. Every component follows these conventions.

---

## 1. Design Principles

- **Clean and functional.** Information-dense where needed, spacious where not. Whitespace separates logical groups.
- **Consistent patterns.** Same interaction = same component. Users learn the pattern once, apply it everywhere.
- **Accessible by default.** Semantic HTML, keyboard navigation, focus indicators, screen reader support.
- **Mobile-responsive.** Desktop-first design with graceful mobile adaptation. Touch targets >= 44px on mobile.
- **Component-driven.** Prefer reusable components over one-off styles. Build at the right abstraction level.

---

## 2. Tech Stack

- **${framework}** + **TypeScript** + **Vite**
- **Tailwind CSS** with CSS variables
- **${uiLib}** (component library)
- **Radix UI** primitives (accessibility, focus management)
- **Lucide React** icons (16px nav, 14px inline)
- **clsx + tailwind-merge** via \`cn()\` utility

---

## 3. Design Tokens

Use semantic token names from your Tailwind/CSS config. Never use raw color values.

### Colors

| Token | Usage |
|-------|-------|
| \`--background\` / \`--foreground\` | Page background and primary text |
| \`--card\` / \`--card-foreground\` | Card surfaces |
| \`--primary\` / \`--primary-foreground\` | Primary actions, emphasis |
| \`--secondary\` / \`--secondary-foreground\` | Secondary surfaces |
| \`--muted\` / \`--muted-foreground\` | Subdued text, labels, descriptions |
| \`--accent\` / \`--accent-foreground\` | Hover states, active navigation |
| \`--destructive\` | Destructive actions (delete, remove) |
| \`--border\` | All borders |
| \`--ring\` | Focus rings |

### Radius

- \`rounded-sm\` — small inputs, pills, badges
- \`rounded-md\` — buttons, inputs, small components
- \`rounded-lg\` — cards, dialogs
- \`rounded-xl\` — large card containers
- \`rounded-full\` — avatars, status dots

### Shadows

Minimal: \`shadow-sm\` for cards, \`shadow-xs\` for outline buttons. No heavy shadows.

---

## 4. Typography Scale

Use these exact patterns — do not invent new ones:

| Pattern | Classes | Usage |
|---------|---------|-------|
| Page title | \`text-xl font-bold\` | Top of pages |
| Section title | \`text-lg font-semibold\` | Major sections |
| Section label | \`text-sm font-semibold text-muted-foreground uppercase tracking-wide\` | Section headers |
| Card title | \`text-sm font-medium\` | Card headers, list item titles |
| Body | \`text-sm\` | Default body text |
| Muted | \`text-sm text-muted-foreground\` | Descriptions, secondary text |
| Tiny label | \`text-xs text-muted-foreground\` | Metadata, timestamps |
| Mono | \`text-xs font-mono text-muted-foreground\` | IDs, codes, technical values |
| Large stat | \`text-2xl font-bold\` | Dashboard metric values |

---

## 5. Status System

Use consistent colors for status indicators across the entire application:

| Status | Color | Usage |
|--------|-------|-------|
| Active / Completed / Success | Green | Positive states |
| In Progress / Running | Blue/Cyan | Active states |
| Pending / Idle | Yellow/Amber | Waiting states |
| Warning / Paused | Orange | Attention states |
| Error / Blocked / Failed | Red | Negative states |
| Archived / Cancelled | Gray | Inactive states |

Always use \`Badge\` component with consistent variant mapping. Never hardcode status colors.

---

## 6. Component Hierarchy

Three tiers:

1. **UI Primitives** (\`src/components/ui/\`) — Button, Card, Input, Badge, Dialog, Tabs, etc. Do not modify directly; extend via composition.
2. **Domain Components** (\`src/components/\`) — App-specific composites that capture domain logic (StatusBadge, EntityCard, MetricCard).
3. **Page Components** (\`src/pages/\`) — Compose primitives and domain components into full views.

### When to Create a New Component

Create a reusable component when:
- The same visual pattern appears in 2+ places
- The pattern has interactive behavior (status changing, inline editing)
- The pattern encodes domain logic (status colors, priority icons)

Do NOT create a component for:
- One-off layouts specific to a single page
- Simple className combinations (use Tailwind directly)
- Thin wrappers that add no semantic value

---

## 7. Composition Patterns

### List Item with Actions

\`\`\`tsx
<div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
  <div className="flex items-center gap-3">
    <StatusIcon status={item.status} />
    <div>
      <p className="text-sm font-medium">{item.title}</p>
      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Badge variant={statusVariant}>{item.status}</Badge>
    <Button variant="ghost" size="sm">Edit</Button>
  </div>
</div>
\`\`\`

### Metric Card Grid

\`\`\`tsx
<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-muted-foreground">Total Items</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">1,234</p>
      <p className="text-xs text-muted-foreground">+12% from last month</p>
    </CardContent>
  </Card>
</div>
\`\`\`

### Property Grid

\`\`\`tsx
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground">Status</span>
    <Badge>{item.status}</Badge>
  </div>
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground">Created</span>
    <span className="text-sm">{formatDate(item.createdAt)}</span>
  </div>
</div>
\`\`\`

### Empty State

\`\`\`tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <Icon className="h-12 w-12 text-muted-foreground/40" />
  <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
  <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first item.</p>
  <Button className="mt-4">Create Item</Button>
</div>
\`\`\`

---

## 8. Layout System

Standard page layout:

\`\`\`
┌──────────┬─────────────────────────────────────┐
│ Sidebar  │  Header / Breadcrumbs               │
│ (nav)    ├─────────────────────────────────────┤
│          │  Page Content (scrollable)           │
│          │                                     │
└──────────┴─────────────────────────────────────┘
\`\`\`

- **Sidebar**: Navigation with icons, collapsible on mobile
- **Header**: Page title, breadcrumbs, primary action button
- **Content**: Scrollable main area, max-width container for readability

### Page Structure Template

\`\`\`tsx
<div className="space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-xl font-bold">Page Title</h1>
      <p className="text-sm text-muted-foreground">Page description</p>
    </div>
    <Button>Primary Action</Button>
  </div>

  {/* Filters */}
  <div className="flex items-center gap-2">
    {/* Filter controls */}
  </div>

  {/* Content */}
  <div className="space-y-4">
    {/* List/grid/detail content */}
  </div>
</div>
\`\`\`

---

## 9. Interactive Patterns

### Hover States

- List items: \`hover:bg-accent/50\`
- Nav items: \`hover:bg-accent/50 hover:text-accent-foreground\`
- Active nav: \`bg-accent text-accent-foreground\`

### Focus

\`focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2\`

### Disabled

\`disabled:opacity-50 disabled:pointer-events-none\`

### Loading

- Skeleton loaders for initial page load
- Spinner for button actions
- Optimistic updates for common mutations

### Error States

- Inline validation errors below form fields
- Toast notifications for action results
- Full-page error boundary with retry button

---

## 10. File Conventions

- **UI primitives:** \`src/components/ui/{component}.tsx\` — lowercase, one component per file
- **Domain components:** \`src/components/{ComponentName}.tsx\` — PascalCase
- **Pages:** \`src/pages/{PageName}.tsx\` — PascalCase
- **Hooks:** \`src/hooks/use{Name}.ts\` — camelCase with \`use\` prefix
- **Utilities:** \`src/lib/{name}.ts\` — kebab-case

All components use \`cn()\` from \`@/lib/utils\` for className merging.

---

## 11. Common Mistakes to Avoid

- Using raw hex/rgb colors instead of CSS variable tokens
- Creating ad-hoc typography styles instead of using the established scale
- Hardcoding status colors instead of using the status system
- Building one-off styled elements when a reusable component exists
- Using \`shadow-md\` or heavier — keep shadows minimal
- Forgetting responsive design — always test at 375px, 768px, 1280px
- Using \`any\` for component props — always type your props interface
- Nesting components more than 3 levels deep — flatten the hierarchy
`;
}
