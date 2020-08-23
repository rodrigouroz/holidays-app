import Typewriter from 'typewriter-effect';
import React from 'react';

const questions = [
  'what is the next holiday in Argentina?',
  'what are the next three holidays in the USA?',
  'is there a holiday in Argentina in October or November?',
  'when is labour day in the USA?',
  'what are the next two holidays in USA and Canada?',
  'what are the holidays in Brazil and Argentina in the next two months?',
  'when is carnival in Argentina?',
  "when is king's day in netherlands next year?",
  'tell me all the holidays until the end of this year for the US',
];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Examples() {
  return (
    <React.Fragment>
      <Typewriter
        options={{
          strings: shuffle(questions),
          autoStart: true,
          loop: true,
          delay: 50,
          deleteSpeed: 20,
        }}
      />
    </React.Fragment>
  );
}
