import { NextPage } from "next";
import { useRouter } from "next/router";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { DefaultSession } from "next-auth";

interface NavbarProps {
    session: DefaultSession | null;
}

const NavbarComponent: NextPage<NavbarProps> = (props) => {
    const router = useRouter();

    if (!props.session)
        return (
            <header className="flex w-full items-center justify-between p-4 px-2 lg:px-24">
                <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start lg:gap-10">
                    <div>
                        <h1 className="text-lg font-bold lg:text-2xl">Class Compass</h1>
                    </div>
                    <div>
                        <ul className="flex justify-end gap-2 lg:gap-4">
                            <li className="transition-all hover:scale-105">
                                <a href="#" className="font-semibold text-purple-500 hover:underline">
                                    Home
                                </a>
                            </li>
                            <li className="transition-all hover:scale-105">
                                <a href="#" className="font-semibold text-purple-500 hover:underline">
                                    About
                                </a>
                            </li>
                            <li className="transition-all hover:scale-105">
                                <a href="#" className="font-semibold text-purple-500 hover:underline">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="hidden w-4/12 items-center justify-center gap-6 lg:flex">
                    <button
                        className="w-1/2 rounded-md border-2 border-slate-200 p-2 font-bold shadow-md transition-all hover:scale-105 dark:hover:bg-slate-300 dark:hover:text-slate-700"
                        onClick={() => router.push("/auth/access")}
                    >
                        Sign In
                    </button>
                    <button
                        className="w-1/2 rounded-md bg-gradient-to-br from-purple-400 to-purple-500 p-2 font-bold text-white shadow-md transition-all hover:scale-105"
                        onClick={() => router.push("/auth/access")}
                    >
                        Sign Up
                    </button>
                </div>
            </header>
        );

    return (
        <header className="flex w-full items-center justify-between p-4 px-2 lg:px-24">
            <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start lg:gap-10">
                <div>
                    <h1 className="text-lg font-bold lg:text-2xl">Class Compass</h1>
                </div>
            </div>
            <div className="flex w-4/12 items-center justify-end gap-6">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        asChild
                        className="h-12 w-12 select-none rounded-full border-2 border-slate-300 transition-all hover:p-[1px]"
                    >
                        <img src={props.session.user?.image ?? "https://placehold.co/300"} alt="" className="rounded-full" />
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            side="bottom"
                            align="end"
                            className="min-w-[220px] animate-[slideUpAndFade_0.1s_ease-in-out] rounded-md bg-slate-300 p-2 will-change-[opacity,transform]"
                        >
                            <DropdownMenu.Group>
                                <DropdownMenu.Item className="rounded-md p-2 outline-none transition-all hover:bg-slate-200 cursor-pointer"
                                    onClick={() => router.push("/profile")}
                                >
                                    Profile
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="rounded-md p-2 outline-none transition-all hover:bg-slate-200 cursor-pointer"
                                    onClick={() => router.push("/settings")}
                                >
                                    Settings
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="rounded-md p-2 outline-none transition-all hover:bg-slate-200 cursor-pointer"
                                    onClick={() => router.push("/auth/signout")}
                                >
                                    Logout
                                </DropdownMenu.Item>
                            </DropdownMenu.Group>

                            <DropdownMenu.Arrow className="fill-slate-300" />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
        </header>
    );
};

export default NavbarComponent;
