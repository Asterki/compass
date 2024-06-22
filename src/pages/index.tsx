import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between ${inter.className} text-slate-700 bg-purple-50`}
        >
            <section className="min-h-screen flex flex-col items-center justify-between w-full">
                <header className="p-4 w-full flex items-center justify-between md:px-24 px-2">
                    <div className="md:w-auto w-full flex items-center md:justify-start justify-between md:gap-10 gap-2">
                        <div>
                            <h1 className="md:text-2xl text-lg font-bold">
                                Class Compass
                            </h1>
                        </div>
                        <div>
                            <ul className="flex justify-end md:gap-4 gap-2">
                                <li className="transition-all hover:scale-105">
                                    <a
                                        href="#"
                                        className="text-purple-500 hover:underline font-semibold"
                                    >
                                        Home
                                    </a>
                                </li>
                                <li className="transition-all hover:scale-105">
                                    <a
                                        href="#"
                                        className="text-purple-500 hover:underline font-semibold"
                                    >
                                        About
                                    </a>
                                </li>
                                <li className="transition-all hover:scale-105">
                                    <a
                                        href="#"
                                        className="text-purple-500 hover:underline font-semibold"
                                    >
                                        Contact
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="w-4/12 md:flex hidden items-center justify-center gap-6">
                        <button className="rounded-md border-2 border-slate-200 p-2 w-1/2 font-bold transition-all hover:scale-105 shadow-md">
                            Login
                        </button>
                        <button className="bg-gradient-to-br from-purple-400 to-purple-500 text-white p-2 rounded-md w-1/2 font-bold transition-all hover:scale-105 shadow-md">
                            Register
                        </button>
                    </div>
                </header>

                <section className="p-32 flex items-center justify-around gap-12 w-full">
                    <div className="px-20 w-1/2 text-left">
                        <h1 className="text-4xl font-bold">
                            Manage your life in a single, centralized,
                            easy-to-use platform Made for students, by students.
                        </h1>

                        <br />

                        <p>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Sunt impedit dolore blanditiis odio ipsam
                            sapiente voluptas in numquam sit quae expedita
                            laudantium exercitationem eligendi et ullam, ratione
                            neque eius odit, quasi ducimus architecto omnis
                            ipsum. Debitis veritatis unde ut fugiat nemo nostrum
                            vel ducimus, officia possimus esse labore harum
                            quibusdam sit perferendis eius pariatur voluptatibus
                            laborum molestias nobis, quae minus ea. Excepturi,
                            dolor sapiente? Quibusdam soluta consectetur impedit
                            ut aperiam sint maiores ipsum pariatur sed facere?
                        </p>

                        <div className="flex gap-4">
                            <button className="bg-gradient-to-br from-purple-400 to-purple-500 text-white font-semibold py-2 px-4 rounded-md mt-2 shadow-md transition-all hover:scale-105">
                                Register Now
                            </button>
                            <button className=" font-semibold py-2 px-4 rounded-md mt-2 shadow-md border-2 border-slate-200 transition-all hover:scale-105">
                                See Features
                            </button>
                        </div>
                    </div>
                    <div className="w-1/2 text-center flex items-center justify-center">
                        <img
                            src="https://placehold.co/500"
                            alt="Example for now"
                        />
                    </div>
                </section>

                <footer className="bg-gradient-to-br from-60% from-purple-500 to-pink-300  p-8 w-full flex items-center justify-center">
                    <button className="bg-white p-2 rounded-md shadow-md">
                        Register
                    </button>
                    <button className="bg-white p-2 rounded-md shadow-md">
                        Login
                    </button>
                </footer>
            </section>
        </main>
    );
}
