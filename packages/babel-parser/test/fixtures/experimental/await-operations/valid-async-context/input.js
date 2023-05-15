async () => await.all [];
async function f() { await.all [] };
(async function f() { await.all [] });
async function *g() { await.all [] };
(async function *g() { await.all [] });
class C {
  async f() { await.all [] }
  async *g() { await.all [] }
};
async do { await.all [] };
