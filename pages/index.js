import Head from 'next/head'
import Layout from '../components/Layout/index'


export default function Home() {
  return (

    <Layout>
      <Head>
        <title>Reddit Analyzer - Visualize the Data</title>
        <meta name="description" content="A data visualizing tool used to view Reddit User's data an Subreddit traffic activity" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </Layout>
  )
}
