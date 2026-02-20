import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            NeighborHire — find help nearby.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Feels local. Feels safe. “Hire someone near you.”
          </p>
          <nav className="flex flex-col gap-3 text-base font-medium sm:flex-row sm:gap-4">
            <Link
              href="/createPost"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[180px]"
            >
              Post a job
            </Link>
            <Link
              href="/signin"
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[180px]"
            >
              Sign in / Sign up
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <p className="font-medium text-zinc-700 dark:text-zinc-300">Routes</p>
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/createPost"
                className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                /createPost
              </Link>
              <span className="ml-2">— Post a new job</span>
            </li>
            <li>
              <Link
                href="/signin"
                className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                /signin
              </Link>
              <span className="ml-2">— Login or sign up (e.g. with Google)</span>
            </li>
            <li>
              <Link
                href="/jobsearch"
                className="text-zinc-600 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                /jobsearch
              </Link>
              <span className="ml-2">— Search for jobs</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
