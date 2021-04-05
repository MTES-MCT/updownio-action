jest.mock("node-fetch");
jest.useFakeTimers();

const { default: fetch } = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");

const checks = require("./checks");
describe("should checks an URL", () => {
  test("should return checks", async () => {
    const expectedJson = [{"token":"toto","url":"https://toto.beta.gouv.fr","alias":"Toto","last_status":200,"uptime":99.889,"down":false,"down_since":null,"error":null,"period":600,"apdex_t":0.5,"string_match":"","enabled":true,"published":true,"disabled_locations":["lan","mia","bhs","sin","tok","syd"],"last_check_at":"2021-04-01T07:42:39Z","next_check_at":"2021-04-01T07:52:35Z","mute_until":null,"favicon_url":"https://toto.beta.gouv.fr/static/img/favicon.ico","custom_headers":{},"http_verb":"GET/HEAD","http_body":null,"ssl":{"tested_at":"2021-04-01T07:32:44Z","expires_at":"2021-05-25T12:51:11Z","valid":true,"error":null}}];
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify(expectedJson))
      )
    );
    const result = await checks("https://toto.beta.gouv.fr", "testKey");
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://updown.io/api/checks?api-key=testKey"
    );
    expect(result.url).toEqual("https://toto.beta.gouv.fr");
    expect(result).toEqual(expectedJson[0]);
  });

  test("should return error invalid api key", async () => {
    const expectedJson = {"error":"Invalid API test key"};
    fetch.mockImplementationOnce(() =>
      Promise.resolve(
        new Response(JSON.stringify(expectedJson))
      )
    );
    await expect(checks("https://tata.beta.gouv.fr", "wrongKey")).rejects.toThrow(expectedJson.error);
  });
});
