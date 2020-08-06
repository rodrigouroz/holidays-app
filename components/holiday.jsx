import PropTypes from 'prop-types';
import moment from 'moment';

const displayWithCountry = (country, name) => (
  <p>
    {country.emoji} {country.name}: {name}
  </p>
);

const displayWithDate = (date, name) => (
  <p>
    {name} on {moment(date).format('dddd, MMMM Do')} ({moment(date).fromNow()})
  </p>
);

export default function Holiday(props) {
  if (props.date) {
    return displayWithDate(props.date, props.name);
  }

  return displayWithCountry(props.country, props.name);
}

Holiday.propTypes = {
  date: PropTypes.string,
  name: PropTypes.string.isRequired,
  country: PropTypes.shape({
    name: PropTypes.string,
    emoji: PropTypes.string,
  }),
};
