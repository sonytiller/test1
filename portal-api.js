// Netlify Function: portal-api
// Browser-friendly proxy between the public MCPS Portal and Google Apps Script.
// Deploy through Netlify connected to GitHub, or Netlify CLI. Simple drag/drop static deploys often do not publish functions.

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxHibLCuGOMGcTsWPhev7IAjI1CVV8G5y5sQRDQlFRhp_jWVgjxU5UOyWGBgF7Bxh8L/exec";

exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Netlify function is live.",
        backend: APPS_SCRIPT_URL,
        nextTest: "Send POST requests from the portal."
      })
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: "Use GET to test or POST for portal actions." })
    };
  }

  let payload = {};

  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (error) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ success: false, message: "Invalid JSON sent to Netlify function." })
    };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });

    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (error) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          success: false,
          message: "Apps Script responded, but not with JSON. Confirm Web App deploy is /exec, Execute as Me, Who has access Anyone.",
          appsScriptStatus: response.status,
          appsScriptResponsePreview: text.slice(0, 700)
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(json)
    };

  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        success: false,
        message: "Netlify could not reach Apps Script: " + error.message
      })
    };
  }
};
