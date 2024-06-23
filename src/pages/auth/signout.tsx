import Head from "next/head";
import { useRouter } from "next/router";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { useSession, signOut } from "next-auth/react";

const MainPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push("/auth/access");
        },
    });

    return (
        <main
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Sign Out | Class Compass</title>
                <meta name="description" content="Sign out of your account on Class Compass" />
            </Head>

            {status == "loading" && "Loading..."}

            {status == "authenticated" && session.user !== undefined && (
                <section className="flex w-full flex-col items-center justify-between">
                    <header className="flex w-full items-center justify-between p-4 px-2 lg:px-24">
                        <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start lg:gap-10">
                            <div>
                                <h1 className="text-lg font-bold lg:text-2xl">Class Compass</h1>
                            </div>
                            <div>
                                <ul className="flex justify-end gap-2 lg:gap-4">
                                    <li className="transition-all hover:scale-105">
                                        <a href="#" className="font-semibold text-purple-500 hover:underline">
                                            Home
                                        </a>
                                    </li>
                                    <li className="transition-all hover:scale-105">
                                        <a href="#" className="font-semibold text-purple-500 hover:underline">
                                            About
                                        </a>
                                    </li>
                                    <li className="transition-all hover:scale-105">
                                        <a href="#" className="font-semibold text-purple-500 hover:underline">
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="hidden w-4/12 items-center justify-center gap-6 lg:flex">
                            <button
                                className="w-1/2 rounded-md border-2 border-slate-200 p-2 font-bold shadow-md transition-all hover:scale-105 dark:hover:bg-slate-300 dark:hover:text-slate-700"
                                onClick={() => router.push("/auth/access")}
                            >
                                Sign In
                            </button>
                            <button
                                className="w-1/2 rounded-md bg-gradient-to-br from-purple-400 to-purple-500 p-2 font-bold text-white shadow-md transition-all hover:scale-105"
                                onClick={() => router.push("/auth/access")}
                            >
                                Sign Up
                            </button>
                        </div>
                    </header>

                    <section className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <h2 className="text-center text-3xl font-bold">Hello, {session.user.name}!</h2>
                        <p className="text-center text-lg">Are you sure you want to sign out of your account?</p>
                        <p className="text-center text-lg">You will need to log in again to access ClassCompass</p>
                        <button
                            className="mt-2 w-full rounded-md bg-gradient-to-br from-red-400 to-red-500 p-2 font-bold text-white shadow-md transition-all hover:scale-105"
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </button>
                        <button
                            className="mt-2 w-full rounded-md border-2 border-slate-300 p-2 font-bold text-white shadow-md transition-all hover:scale-105 hover:bg-slate-300 hover:text-slate-700"
                            onClick={() => router.push("/main")}
                        >
                            Cancel
                        </button>
                    </section>
                </section>
            )}
        </main>
    );
};

export default MainPage;
