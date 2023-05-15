async () => {
  (await.all [Promise.resolve(1)]) ** 2;
}
