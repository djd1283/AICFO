import { type NextPage } from "next";

const DashboardPage: NextPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Dashboard
        </h1>
      </div>
    </main>
  );
};

export default DashboardPage;