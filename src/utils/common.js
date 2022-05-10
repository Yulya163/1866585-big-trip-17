const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const isEscapePressed = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export {getRandomInteger, isEscapePressed};
