export const lookAhead = () => {
  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'ArrowRight':
        break;

      default:
        break;
    }
  });
};

const logKey = (e) => {
  console.log(` ${e.code}`);
};
