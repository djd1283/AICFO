# AI CFO Project

This is a project to help small businesses with their financial planning and forecasting using AI and integrations with financial data.

# T3 Stack Info

## Running the project

Start by installing the dependencies:

`npm install`

Make sure you have Docker installed, and then run the following command:

`./start-database.sh`

This will start a postgres database as a Docker container. If you have not migrated the database to the latest schema yet, you can run this command to do so:

`npm run db:migrate`

To run the backend/frontend together at port 3000, you can run the following command:

`npm run dev`

## Adding new tables/columns to the database

You can update the schema database by modifying the src/server/db/schema.ts file and then running the following command:

`npm run db:generate`

This will generate a new migration file which will live in the drizzle/ folder, and will allow others to run `npm run db:migrate` to update the database to the latest schema.

## Technologies used in this stack

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
