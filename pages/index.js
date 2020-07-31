import Head from 'next/head';
import { useState } from 'react';
import useDebounce from '../lib/useDebounce';
import Holidays from '../components/holidays';
import HolidaysInTheWorld from '../components/holidaysInTheWorld';
import { getHolidaysWorldwide } from '../lib/holidays';
import styles from './index.module.css';

export async function getStaticProps() {
  const holidaysWorldwide = await getHolidaysWorldwide();

  // Pass data to the page via props
  return {
    props: { holidaysWorldwide },
    revalidate: 60,
  };
}

export default function Home({ holidaysWorldwide }) {
  const [q, setQ] = useState('');
  const debouncedSearch = useDebounce(q, 1000);

  return (
    <div className={styles.main}>
      <Head>
        <title>Holiday App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.holidaysWorldwide}>
          <HolidaysInTheWorld holidaysWorldwide={holidaysWorldwide} />
        </div>
        <div className={styles.title}>
          <h1>Ask me what you want to know about a holiday</h1>
        </div>
        <div className={styles.question}>
          <input
            type="text"
            placeholder="e.g. What is the next holiday in Argentina?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          ></input>
        </div>
        <div className={styles.results}>
          {debouncedSearch && <Holidays search={debouncedSearch} />}
        </div>
        <div className={styles.footer}>
          <div>
            <p>
              Made with ❤️ by{' '}
              <a href="https://www.linkedin.com/in/rodrigouroz/">
                Rodrigo Uroz
              </a>
            </p>
            <a href="https://github.com/rodrigouroz/holidays-app">
              <img src="/GitHub-Mark-Light-32px.png" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
