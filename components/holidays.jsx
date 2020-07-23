import useSwr from 'swr';
import fetchAPI from '../utils/apiClient';
import Holiday from './holiday';

const displayResults = (answer_title, holidays) => {
    return (
        <div>
            <h2>{answer_title}</h2>
            {holidays.map((element, index) => <Holiday key={index} {...element} />)}
        </div>
    );
}

const displayError = (error) => {

    let errorMessage = 'Unknown error';

    switch(error) {
        case 'missing_country':
            errorMessage = 'The country was not specified';
            break;
    }

    return errorMessage;

}

export default function Holidays(props) {
    
    const { data, error } = useSwr(`/api/holiday?q=${props.search}`, fetchAPI);

    if (error) return <p>ERROR: {error.message || 'General error'}</p>;
    if (!data) return <p>querying...</p>;

    return (
        <React.Fragment>
        {data.status != "success" && <h1>{displayError(data.status)}</h1>}
        {data.status == "success" && displayResults(data.answer_title, data.holidays)}
        </React.Fragment>
    )

  };