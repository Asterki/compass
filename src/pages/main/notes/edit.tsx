import Head from "next/head";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import NavbarComponent from "@/components/navbar";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const NotesEditPage = () => {
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
                <title>Notes | Class Compass</title>
            </Head>

            {status == "loading" && "Loading..."}

            {status == "authenticated" && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <h1>Notes View Page</h1>
                </main>
            )}
        </div>
    );
};

export default NotesEditPage;
