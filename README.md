
# Backstrap

![Build Status](https://img.shields.io/github/actions/workflow/status/conorluddy/backstrap/main.yml)
![Dependencies](https://img.shields.io/david/conorluddy/backstrap)
![Dev Dependencies](https://img.shields.io/david/dev/conorluddy/backstrap)
![License](https://img.shields.io/github/license/conorluddy/backstrap)
![Version](https://img.shields.io/github/package-json/v/conorluddy/backstrap)
![Coverage](https://img.shields.io/codecov/c/github/conorluddy/backstrap)
![Issues](https://img.shields.io/github/issues/conorluddy/backstrap)
![Forks](https://img.shields.io/github/forks/conorluddy/backstrap)
![Stars](https://img.shields.io/github/stars/conorluddy/backstrap)
![Contributors](https://img.shields.io/github/contributors/conorluddy/backstrap)
![Last Commit](https://img.shields.io/github/last-commit/conorluddy/backstrap)
![Node Version](https://img.shields.io/node/v/your-package-name)
![Docker Pulls](https://img.shields.io/docker/pulls/conorluddy/backstrap)

## Backstrap

Backstrap is a Node.js Express back-end foundation designed for bootstrapping new projects quickly and efficiently. It leverages a robust stack including Postgres, Drizzle ORM, JWT, PassportJS, and Docker to streamline development and deployment processes.

## Features

- **Node.js** and **Express** for building a scalable server-side application.
- **Postgres** for a powerful, open-source relational database.
- **Drizzle ORM** for a type-safe and performant data layer.
- **JWT** and **PassportJS** for secure authentication and authorization.
- **Docker** for containerized development and deployment.

## Getting Started

To get started with Backstrap, follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/conorluddy/backstrap.git
   cd backstrap
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of your project and configure the necessary environment variables.

4. **Run the application:**
   ```sh
   npm start
   ```

## Configuration

Backstrap uses environment variables for configuration. Here is an example `.env` file:

```dotenv
# Node
NODE_ENV=development

# DOCKER
DOCKER_API_PORT=8080
LOCAL_API_PORT=3000

# Postgres
POSTGRES_DB=mydatabase
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_URL=127.0.0.1

# JSON Web Token 
JWT_TOKEN_SECRET=mysecret
JWT_TOKEN_EXPIRY=1day

# Passport
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=XXXX
GOOGLE_CLIENT_API_KEY=XXXX
```

## Scripts

- `npm start` - Start the server
- `npm run build` - Build the app
- `npm test` - Test (not implemented yet)
- `npm run dev` - Local development
- `npm run push` - Pushes updates to DB (See [Drizzle docs](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push), handy for dev)
- `npm run introspect` - Runs drizzle-kit introspect
- `npm run studio` - Runs drizzle-kit studio
- `npm run dockerup` - Or maybe just run `docker-compose up -d` instead

## Contributing

This is just a pet project at the moment but feel free to fork it and run with it if it's of any value to you.

