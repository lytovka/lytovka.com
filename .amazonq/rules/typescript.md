# TypeScript Best Practices

## Type Safety

- Enable strict mode in tsconfig.json
- Avoid using `any` type - use `unknown` or proper types instead
- Never use type assertions (`as`) unless absolutely necessary
- Use type guards to narrow types safely
- Prefer interfaces over type aliases for object shapes

## Type Handling

- Handle union types explicitly (e.g., `string | string[]` from router params)
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safe property access
- Validate data before using it, especially from external sources
- Use discriminated unions for complex state management

## Function Types

- Always specify return types for exported functions
- Use proper typing for async functions (Promise<T>)
- Avoid function overloads unless necessary
- Use generics for reusable type-safe functions

## React Specific

- Type component props with interfaces
- Use proper typing for hooks (useState<T>, useRef<T>)
- Type event handlers correctly
- Use React.FC sparingly - prefer explicit prop typing

## API and Data

- Define interfaces for API request/response types
- Validate and transform API data at boundaries
- Use type guards for runtime type checking
- Never trust external data types without validation

## Best Practices

- Use const assertions for literal types
- Leverage TypeScript's utility types (Partial, Pick, Omit, etc.)
- Keep types close to where they're used
- Export types that are used across multiple files
- Use enums sparingly - prefer union types or const objects
