# Contributing to VibePM

Thank you for your interest in contributing to VibePM! This guide will help you get started.

## Development Setup

```bash
git clone https://github.com/your-org/vibepm.git
cd vibepm
npm install
npm run dev
```

## Project Structure

```
src/
├── pages/          # Route pages
├── components/     # UI components (shadcn/ui based)
├── templates/      # Output file generators
├── hooks/          # React hooks
├── lib/            # Store, AI client, template engine
└── types/          # TypeScript types

supabase/
├── functions/      # Edge functions (Deno)
└── migrations/     # Database schema
```

## How to Contribute

### Reporting Bugs

- Check existing issues first
- Include reproduction steps
- Include browser/OS info
- Include console errors if applicable

### Feature Requests

- Open an issue with the `enhancement` label
- Describe the use case
- Include mockups if applicable

### Pull Requests

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Follow existing code patterns:
   - TypeScript strict (no `any`)
   - shadcn/ui components with Tailwind semantic tokens
   - `react-hook-form` + `zod` for forms
   - TanStack Query for server state
4. Run checks before committing:
   ```bash
   npx tsc --noEmit
   npm run build
   npm run test
   npm run lint
   ```
5. Write descriptive commit messages
6. Push and open a PR

### Template Contributions

Templates in `src/templates/` generate the output framework files. When adding or modifying templates:

- Follow the existing pattern: export a function that takes `Project` and returns a string
- Add the template to `src/lib/generate-from-templates.ts`
- Add tests in `src/test/templates.test.ts`
- Template output should be valid markdown or code

### Edge Function Contributions

Edge functions run on Deno. Keep all code in a single `index.ts` file per function.

## Code Style

- **Components**: Functional React with hooks
- **Styling**: Tailwind CSS with semantic tokens from the design system (never hardcode colors)
- **State**: localStorage for project data, TanStack Query for Supabase data
- **Types**: Strict TypeScript — use `unknown` and narrow, never `any`
- **Naming**: PascalCase for components, camelCase for functions/variables, snake_case for database

## Testing

```bash
npm run test        # Run once
npm run test:watch  # Watch mode
```

Tests use Vitest + React Testing Library + jsdom.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
