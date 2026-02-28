# Code Style

> Context is finite. Every token competes for limited attention. Maximize signal, minimize noise. Write for humans with limited working memory and AI agents with bounded context windows.

## Philosophy

- **Progressive Disclosure**: Layer code so readers grasp high-level flow immediately, drilling into details only when needed. Files answer "what is this?" in the first 10 lines. Types → public API → private helpers, always in that order.
- **Self-Documenting**: Names eliminate need for comments. Comments explain "why," never "what."
- **Aggressive Minimalism**: Simplest correct solution. No speculative abstractions.
- **AHA Over DRY**: Avoid Hasty Abstractions. Wait for the 3rd duplication before extracting. The wrong abstraction is worse than duplication.

## Naming

- Be specific: `activeUsers` not `users`, `httpTimeoutMs` not `timeout`
- Include units: `delayMs`, `maxRetries`
- No abbreviations: `customer` not `cust`, `configuration` not `cfg`
- Use domain language over technical abstractions
- Boolean prefixes: `isValid`, `hasPermission`, `canEdit`, `shouldRetry`
- Verbs for functions: `validateEmailFormat()` not `checkEmail()`

## Functions

- Single responsibility, describable in one sentence
- All dependencies as parameters — no hidden global state
- Type everything — strict mode, no `any`
- Guard clauses over nesting — handle edge cases first, keep happy path unindented
- 50-line guideline — not a hard limit, but a refactoring trigger
- Self-contained context units — comprehensible without reading other files

## Error Handling

- Use `Result<T, E>` types for expected failures (API calls, I/O, validation). Reserve exceptions for truly unrecoverable situations.
- Use branded types (`ValidatedEmail`, `UserId`) to validate at boundaries and carry proof through the type system.
- Never silently swallow errors — log or propagate.
- Fail fast at boundaries — validate inputs immediately.
- Provide actionable messages: what failed, expected vs actual, how to fix.

## File & Module Organisation

- Group by feature/domain, not file type: `authentication/`, `orders/`, `payments/`
- Public API first, helpers at bottom. One major export per file.
- Co-locate tests: `UserService.test.ts` next to `UserService.ts`
- 300-line guideline per file — refactoring trigger, not hard limit.
- Minimal cross-module dependencies — each module is a clean context boundary.
- Use section comments (`// === PUBLIC API ===`) to create visual hierarchy in files.

## Testing

- Testing trophy: mostly integration tests. Static analysis → unit → integration (widest) → E2E (critical journeys only).
- Test behaviour, not implementation. One concept per test.
- Test names describe scenarios: `test('user can add items to cart')`
- 80% coverage minimum, focused on critical paths.

## Observability

- Structured logging only — JSON with `request_id`, `user_id`, `duration_ms`, entity IDs.
- Log at critical boundaries: external APIs, database ops, auth decisions, errors.
- One structured event per operation — derive metrics, logs, and traces from the same data.

## Agentic Patterns

- **Idempotent operations**: Use `ensure*` patterns. Every mutation must be safely repeatable.
- **Explicit state machines**: Model distinct phases as discriminated unions, not implicit flags.
- **Machine-parseable errors**: Discriminated unions with `code`, `message`, `retryable` fields. Agents need structured errors, not just strings.
- **Atomic changes**: Each function/commit independently testable and verifiable without understanding the entire system.
- **Convention over configuration**: Consistent naming (`*.test.ts`, `*.types.ts`), predictable directory structure, standard CRUD patterns. Reduce the search space.
- **Contract-first design**: Define types before implementation. Types are the cheapest documentation — an agent reading types understands data flow without reading function bodies.
- **Observable side effects**: Mutations return `{ data, changes[], warnings[] }` so agents can verify their actions.

## Context Optimisation

Every token your code consumes in an agent's context window is a token it can't use for reasoning.

- **Semantic compression**: Consolidate related tools/functions behind single dispatchers that route by intent. N granular tools → 1 dispatcher = massive token savings.
- **Layered context loading**: Summaries first, drill-down on demand. Never dump full project state upfront.
- **Token-aware docs**: Dense and scannable. No filler prose. `"JWT auth with refresh rotation"` not `"The authentication module is responsible for handling all aspects of user authentication within our application."`
- **Structured output**: Functions consumed by agents return typed objects, not human-readable prose strings.
- **Context boundaries as architecture**: Design modules so an agent can work within one module without loading adjacent modules. Co-locate types, minimise cross-module imports.
- **Paginate by default**: Any function that could return large result sets supports `limit`/`offset`.

## Project Navigation

- **CLAUDE.md at root**: Entry points, key patterns, common tasks. Under 200 lines.
- **README.md per major module**: Purpose, key decisions, gotchas.
- **Progressive context hierarchy**: Root README → module README → section comments → function docs → inline "why" comments. Each level self-sufficient.

## Anti-Patterns

Premature optimisation, hasty abstractions, clever code, silent failures, vague interfaces (`any`), hidden dependencies, nested conditionals, comments describing "what," premature generalisation, token bloat, inverted file disclosure, flat files without hierarchy, leaky context boundaries, eager context loading.

## Checklist

- [ ] Minimal code solving the stated problem?
- [ ] Understandable without extensive surrounding context?
- [ ] Errors handled with actionable messages?
- [ ] Names clear, specific, unambiguous?
- [ ] Single responsibility per function?
- [ ] Explicit dependencies, no hidden state?
- [ ] Critical paths tested?
- [ ] Idempotent where applicable?
- [ ] Types define contracts before implementation?
- [ ] Module works independently without loading siblings?
- [ ] Public API scannable in under 50 lines?
- [ ] Documentation token-dense, no filler?
- [ ] File follows progressive disclosure (types → API → helpers)?
