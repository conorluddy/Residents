# Residents

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/conorluddy/Residents/ci.yml) [![codecov](https://codecov.io/gh/conorluddy/Residents/branch/main/graph/badge.svg?token=WTHO1C6UL4)](https://codecov.io/gh/conorluddy/Residents) ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fconorluddy%2FResidents%2Fmain%2F.github%2Ftype-coverage.json&query=%24.percentString&suffix=%25&style=flat&logo=typescript&label=TS%20Coverage&color=abff3d)
 ![Last Commit](https://img.shields.io/github/last-commit/conorluddy/Residents) ![License](https://img.shields.io/github/license/conorluddy/Residents) ![Version](https://img.shields.io/github/package-json/v/conorluddy/Residents) 

The goal of this project is to build out a repo that I can reuse as a jump-off point for other applications, where it would provide an initial backend API providing the core components that most apps would need - users, authentication and authorization. Feel free to fork it if it provides you any value, and see details below for a loose roadmap.

**Note: Readme needs updating. Will document this fully when it's stable, soon**

![Residents](https://github.com/user-attachments/assets/7da7ff38-0406-4a07-b2f0-62671213868a)


## Table of Contents

- [Residents](#residents)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Main goals](#main-goals)
    - [Functional](#functional)
    - [Developer Experience](#developer-experience)
      - [Documentation](#documentation)
      - [Containers](#containers)
      - [Postman](#postman)
      - [CI/CD](#cicd)
    - [Robustness](#robustness)
      - [Typing](#typing)
      - [Tests](#tests)
      - [Express Middleware](#express-middleware)
  - [Installation and development](#installation-and-development)
    - [Initialising the Database](#initialising-the-database)
  - [Feature Matrix](#feature-matrix)
  - [Future ideas](#future-ideas)


## Tech Stack

- Server: `Express [V5 - beta]`
- Database: `PostGres` 
- ORM: `Drizzle`
- Authentication: `JSON Web Tokens [JWT]`
- Single/Social Auth: `Passport`
- Email: `Twilio Sendgrid`
- API Documentation: `Swagger`
- Codebase: `Typescript`
- Tests: `Jest` `Supertest`
- Containers: `Docker`
  

## Main goals


### Functional

To provide user-centric features and a super-solid API base as a foundation for future projects. The API should allow for: 

- Users to register a new account
- New accounts to be verifiable via email
- Users to be able to log in with username/email and password
- Users to be able to log in with Google, Apple, etc
- Developers to be able to add additional social logins as desired
- Password to be resettable via email
- Magic login via email 🪄
- Users should be able to log out

Users also need to be managed and manageable, so we also need endpoints for:

- Create User: Used for creating registering accounts.
- Update User: For making changes to existing user data.
- Soft Delete User: Soft delete, adding a deleted_at value to a user account.
- Hard Delete User: For when you really need to GDPR someone.
- Get User(s): Searching / user seeing their own data / admins seeing all users

As well as all of the above, you'll usually need a hierarchy of users, things like moderators and admins, as well as normal users and blocked/suspended users. Many apps don't have any interaction between users, but still need to let them register an account so that they can save data specific to themselves, yet their accounts will still need to be managed by somebody too. We have middleware here that can control who can see/update/delete who, so it's easy to set it up so users can't get other users data, or so that only someone with an Admin role can perform specific actions on users with a lesser role. 

> [!NOTE]
> At the moment the Users also have some "bonus" properties like "Score" and "Referred by", but I want to be careful not to pepper the user model with things they won't need, so I'm probably going to set up a UserMeta table that can be used for whatever additional values might be needed for specific types of apps and keep the core User model as simple as possible.

### Developer Experience

#### Documentation

Swagger spins up alongside the server when you run this, and will provide API documentation for each endpoint. However I haven't got around to actually adding any Swagger docs to any endpoints yet because I'm prioritising functionality and tests first. There's no point documenting endpoints that are still in flux. I'll do it soon. See the feature matrix below for more details. I'll update it as I make progress.

#### Containers

Docker is included in the repo and it will spin up a container with a Postgres database instance and an instance of the app when you run it. This is a bare-minimum implementation and I need to revisit it, but the Dockerised database is very handy for local development.

#### Postman

There's a Postman collection in the postman directory that I've been trying to keep in sync. You can import it into Postman to get set up quickly for playing with the API. Once you register and log in it should save your JWT in the environment and use it for authorising with all of the other endpoints.

<img width="1512" alt="Screenshot 2024-08-04 at 00 09 58" src="https://github.com/user-attachments/assets/1897bf3f-1d1e-4cd1-94a0-e6078f1c436b">


#### CI/CD

There's a Github Action that installs, tests and builds this on Node versions 16, 18, 20 and 22 on each commit. It also runs a code coverage report with CodeCov. It does not get deployed anywhere at the moment. 

### Robustness

#### Typing

The Typescript code should be strongly typed, with no use of `any` or `unknown`. I'm using [this type coverage tool](https://github.com/plantain-00/type-coverage) by @plantain-00 to monitor the use of types across the repo. It runs on a pre-commit hook and generates a lil JSON file that gets stored in the .github directory, where it then uses a dynamic JSON badge from shields.io to show the type coverage at the top of the readme, like this: ![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fconorluddy%2FResidents%2Fmain%2F.github%2Ftype-coverage.json&query=%24.percentString&suffix=%25&style=flat&logo=typescript&label=typed&color=abff3d). Unfortunately it's picking up Express's req and res objects as untyped at the moment, but I want to get it close to 100% when I can.

#### Tests

Test coverage also needs to be extreme so that I have a lot of confidence in the integrity of everything. Until this badge is green I'll be allocating time to improving tests: [![codecov](https://codecov.io/gh/conorluddy/Residents/branch/main/graph/badge.svg?token=WTHO1C6UL4)](https://codecov.io/gh/conorluddy/Residents). Currently it has pretty good coverage across the board, mostly unit tests. I'll fill out integration and end-to-end tests once the API features are checked off.

#### Express Middleware

There's some commonly used middlewares set up in the Express app, such as Helmet and RateLimiter. I'll revisit this again and see what else is worth adding. 


## Installation and development

This is a standard Node/Express app, but you're gonna need a PostGres database to connect to. Start off by installing the node dependencies with:

```
npm install
```

You'll need a `.env` file in the root of your project. There's an example one at `.env.example` that you can copy.

```
cp .env.example .env
```

You'll need to go into that and put in your own bits and pieces, depending on how/where your database is running. You can run PostGres as its own app, or in Docker, or you might have one running in the cloud somewhere like Neon.tech or Vercel. Once you have that set up and have your connection details, throw them into your `.env` file.

If you want to use email (for sending password reset mails etc), you'll need to set up a Sendgrid account and verify an email address. If you want to use Google for logging in you'll have to go and make a Google app and get an API key.
If you want to use some other social account for logging in you'll have to wait or extend this repo to cover your own needs 🚀

I'll add Apple and Microsoft soon. I probably won't add Facebook because I'm not on there anymore and I'm not joining it again to get an API key!


### Initialising the Database 

The NPM scripts have a few shortcuts for this sort of thing, but they're mostly wrappers around [drizzle-kit](https://orm.drizzle.team/kit-docs/overview), which is a toolkit for the Drizzle ORM we're using. Once you have a database up and running you can run

```
npm run push
```

Which will set up your database schema in Postgres. Check out the Drizzle documentation for everything related to migrations and all that fun stuff. 

Then you can run the usual script to get everything moving:

```
npm run dev
```

There's also a seed script that will fill your database with as many Residents as you desire, handy for testing or playing with Postman or whatever. 

```
npm run seed
```

IF you want to run tests, it's `npm run test`. You get the idea. `npm run` by itself will give you a list of all of the available scripts in an NPM managed app - that's a handy one to know too.

For production you'd want to do a `build` and then a `start`, but do so at your own risk 🤭

---

## Feature Matrix

| Endpoint                      | Built | Unit Tests | Integration Tests | SwaggerDocs |
|-------------------------------|-------|------------|-------------------|-------------|
| `POST /auth/login`            | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/logout`           | ✅    | ⛔️         | ⛔️                | ⛔️          |
| `POST /auth/magic-login`      | ⛔️    | ⛔️         | ⛔️                | ⛔️          |
| `POST /auth/magic-login-token`| ⛔️    | ⛔️         | ⛔️                | ⛔️          |
| `POST /auth/reset-password`   | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/refresh`          | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /auth/reset-password-token` | ✅ | ✅         | ⛔️                | ⛔️          |
| `POST /auth/validate-account` | ✅    | ⚠️         | ⛔️                | ⛔️          |
| `GET /auth/google`            | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /auth/google/callback`   | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /users`                  | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /users/:id`              | ✅    | ✅         | ⛔️                | ⛔️          |
| `POST /users`                 | ✅    | ✅         | ⛔️                | ⛔️          |
| `PUT /users/:id`              | ✅    | ✅         | ⛔️                | ⛔️          |
| `DELETE /users/:id`           | ✅    | ✅         | ⛔️                | ⛔️          |
| `GET /users/self`             | ✅    | ✅         | ⛔️                | ⛔️          |


---

## Future ideas

This is the sort of project that started off as a quick little tool, yet the more I work on it the more ideas I get for it. Here's some stuff that might make an appearance once I've completed the core functionality.

- Image service for user images/avatars via S3 or similar.
- User barcodes, for things like Gym entry scanners
- User-to-user messaging / DMs etc
- Notification service for push/app notifications
- Event tracking - who edited who?
- Webhooks for key events
- GDPR related data-request / data-erase
- i18n for any returned strings

But there is a bunch of core features, fixes and refactoring I need to hit up first.

If you got this far, drop a star ⭐️

Thanks for looking! 

