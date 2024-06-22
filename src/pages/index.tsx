import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main
            className={`flex min-h-screen flex-col items-center justify-between ${inter.className} bg-purple-50`}
        >
            <section className="min-h-screen flex flex-col items-center justify-between w-full">
                <header className="p-32 flex justify-around gap-12 w-full">
                    <div>
                        <h1 className="text-4xl font-bold text-center">
                            Welcome to{" "}
                            <span className="text-purple-500">Class Compass</span>
                        </h1>
                    </div>
                    <div>
                        <img src="https://placehold.co/400" alt="Example for now" />
                    </div>
                </header>

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
