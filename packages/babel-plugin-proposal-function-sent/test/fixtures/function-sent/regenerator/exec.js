let sent, yielded;

function* gen() {
    sent = function.sent;
    yielded = yield;
}

const it = gen();
it.next(1);
it.next(2);

expect(sent).toBe(1);
expect(yielded).toBe(2);
