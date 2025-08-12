---
applyTo: "src/**/*.test.tsx,src/**/use*.test.ts"
---

- Use `vi.mock` to mock external dependencies in tests.
- Do not use top level variables for mocking; use `beforeAll`, `beforeEach` or `afterEach` to set up mocks.
- If the name of test target file starts with `use`, use `renderHook` from `@testing-library/react-hooks` to test custom hooks.
