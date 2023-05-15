async () => {
  const promises = [Promise.resolve()];
  await Promise.all(promises);
  await Promise.allSettled(promises);
  await Promise.any(promises);
  await Promise.race(promises);
};
