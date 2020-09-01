import fetchAPI from './apiClient';

describe('fetchAPI', () => {
  test('fetches ok', async () => {
    const mockResult = jest.fn();
    const args = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResult),
      })
    );

    const result = await fetchAPI(args);

    expect(global.fetch).toHaveBeenCalledWith(args, {
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toBe(mockResult);
  });
  test('throws on error', async () => {
    const args = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
      })
    );

    await expect(fetchAPI(args)).rejects.toThrow();
    expect(global.fetch).toHaveBeenCalledWith(args, {
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
