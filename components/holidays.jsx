import useSwr from 'swr';
import fetchAPI from '../utils/apiClient';
import Holiday from './holiday';
import React, { useEffect } from 'react';

const displayResults = (answer_title, holidays) => {
  const countries = new Set();
  for (let holiday of holidays) {
    countries.add(holiday.country.name);
  }
  const showCountry = countries.size > 1;
  return (
    <div>
      <h2>{answer_title}</h2>
      {holidays.map((element, index) => (
        <Holiday showCountry={showCountry} key={index} {...element} />
      ))}
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
