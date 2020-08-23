import Typewriter from 'typewriter-effect';
import React from 'react';

const questions = [
  'what is the next holiday in Argentina?',
  'what are the next three holidays in the USA?',
  'is there a holiday in Argentina in October or November?',
  'when is labour day in the USA?',
  'what are the next two holidays in USA and Canada?',
  'what are the holidays in Brazil and Argentina in January, February and March?',
  'when is carnival in Argentina?',
];

export default function Examples() {
  return (
    <React.Fragment>
      <Typewriter
        options={{
          strings: questions,
          autoStart: true,
          loop: true,
          delay: 50,
          deleteSpeed: 20,
        }}
      />
    </React.Fragment>
  );
}
