import Head from "next/head";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons/faChevronCircleDown";

// Components
import NavbarComponent from "@/components/navbar";
import NotesBrowserComponent from "@/components/notes/browser";
import * as Collapsible from "@radix-ui/react-collapsible";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const NotesBrowsePage = () => {
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

                    {/* Browser  */}
                    <div className="w-9/12">
                        <h1 className="text-2xl">Browse Notes</h1>

                        <NotesBrowserComponent notes={{
                            type: "folder",
                            name: "Notes",
                            link: null,
                            children: [
                                {
                                    type: "note",
                                    name: "Note 1",
                                    link: "/notes/1",
                                },
                                {
                                    type: "folder",
                                    name: "Folder 1",
                                    link: null,
                                    children: [
                                        {
                                            type: "note",
                                            name: "Note 2",
                                            link: "/notes/2",
                                        },
                                        {
                                            type: "note",
                                            name: "Note 3",
                                            link: "/notes/3",
                                        },
                                    ],
                                }
                            ]
                        }} />
                    </div>
                </main>
            )}
        </div>
    );
};

export default NotesBrowsePage;
