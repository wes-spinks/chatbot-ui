import '@testing-library/jest-dom';
import { getChatbots, getId } from './utils';

/*const mockData = [{ name: 'Test' }];
const mockFetch = (status: number, data, ok: boolean) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      status,
      ok,
      json: () => Promise.resolve(data),
    } as Response),
  );
};*/

describe('getId', () => {
  it('should generate ID', () => {
    const id = getId();
    expect(typeof id).toBe('string');
  });
});

describe('getChatbots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if URL is misconfigured', async () => {
    await expect(getChatbots).rejects.toHaveProperty('body', '{"status":"Misconfigured"}');
  });
  // fixme
  /*it('should return data if received from fetch', async () => {
    mockFetch(200, mockData, true);
    const chatbots = await getChatbots();
    expect(chatbots).toBe(mockData);
    expect(global.fetch).toHaveBeenCalled();
  });
  it('should handle 401 correctly', async () => {
    mockFetch(401, {}, false);
    await expect(getChatbots).rejects.toHaveProperty('body', '{"status":401}');
  });
  it('should handle 403 correctly', async () => {
    mockFetch(403, {}, false);
    await expect(getChatbots).rejects.toHaveProperty('body', '{"status":403}');
  });
  it('should handle 500 correctly', async () => {
    mockFetch(500, {}, false);
    await expect(getChatbots).rejects.toHaveProperty('body', '{"status":500}');
  });
  it('should handle 503 correctly', async () => {
    mockFetch(503, {}, false);
    await expect(getChatbots).rejects.toHaveProperty('body', '{"status":503}');
  });*/
});
