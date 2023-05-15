async () => {
  const promises = [Promise.resolve()];
  await.all promises;
  await.allSettled promises;
  await.any promises;
  await.race promises;
};