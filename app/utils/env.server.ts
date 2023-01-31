export function getEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  // Declare a global ENV variable
  // eslint-disable-next-line
  var ENV: ENV;
  // Augment the Window Interface
  interface Window {
    ENV: ENV;
  }
}
