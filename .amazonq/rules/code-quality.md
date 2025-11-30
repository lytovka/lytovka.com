# Miscellaneous Rules

## String Formatting

- For any string formatting make sure you use an existing formatter from formatters.ts before you make a new one

## Code Organization

- Keep functions small and focused on a single responsibility
- Extract reusable logic into utility functions
- Avoid deep nesting - prefer early returns and guard clauses
- Group related code together

## React Hooks

- Always call hooks at the top level of components, never inside callbacks or conditionals
- Use meaningful names for custom hooks (prefix with "use")
- Keep hook dependencies arrays accurate to avoid stale closures

## Error Handling

- Handle errors gracefully with user-friendly messages
- Use try-catch for async operations
- Validate user input before processing
- Log errors for debugging but don't expose sensitive information

## Code Quality

- Write self-documenting code with clear variable and function names
- Remove unused imports, variables, and code
- Keep files focused - split large files into smaller modules
- Prefer composition over inheritance

## Constants and Magic Numbers

- Extract magic numbers and strings into named constants
- Use existing constants from shared files before creating new ones
- Group related constants together
