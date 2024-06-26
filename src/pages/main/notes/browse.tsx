import Head from "next/head";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-solid-svg-icons";

// Components
import NavbarComponent from "@/components/navbar";
import * as Collapsible from "@radix-ui/react-collapsible";

import { Inter } from "next/font/google";
import { faChevronCircleDown } from "@fortawesome/free-solid-svg-icons/faChevronCircleDown";
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

                        <Collapsible.Root className="group w-full mt-2">
                            <Collapsible.Trigger className="group mt-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                                <div>
                                    <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                                    Notes Folder 1
                                </div>
                                <FontAwesomeIcon
                                    icon={faChevronCircleDown}
                                    className="fill-white transition-all group-data-[state=open]:rotate-180"
                                />
                            </Collapsible.Trigger>
                            <Collapsible.Content className="-my-2 flex items-stretch">
                                <div className="w-full rounded-md border-2 border-slate-800 p-2">
                                    <div className="my-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                                        <div>
                                            <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                                            Notes Folder 1
                                        </div>
                                        <FontAwesomeIcon icon={faChevronCircleDown} className="fill-white" />
                                    </div>
                                    <div className="my-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                                        <div>
                                            <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                                            Notes Folder 1
                                        </div>
                                        <FontAwesomeIcon icon={faChevronCircleDown} className="fill-white" />
                                    </div>
                                    <div className="my-2 flex w-full cursor-pointer items-center justify-between rounded-md bg-slate-800 p-2">
                                        <div>
                                            <FontAwesomeIcon icon={faFolder} className="mr-2 fill-white" />
                                            Notes Folder 1
                                        </div>
                                        <FontAwesomeIcon icon={faChevronCircleDown} className="fill-white" />
                                    </div>
                                </div>
                            </Collapsible.Content>
                        </Collapsible.Root>

                        
                    </div>
                </main>
            )}
        </div>
    );
};

export default NotesBrowsePage;
