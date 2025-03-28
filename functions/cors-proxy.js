export async function handler(event) {
    const fetch = (await import("node-fetch")).default; // Use dynamic import

    // Handle preflight OPTIONS request
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: "",
        };
    }

    const method = event.httpMethod;
    console.log(`Incoming request: ${method}`);

    try {
        let targetUrl;
        let requestBody;

        if (method === "GET") {
            // Extract target URL from query parameters (existing functionality)
            targetUrl = event.queryStringParameters.url;

            if (!targetUrl) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "No URL provided" }),
                };
            }
        } else if (method === "POST") {
            // Extract target URL and payload from the request body
            const body = JSON.parse(event.body);
            targetUrl = body.url;
            requestBody = body.data;

            if (!targetUrl) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "No URL provided in POST request" }),
                };
            }
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        // Fetch data from the external API
        const response = await fetch(targetUrl, {
            method,
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: method === "POST" ? JSON.stringify(requestBody) : undefined,
        });

        const data = await response.text();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Content-Type": "application/json",
            },
            body: data,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data", details: error.message }),
        };
    }
}
