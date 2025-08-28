---
applyTo: "src/**/*.test.tsx,src/**/use*.test.ts"
---

- Use `vi.mock` to mock external dependencies in tests.
    - Do not use top level variables directly for mocking; Use `vi.hoisted()` instead.
- If the name of test target file starts with `use`, use `renderHook` to test custom hooks.
