import useSwr from 'swr';
import fetchAPI from '../utils/apiClient';
import Holiday from './holiday';
import React, { useEffect } from 'react';
import styles from './holidays.module.css';

const displayResults = (answer_title, holidays) => {
  const countries = new Set();
  for (let holiday of holidays) {
    countries.add(holiday.country.name);
  }
  const showCountry = countries.size > 1;
  return (
    <div>
      <h1 className={styles.title}>{answer_title}</h1>
      <div className={styles.container}>
        {holidays.map((element, index) => (
          <Holiday showCountry={showCountry} key={index} {...element} />
        ))}
      </div>
    </div>
  );
};

const displayError = (error) => {
  let errorMessage = 'Unknown error';

  switch (error) {
    case 'missing_country':
      errorMessage = 'The country was not specified';
      break;
    case 'unknown_country':
      errorMessage = 'The country was not recognized';
      break;
    case 'unknown_question':
      errorMessage =
        'This questions is not supported or understood. Try asking full questions';
      break;
    case 'search_term_not_recognized':
      errorMessage =
        'A request for a search was detected but the search term was not understood. Our fault, not yours. We will improve';
      break;
  }

  return errorMessage;
};

export default function Holidays({ search, onSearchingChange }) {
  const { data, error } = useSwr(`/api/holiday?q=${search}`, fetchAPI);

  if (error) return <p>ERROR: {error.message || 'General error'}</p>;

  useEffect(() => {
    onSearchingChange(!data);
  });

  if (data) {
    return (
      <React.Fragment>
        {data.status != 'success' && <h1>{displayError(data.status)}</h1>}
        {data.status == 'success' &&
          displayResults(data.answer_title, data.holidays)}
      </React.Fragment>
    );
  }

  return null;
}
