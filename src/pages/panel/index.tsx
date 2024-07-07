import Head from "next/head";
import { useRouter } from "next/navigation";

import NavbarComponent from "@/components/layout/navbar";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { useSession } from "next-auth/react";

// Components
import Button from "@/components/button";

/**
 * The main page component.
 * Renders the main page content based on the user's session status.
 */
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

            {status == "authenticated" && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <section>
                        <Button variant="primary" className="">
                            Go to the Marketplace
                        </Button>
                    </section>
                </main>
            )}
        </div>
    );
};

export default MainPage;
