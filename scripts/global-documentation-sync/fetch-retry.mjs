const retryableStatus = (status) => status === 429 || status >= 500;

export async function fetchTextWithRetry(url, { fetchImpl = fetch, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)), attempts = 3 } = {}) {
  let last;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, { signal: AbortSignal.timeout(20_000) });
      if (response.ok) return await response.text();
      const error = new Error(`${url}: HTTP ${response.status}`);
      if (!retryableStatus(response.status)) throw Object.assign(error, { permanent: true });
      last = error;
    } catch (error) {
      if (error.permanent) throw error;
      const retryableNetwork = error instanceof TypeError || error.name === "TimeoutError" || error.name === "AbortError";
      if (!retryableNetwork && !/HTTP (429|5\d\d)/.test(error.message)) throw error;
      last = error;
    }
    if (attempt < attempts - 1) await sleep(500 * 2 ** attempt + Math.floor(Math.random() * 200));
  }
  throw last;
}
