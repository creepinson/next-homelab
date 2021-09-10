# Getting Started

## The Manual Way

### Prequisites

- [Node.js >= 14 (I prefer 16)](https://nodejs.org)
- [pnpm](https://pnpm.io)
- [Postgresql](https://www.postgresql.org/)
- A linux server to host it on

### Creating the Environment Variables

Once you have cloned the git repository for the panel,
you can then create a `.env` file in the packages/backend folder. 
The .env file needs to contain the credentials required to access your postgresql database.
Here's an example.

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASS=1234
FRONTEND_URI=http://localhost:3000
```

### Installing and Running

Now you can install the node modules with pnpm.

```bash
pnpm i -r # Recursivee install across all packages
```

Next, you'll want to run development servers.

```bash
pnpm run dev -r
```

Now you should be able to access
the frontend at `http://localhost:3000`, and
the backend at `http://localhost:8080`.
You can also visit the graphql explorer at `http://localhost:8080/graphql`.
