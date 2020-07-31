import PropTypes from 'prop-types';
import moment from 'moment';

const displayWithCountry = (country, name) => (
  <h3>
    {country.emoji} {country.name}: {name}
  </h3>
);

const displayWithDate = (date, name) => (
  <h3>
    {name} on {moment(date).format('dddd, MMMM Do')} ({moment(date).fromNow()})
  </h3>
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
