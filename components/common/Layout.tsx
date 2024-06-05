import Head from "next/head";
import { Container } from "@interchain-ui/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="64rem" attributes={{ py: "$14" }}>
      <Head>
        <title>Token Balance Tracker</title>
        <meta name="description" content="An useful app for your wallet!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {children}

    </Container>
  );
}
