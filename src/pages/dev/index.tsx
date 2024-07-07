import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import Button from "@/components/button";

const ComponentTesting = () => {
    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center justify-between ${inter.className} bg-purple-50 text-slate-700 dark:bg-slate-900 dark:text-slate-300`}
        >
            <h1>Component Testing</h1>
            <p>Testing the component</p>

            <div>
                <h1 className="text-2xl">Buttons</h1>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="disabled">Disabled</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="success">Success</Button>
            </div>
        </div>
    );
};

export default ComponentTesting;
