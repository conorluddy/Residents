
This file provides guidance to LLM/AI Agents when working with code in this repository.

## Project Overview

Residents is a production-ready TypeScript backend API framework designed as a foundational user management system. It's a "batteries-included" authentication and user management starter that can be used as a standalone API or published as an NPM package.

**Tech Stack:**
- Express 5 with TypeScript (strict mode)
- PostgreSQL with Drizzle ORM
- JWT + Passport.js authentication
- SendGrid for email
- Docker for containerization

## Essential Commands

### Development
```bash
npm run dev          # Start development server with hot reload
npm test            # Run Jest tests
npm run lint        # ESLint checking
npm run prettier    # Format code
npm run typecoverage # Check type coverage (must be ≥90%)
```

### Database Management
```bash
npm run dockerup    # Start PostgreSQL container
npm run push        # Push schema to database (development)
npm run migrate     # Run production migrations
npm run studio      # Open Drizzle Studio GUI
npm run seed        # Seed test users
npm run seed:owner  # Create initial admin user
```

### Build & Deploy
```bash
npm run build       # Compile TypeScript to dist/
npm start          # Run production server (requires build)
docker-compose up  # Run full stack with database
```

### Testing
```bash
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## Architecture & Code Organization

### Service Pattern
All business logic is centralized in `/src/services/index.ts` which exports a single `SERVICES` object. Controllers should be thin and delegate to services:

```typescript
// ✅ Good - Controller delegates to service
const user = await SERVICES.getUserById(userId)

// ❌ Bad - Business logic in controller
const user = await db.query.users.findFirst({...})
```

### Error Handling
Use custom error classes from `/src/errors/`:
- `ValidationError` - 400 Bad Request
- `UnauthorizedError` - 401 Unauthorized
- `ForbiddenError` - 403 Forbidden
- `NotFoundError` - 404 Not Found
- `ConflictError` - 409 Conflict

Errors automatically propagate to the centralized error handler middleware.

### Database Schema
Core tables in `/src/db/schema/`:
- `users` - User accounts with role/status enums
- `tokens` - Multi-purpose tokens (refresh, magic, reset, validation)
- `user_meta` - Extensible user metadata
- `federated_credentials` - Social auth providers

Uses CUID2 for IDs, soft delete via `deleted_at`, and PostgreSQL enums for type safety.

### Authentication Flow
1. JWT access tokens (15 min) stored in cookies
2. Refresh tokens (7 days) stored in database
3. XSRF protection for state-changing operations
4. Support for local auth, Google OAuth, and magic links

### Testing Patterns
Tests are co-located with source files (`.test.ts`):
```bash
src/services/index.ts       # Service implementation
src/services/index.test.ts  # Unit tests
```

Mock the SERVICES object for testing:
```typescript
jest.mock('../services', () => ({
  SERVICES: { getUserById: jest.fn() }
}))
```

## Key Implementation Details

### Role-Based Access Control (RBAC)
Hierarchical roles in `/src/utils/rbac.ts`:
- `superadmin` > `admin` > `moderator` > `member` > `user`

Use RBAC middleware to protect routes:
```typescript
router.delete('/:id', 
  authenticate,
  rbacDeleteUser,  // Checks role hierarchy
  deleteUser
)
```

### Token Types
Different token purposes with specific expiration:
- `access` - JWT authentication (15 min)
- `refresh` - Token refresh (7 days)
- `magic` - Magic link login (10 min)
- `reset` - Password reset (1 hour)
- `validation` - Email verification (24 hours)

### Environment Configuration
Required `.env` variables:
```bash
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET           # JWT signing secret
SENDGRID_API_KEY     # Email service (optional)
GOOGLE_CLIENT_ID     # Google OAuth (optional)
GOOGLE_CLIENT_SECRET # Google OAuth (optional)
```

See `.env.example` for all configuration options including token expiration times.

### API Response Format
Consistent response structure:
```typescript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "Error message" }
```

## Development Workflow

1. **Before starting:** Run `npm run dockerup` to start PostgreSQL
2. **Initialize database:** Run `npm run push` to create schema
3. **Seed data:** Run `npm run seed` for test users
4. **Start development:** Run `npm run dev`
5. **Before committing:** Ensure `npm run lint` and `npm test` pass


## Code Style
- **TypeScript**: Strict mode, explicit return types required (`@typescript-eslint/explicit-function-return-type`)
- **Imports**: Absolute paths from src/, group by: external libs, internal modules, types
- **Formatting**: Single quotes, no semicolons, 2-space indent, 120 char line width
- **Naming**: camelCase for variables/functions, PascalCase for classes/types, UPPER_SNAKE_CASE for constants
- **Error handling**: Custom error classes with statusCode property (BadRequestError, ValidationError, etc.)
- **Types**: No `any` allowed, use proper interfaces, leverage strict TypeScript
- **Functions**: Async/await preferred, explicit return types, validate inputs early
- **Files**: Controllers in `/controllers`, services in `/services`, middleware patterns
- **Tests**: Jest with `.test.ts` suffix, 90%+ coverage required, mock external dependencies, test edge cases
- **TypeScript:** Strict mode, no `any` types, explicit return types
- **Services:** All business logic in services, not controllers
- **Errors:** Use custom error classes, not generic errors
- **Database:** Use Drizzle ORM methods, not raw SQL
- **Security:** Never log sensitive data, use parameterized queries

## Common Tasks

### Adding a New Endpoint
1. Define route in `/src/routes/`
2. Create controller in `/src/controllers/`
3. Implement business logic in `/src/services/index.ts`
4. Add validation middleware if needed
5. Write unit tests for service methods
6. Update Postman collection

### Adding Social Auth Provider
1. Install passport strategy package
2. Configure in `/src/passport/`
3. Add provider credentials to `.env`
4. Create auth routes in `/src/routes/auth.ts`
5. Update `federated_credentials` table if needed

### Modifying Database Schema
1. Update schema in `/src/db/schema/`
2. Run `npm run generate` to create migration
3. Run `npm run push` (dev) or `npm run migrate` (prod)
4. Update related services and types

## Important Notes

- **Express 5:** Using cutting-edge Express 5, some middleware may need updates
- **Type Coverage:** Must maintain ≥90% type coverage (enforced by pre-commit)
- **NEVER push to main:** Always create feature branches and PRs
- **Tests required:** All new features must include tests
- **Security first:** Follow OWASP best practices for authentication

