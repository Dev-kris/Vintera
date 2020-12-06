export default function microtaskDebounce(fn) {
  let called = false;
  return () => new Promise(resolve => {
    if (called) {
      return resolve();
    }

    called = true;
    Promise.resolve().then(() => {
      called = false;
      resolve(fn());
    });
  });
}