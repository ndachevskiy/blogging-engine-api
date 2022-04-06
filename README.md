# Blog Engine API

## Table of Contents

-   [Intro](#intro)
-   [API](#api)
-   [Features Overview](#features-overview)
-   [Getting Started](#getting-started)

# Intro

Simple blog API allowing create and login users, perform CRUD operations on posts, comment posts and rate comments.

# API

Current version of API is (v1).

Endpoints documentation is accessible at /api-docs

# Features Overview

-   A user can signup.

-   After signing up a user receives an email with account activation link. Without account activation a user can't log in.

-   A user can login to an existing account (JWT authentication with access and refresh token is used).

-   A user can logout from current as well as from all devices.

-   A user can read his own profile.

-   A user can read profiles of all existing users.

-   A user can delete his own profile (resulting in cascade deletion of all related content).

-   A user can create, read, update and delete a post (resulting in cascade deletion of all related content), as well as read all existing posts of another user.

-   A user can add a comment to existing post, reply to existing comment and rate comments.

# Getting Started

## Prerequisites

1. Make sure **Node.js** is installed on your local machine by hitting `node -v` on the command line (please follow the instructions from the [Node.js website](http://nodejs.org) to install it)

2. By default, the API requires running an instance of PostgreSQL server on your local machine. However, you can use MySQL, SQL Serve, PlanetScale, CockroachDB or MongoDB as well. Just change the connection string in .env. files in line with the following [instructions](https://www.prisma.io/docs/reference/database-reference/connection-urls).

3. Please make sure to set up the following environment variables (database URL connection string should be always located at your root directory in .env file. You can set up different environments by adding postfixes, e.g. ".env.dev"):

-   PORT (port on which the application will be running; default value: [3000])
-   DATABASE_URL (connection string for your DB; default value for running locally: ["postgresql://postgres:mypass228@localhost:5432/blog_api_dev?schema=public"], for running in container:["postgresql://postgres:mypass228@postgres:5432/blog_api_dev?schema=public"])
-   JWT_SECRET_ACCESS (JWT secret key for access token)
-   JWT_SECRET_REFRESH (JWT secret key for refresh token)
-   JWT_EXPIRATION_ACCESS (expiration period for access token; default value: ["30m"])
-   JWT_EXPIRATION_REFRESH (expiration period for refresh token; default value: ["30d"])
-   NODE_ENV (environment variable defining in which environment you are running the up; default values: for test:[test], for development:[development])
-   API_URL (URL where your app is hosted, used for generating of activation links; default value:["http://localhost:3000"])
-   SENDGRID_API_KEY (mail service secret key used to send activation emails, by default Sendgrid is used; you can turn off this functionality in src/services/mail.service.js)
-   USER_EMAIL (email from which activation emails will be sent)

## Running Locally

Install the application and all the required dependencies by hitting the following commands on the command line:

`git clone https://github.com/ndachevskiy/blogging-engine-api.git`

`npm install`

To run the application locally make sure you have Prisma CLI and Prisma Client npm installed by hitting `npm prisma -v` and `npm prisma/client -v` on the command line. Alternatively you can install it by hitting `npm i prisma --save-dev` and `npm i @prisma/client`.

You then need to run your database server and synchronize existing data models.

Hit the following commands in the terminal:

`npm run migrate:dev`

`npx prisma generate`

To seed your database, hit `npx prisma db seed`.

Once everything is installed, the server can be started by hitting `npm run dev` on the command line.

To use Prisma GUI, open another terminal and hit `npm run studio:dev`. A new browser window will be opened. By default, Prisma Studio is running on port **5555**.

## Running in Container

Copy the repository by hitting the following command on the command line:

`git clone https://github.com/ndachevskiy/blogging-engine-api.git`

Make sure you Docker application is running, then hit:

`docker-compose up`

Once server is up and running, open **blog-api** container's CLI and hit the following command:

`npm run migrate:docker`

In case of error, hit:

`npm run migrate:docker-fix`

You can now open pgAdmin in your browser, by default it's running at [http://localhost:8080](http://localhost:8080)

Default username and password are **pgadmin4@pgadmin.org** and **admin** (all the credentials can be changed in **docker-compose.yml** file).

You should then create a new server:

1. Right-click **Servers** icon and select **Create** -> **Server**.

2. Select a name (can be anything)

3. Go to **Connections**.

4. Select a hostname (by default **postgres_container**), a username (by default **postgres**) and password (by default **admin**).

5. Hit save.

The connection to the database has been established. You can now create a database table, manage users and quickly adjust our PostgreSQL database.

## Running Test

Make sure `supertest` npm in installed by hitting `npm supertest -v` on the command line. You can install it as dev dependency by hitting `npm i supertest`.

Once installed, test suites can be run by hitting `npm run test` on the command line.

You can use Prisma Studio GUI by opening another terminal and hitting `npm run studio:test`

Please note, that currently not all the automated tests are being passing due to incorrectly created test data in the database.
