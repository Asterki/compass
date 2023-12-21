import { getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

import Head from "next/head";

import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
} from "next";

export default function SignIn({
    providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div className="text-white bg-dark2">
            <Head>
                <title>page itle</title>
            </Head>

            <main className="min-h-screen flex flex-col justify-center items-center p-24">
                <section>
                    {Object.values(providers).map((provider) => (
                        <div key={provider.name} className="">
                            <button
                                className="bg-aqua2 transition-all w-5/12 my-4 p-4 rounded-lg shadow-md"
                                onClick={() => signIn(provider.id)}
                            >
                                wa{provider.name}
                            </button>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(
        context.req,
        context.res,
        authOptions
    );

    console.log(session);

    if (session) {
        return { redirect: { destination: "/" } };
    }

    const providers = await getProviders();

    return {
        props: {
            providers: providers ?? [],
        },
    };
}
