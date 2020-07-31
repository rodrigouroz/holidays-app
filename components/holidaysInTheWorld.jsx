import useSwr from 'swr';
import fetchAPI from '../utils/apiClient';
import Holiday from './holiday';
import styles from './holidaysInTheWorld.module.css';
import moment from 'moment';
import React from 'react';

export default function HolidaysInTheWorld({ holidaysWorldwide }) {
  const { data, error } = useSwr(`/api/holidays-worldwide`, fetchAPI, {
    initialData: holidaysWorldwide,
  });

  if (error) return <p>ERROR: {error.message || 'General error'}</p>;

  return (
    <React.Fragment>
      <h1>Holidays in the world</h1>
      <div className={styles.container}>
        <div>
          <h2>{moment(data[0].date).format('dddd, MMMM Do')}</h2>
          {data[0].holidays.map((element, index) => (
            <Holiday key={index} {...element} />
          ))}
        </div>
        <div>
          <h2>{moment(data[1].date).format('dddd, MMMM Do')}</h2>
          {data[1].holidays.map((element, index) => (
            <Holiday key={index} {...element} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
