import PropTypes from 'prop-types';
import moment from 'moment';

const formatHoliday = (holiday) => {
  let message = '';
  if (holiday.showCountry) {
    message += `${holiday.country.emoji} ${holiday.country.name}: `;
  }
  message += `${holiday.name} on ${moment(holiday.date).format(
    'dddd, MMMM Do'
  )} (${moment(holiday.date).fromNow()})`;

  return message;
};

export default function Holiday(props) {
  return <p>{formatHoliday(props)}</p>;
}

Holiday.propTypes = {
  date: PropTypes.string,
  name: PropTypes.string.isRequired,
  country: PropTypes.shape({
    name: PropTypes.string,
    emoji: PropTypes.string,
  }),
};
