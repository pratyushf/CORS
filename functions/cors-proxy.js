export async function handler (event) {
    const fetch = (await import("node-fetch")).default; // Use dynamic import

    const targetUrl = event.queryStringParameters.url;
    console.log("Requested URL:", targetUrl);

    if (!targetUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No URL provided" }),
        };
    }

    try {
        const response = await fetch(targetUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
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
        console.error("Fetch error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data", details: error.message }),
        };
    }
}
