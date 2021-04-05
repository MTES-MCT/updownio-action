const { default: fetch } = require("node-fetch");

const API_HTTP = "https://updown.io/api";


class HTTPResponseError extends Error {
  constructor(response, ...args) {
    super(`HTTP Error Response: ${response.status} ${response.statusText}`, ...args);
  }
}

const checkStatus = (response) => {
  if (response.ok) {
    return response.json();
  } else {
    throw new HTTPResponseError(response);
  }
}

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
  console.debug(`apiUrl=${apiUrl}`)
  return fetch(apiUrl)
    .then(checkStatus)
    .then(json => { if (json.error) {console.error("e", json.error); throw new Error(json.error);}
    return json.filter(item => item.url === url)[0]; });
};

module.exports = checks;