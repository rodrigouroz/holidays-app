import PropTypes from 'prop-types';

export default function Holiday({ country, name }) {
  return (
    <p>
      {country.emoji} {country.name}: {name}
    </p>
  );
}

Holiday.propTypes = {
  name: PropTypes.string.isRequired,
  country: PropTypes.shape({
    name: PropTypes.string,
    emoji: PropTypes.string,
  }),
};
