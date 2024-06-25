![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/conorluddy/Residents/ci.yml) ![Last Commit](https://img.shields.io/github/last-commit/conorluddy/Residents) ![License](https://img.shields.io/github/license/conorluddy/Residents) ![Version](https://img.shields.io/github/package-json/v/conorluddy/Residents) 


# Residents

Residents is a Node.js Express back-end foundation designed for bootstrapping new projects quickly and efficiently. Its main goal is to set up a robust infrastructure for user management, because users are the core of any application. These users are your Residents. It leverages a robust stack including Postgres, Drizzle ORM, JWT, PassportJS, Docker and Swagger to streamline development and deployment processes.

## Features

- **Node.js** and **Express** for building a scalable server-side application.
- **Postgres** for a powerful, open-source relational database.
- **Drizzle ORM** for a type-safe and performant data layer.
- **JWT** and **PassportJS** for secure authentication and authorization.
- **Docker** for containerized development and deployment.
- **Swagger** for API documentation.

## Getting Started

To get started with Residents, follow these steps:

1. **Clone the repository:**

```sh
git clone https://github.com/conorluddy/Residents.git
cd Residents
```

2. **Install dependencies:**

```sh
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root of your project and configure the necessary environment variables. You can run `cp .env.example .env` for a shortcut. You'll want to update some of them with your own API keys where applicable. Most of the example values will be fine for local development. 

4. **Set up the Postgres Database:**

You can point this at any Postgres instance you like, or you can run `docker-compose up -d` to set up a Docker instance which will run both the database and the Express app. However it will expose the Express app at port 8080 so that you can still run your development version locally at 3000 etc.
   
5. **Push the schema to the DB on first run:**

`drizzle-kit push` is a handy one for local development but it will likely nuke your data. See [here](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push) and [here](https://orm.drizzle.team/kit-docs/commands#generate-migrations). 

6. **Build your JS bundle from the TS source:**

```sh
npm run build
```

7. **Run the application:**

```sh
npm start
```

## Configuration

Residents uses environment variables for configuration. You'll find an example in the `.env.example` file.

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

