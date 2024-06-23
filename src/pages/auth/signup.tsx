// Other dependencies

// Fonts
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

// Auth related
 

const SignUpPage = () => {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-center ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <div className="w-11/12 text-center lg:w-3/12">
                <h1 className="text-3xl font-semibold">Register to ClassCompass</h1>
                <p>Select a provider</p>

                <div className="mt-4 flex flex-col gap-4">
                    <button className="rounded-md border-2 border-slate-200 p-2 transition-all hover:scale-105 hover:bg-slate-700 hover:text-purple-50 dark:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900">
                        <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                        Google
                    </button>
                    <button className="rounded-md border-2 border-slate-200 p-2 transition-all hover:scale-105 hover:bg-slate-700 hover:text-purple-50 dark:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900">
                        <FontAwesomeIcon icon={faGithub} className="mr-2" />
                        GitHub
                    </button>
                    <button className="rounded-md border-2 border-slate-200 p-2 transition-all hover:scale-105 hover:bg-slate-700 hover:text-purple-50 dark:text-white dark:hover:bg-slate-200 dark:hover:text-slate-900">
                        <FontAwesomeIcon icon={faDiscord} className="mr-2" />
                        Discord
                    </button>
                </div>
            </div>

            <footer className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <p className="text-sm">
                    &copy; {new Date(Date.now()).getFullYear()}{" "}
                    <Link href="/" className="font-semibold text-purple-500 hover:underline">
                        Class Compass
                    </Link>
                    . All rights reserved. Created by{" "}
                    <Link href="https://github.com/Asterki/" className="font-semibold text-purple-500 hover:underline">
                        Asterki
                    </Link>
                    .
                </p>
            </footer>
        </main>
    );
};

export default SignUpPage;
