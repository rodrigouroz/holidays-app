import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import useDebounce from '../lib/useDebounce';
import Holidays from '../components/holidays';
import HolidaysInTheWorld from '../components/holidaysInTheWorld';
import { getHolidaysWorldwide } from '../lib/holidays';
import styles from './index.module.css';
import Examples from '../components/examples';
import * as gtag from '../lib/gtag';

export async function getStaticProps() {
  const holidaysWorldwide = await getHolidaysWorldwide();

  // Pass data to the page via props
  return {
    props: { holidaysWorldwide },
    revalidate: 60,
  };
}

export default function Home({ holidaysWorldwide }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [searching, setSearching] = useState(false);
  const searchTerm = useDebounce(q, 1000);

  useEffect(() => {
    if (router.query && router.query.q) {
      setQ(router.query.q);
    }
  }, [router.query]);

  useEffect(() => {
    if (searchTerm) {
      router.push(`/?q=${encodeURIComponent(searchTerm)}`, undefined, {
        shallow: true,
      });
      gtag.search(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className={styles.main}>
      <Head>
        <title>Holiday App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.title}>
          <h1>Ask what you want to know about upcoming holidays</h1>
        </div>
        <div className={styles.question}>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          ></input>
          <div
            style={{ visibility: searching ? 'visible' : 'hidden' }}
            className={styles.loader}
          >
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div
          style={{ visibility: !q ? 'visible' : 'hidden' }}
          className={styles.examples}
        >
          <Examples />
        </div>
        <div className={styles.results}>
          {searchTerm && (
            <Holidays search={searchTerm} onSearchingChange={setSearching} />
          )}
          {!searchTerm && (
            <HolidaysInTheWorld holidaysWorldwide={holidaysWorldwide} />
          )}
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
