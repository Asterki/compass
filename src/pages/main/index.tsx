import Link from "next/link";
import { useRouter } from "next/router";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { useSession } from "next-auth/react";

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
            {status == "loading" && "Loading..."}
            
            {status == "authenticated" && (
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
            )}
        </main>
    );
};

export default MainPage;
