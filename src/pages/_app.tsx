import { useState } from 'react';
import NextApp, { AppProps, AppContext } from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorScheme, ColorSchemeProvider } from '@mantine/core';
import {SessionProvider} from "next-auth/react";
import {Notifications} from "@mantine/notifications";
import {GlobalContextProvider} from "@/components/providers/GlobalContextProvider";
import Script from "next/script";
import {CodeProps, FileProps, InsertCodeProps, NoteProps} from "@/common/client/CompleteCommon";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
    const { Component, pageProps } = props;
    const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
    const [refreshSession, setRefreshSession] = useState<() => void>(() => {});
    const [refreshMessage, setRefreshMessage] = useState<() => void>(() => {});
    const [refreshCode, setRefreshCode] = useState<(codeProps: CodeProps) => void>(() => {});
    const [refreshFile, setRefreshFile] = useState<(fileProps: FileProps) => void>(() => {});
    const [refreshNote, setRefreshNote] = useState<(noteProps: NoteProps) => void>(() => {});
    const [refreshInsertCode, setRefreshInsertCode] = useState<(insertCodeProps: InsertCodeProps) => void>(() => {});

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
        setColorScheme(nextColorScheme);
        setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
    };

    return (
        <>
            <Head>
                <title>Catoy</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <link rel="shortcut icon" href="/favicon.svg" />
            </Head>
            <Script strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
            <Script strategy="lazyOnload" id="gtag">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
            </Script>

            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                    <GlobalContextProvider
                        refreshSession={refreshSession}
                        setRefreshSession={setRefreshSession}
                        refreshMessages={refreshMessage}
                        setRefreshMessages={setRefreshMessage}
                        refreshCode={refreshCode}
                        setRefreshCode={setRefreshCode}
                        refreshFile={refreshFile}
                        setRefreshFile={setRefreshFile}
                        refreshInsertCode={refreshInsertCode}
                        setRefreshInsertCode={setRefreshInsertCode}
                        refreshNote={refreshNote}
                        setRefreshNote={setRefreshNote}
                    >
                        <Notifications />
                        <SessionProvider session={pageProps.session}>
                            <Component {...pageProps} />
                        </SessionProvider>
                    </GlobalContextProvider>
                </MantineProvider>
            </ColorSchemeProvider>
        </>
    );
}

App.getInitialProps = async (appContext: AppContext) => {
    const appProps = await NextApp.getInitialProps(appContext);
    return {
        ...appProps,
        colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
    };
};