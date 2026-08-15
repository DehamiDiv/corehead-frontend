export function createMemoryStorage(initial = {}) {
  const values = new Map(
    Object.entries(initial).map(([key, value]) => [key, String(value)]),
  );

  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.has(String(key)) ? values.get(String(key)) : null;
    },
    key(index) {
      return [...values.keys()][index] ?? null;
    },
    removeItem(key) {
      values.delete(String(key));
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
  };
}

export function createMockFetch(body, options = {}) {
  const calls = [];
  const fetchMock = async (input, init = {}) => {
    calls.push({ input, init });
    return {
      ok: options.ok ?? true,
      status: options.status ?? 200,
      async json() {
        return body;
      },
    };
  };
  fetchMock.calls = calls;
  return fetchMock;
}
