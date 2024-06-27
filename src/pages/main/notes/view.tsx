import Head from "next/head";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import NavbarComponent from "@/components/navbar";

import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const NotesViewPage = () => {
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

                    <div className="flex w-full flex-col items-center justify-center">
                        <div className="flex flex-col items-center justify-start border-b-2 border-b-slate-200/20">
                            <h1 className="text-lg font-bold">Note Name</h1>
                            <p className="text-sm">Created {new Date(Date.now()).toUTCString()}</p>
                        </div>

                        <div className="mt-2 flex w-9/12 flex-col justify-start gap-2">
                            <h2 className="text-2xl font-bold">Some title</h2>
                            <p className="text-sm">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus quod a nobis.
                                Libero dicta et dolore sapiente possimus non alias ratione illum, vero distinctio,
                                cumque deleniti necessitatibus accusantium recusandae atque voluptas. Cum laboriosam
                                incidunt numquam, atque expedita voluptate nesciunt repellat non consequuntur aspernatur
                                ab cumque. Adipisci deserunt perspiciatis voluptates nulla, itaque ipsa quas tempora,
                                quaerat minima corporis sed nam repellendus officiis, vitae explicabo. Ab totam ipsum
                                labore laboriosam repellat odit quo minima qui, adipisci corrupti aspernatur nam tempora
                                fugit eligendi expedita minus repudiandae dolor quibusdam iusto provident. Ratione
                                veniam saepe voluptate maiores earum quo voluptatibus ex pariatur? Dignissimos eius
                                nihil, doloribus in quae quam, earum minus corrupti ratione molestias quos obcaecati
                                facere, veritatis aliquid fugiat iure nulla quibusdam totam dolore. Ut corporis,
                                laudantium, dolor quia et officiis labore error odit est consequatur aperiam
                                consectetur. Alias aspernatur nostrum ea deleniti repellendus doloremque voluptatum
                                porro autem iste, laboriosam nobis eos odio sapiente quisquam, nemo adipisci molestiae
                                perferendis ratione consequatur unde nulla molestias quas!
                            </p>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};

export default NotesViewPage;
