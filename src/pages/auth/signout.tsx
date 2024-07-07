import Head from "next/head";
import { useRouter } from "next/navigation";

import NavbarComponent from "@/components/layout/navbar";
import Button from "@/components/button";

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
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <Head>
                <title>Sign Out | Class Compass</title>
                <meta name="description" content="Sign out of your account on Class Compass" />
            </Head>

            {status == "loading" && "Loading..."}

            {status == "authenticated" && session.user !== undefined && (
                <main className="flex w-full flex-col items-center justify-between">
                    <NavbarComponent session={session} />

                    <section className="absolute left-1/2 top-1/2 w-11/12 -translate-x-1/2 -translate-y-1/2 md:w-5/12">
                        <h2 className="text-center text-3xl font-bold">Hello, {session.user.name}!</h2>
                        <p className="text-center text-lg">Are you sure you want to sign out of your account?</p>
                        <p className="text-center text-lg">You will need to log in again to access ClassCompass</p>
                        <Button variant="destructive" className="w-full my-2" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                        <Button variant="secondary" className="w-full my-2" onClick={() => router.push("/main")}>
                            Cancel
                        </Button>
                    </section>
                </main>
            )}
        </div>
    );
};

export default MainPage;
