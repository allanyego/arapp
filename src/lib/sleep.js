export default function sleep(duration = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
