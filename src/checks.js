const { default: fetch } = require("node-fetch");

const API_HTTP = "https://updown.io/api";

class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(
      `HTTP Error Response: ${response.status} ${response.statusText}`,
      ...args
    );
  }
}

const checkStatus = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new HTTPResponseError(response);
  }
};

const getUpDownGrade = (uptime) => {
  return uptime > 0.99
    ? "A"
    : uptime > 0.98
    ? "B"
    : uptime > 0.97
    ? "C"
    : uptime > 0.96
    ? "D"
    : uptime > 0.95
    ? "E"
    : "F";
};

/**
 * Returns checks for a given url related to an api-key (updown.io account)
 *
 * @param {string} url The url checked
 * @param {string} apiKey The api-key
 *
 * @returns {Promise<HttpScanResult>}
 */
const checks = (url, apiKey) => {
  console.warn(`fetch updown.io checks for ${url}`);
  const apiUrl = encodeURI(`${API_HTTP}/checks?api-key=${apiKey}`);
  return fetch(apiUrl)
    .then(checkStatus)
    .then((json) => {
      if (json.error) {
        console.error("e", json.error);
        throw new Error(json.error);
      }
      return json.filter(
        (item) => item.url.replace(/\/$/, "") === url.replace(/\/$/, "")
      )[0];
    })
    .then((urlResult) => {
      // fetch checks details
      const checkUrl = encodeURI(
        `${API_HTTP}/checks/${urlResult.token}?api-key=${apiKey}&metrics=true`
      );
      return fetch(checkUrl)
        .then(checkStatus)
        .then((json) => {
          if (json.error) {
            console.error("e", json.error);
            throw new Error(json.error);
          }
          json.uptimeGrade = json.uptime && getUpDownGrade(json.uptime / 100);
          json.apdexGrade =
            json.metrics &&
            json.metrics.apdex &&
            getUpDownGrade(json.metrics.apdex);
          return json;
        });
    });
};

module.exports = checks;
