const fetch = require("node-fetch");

exports.handler = async function (event) {
  const targetUrl = event.queryStringParameters.url;
  if (!targetUrl) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No URL provided" }),
    };
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "application/json",
      },
    });

    const data = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
