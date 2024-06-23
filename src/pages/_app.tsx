import { SessionProvider } from "next-auth/react";
import { AppProps } from 'next/app';

import "@/styles/globals.css"

const App: React.FC<AppProps> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default App;