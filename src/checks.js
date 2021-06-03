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

const remap = (value, x1, y1, x2, y2) =>
((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const scoreToGrade = (score) => {
  const grades = "A,B,C,D,E,F".split(",");

  const newGrade = Math.min(
    grades.length - 1,
    Math.floor(remap(1 - score, 0, 1, 0, 6))
  );

  return grades[newGrade];
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
          json.uptimeGrade = scoreToGrade(json.uptime);
          json.apdexGrade = scoreToGrade(json.uptime);
          return json
        });
    });
};

module.exports = checks;

