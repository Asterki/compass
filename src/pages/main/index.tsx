import Link from "next/link";
import Head from "next/head"
import { useRouter } from "next/router";

import NavbarComponent from "@/components/navbar";

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
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Dashboard | ClassCompass</title>
            </Head>

            {status == "loading" && "Loading..."}

            {status == "authenticated" &&  session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <section>
                        <h2 className="text-center text-4xl font-bold">Hello, {session.user.name}!</h2>
                        <p className="text-center text-lg">
                            Welcome to Class Compass, your one-stop shop for all things school-related.
                        </p>
                        <p className="text-center text-lg">Get started by checking out the features we offer below!</p>
                        <div className="flex justify-center gap-4 lg:justify-start">
                            <button
                                className="mt-2 rounded-md bg-gradient-to-br from-purple-400 to-purple-500 px-4 py-2 font-semibold text-white shadow-md transition-all hover:scale-105"
                                onClick={() => router.push("/features")}
                            >
                                See Features
                            </button>
                        </div>
                    </section>
                </main>
            )}
        </div>
    );
};

export default MainPage;
