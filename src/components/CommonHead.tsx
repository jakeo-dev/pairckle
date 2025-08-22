import Head from "next/head";

export default function CommonHead(props: { children?: React.ReactNode }) {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Pairckle - Rank pairwisely</title>

      <meta
        name="keywords"
        content="pairckle, rank, ranking, tier list, tier list maker, tier maker, tier, rankings, pairwise, pairwise comparison, compare, comparison, comparisons"
      />
      <meta
        property="description"
        content="Rank your favorite things easily, accurately, and pairwisely."
      />

      <meta property="og:title" content="Pairckle - Rank pairwisely" />
      <meta
        property="og:description"
        content="Rank your favorite things easily, accurately, and pairwisely."
      />
      <meta name="theme-color" content="#00c951" />
      <meta property="og:url" content="https://pairckle.jakeo.dev" />
      <meta
        property="og:image"
        content="https://jakeo.dev/images/pairckle-ss-1.png"
      />

      <meta name="twitter:title" content="Pairckle - Rank pairwisely" />
      <meta
        name="twitter:description"
        content="Rank your favorite things easily, accurately, and pairwisely."
      />
      <meta name="twitter:url" content="https://pairckle.jakeo.dev" />
      <meta
        name="twitter:image:src"
        content="https://jakeo.dev/images/pairckle-ss-1.png"
      />
      <meta property="twitter:card" content="summary_large_image" />

      {props.children}
    </Head>
  );
}
