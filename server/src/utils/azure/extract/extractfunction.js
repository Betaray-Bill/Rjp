const endpoint = process.env.AZURE_ENDPOINT;
const apiKey = process.env.AZURE_API_KEY;
const modelId = process.env.MODEL_ID;

function transformResumeData(rawData) {
    const result = {
        status: rawData.status,
        fields: {}
    };

    for (const [key, value] of Object.entries(rawData.fields)) {
        if (value.content) {
            const lines = value.content.split('\n').map(line => line.trim()).filter(line => line);

            if (lines.length === 1) {
                result.fields[key] = { content: lines[0] };
            } else if (lines.length > 1) {
                result.fields[key] = lines;
            } else {
                result.fields[key] = {};
            }
        } else {
            result.fields[key] = {};
        }
    }

    return result;
}

async function checkAzureConnection() {
    try {
        // vlg
        const url = `${process.env.AZURE_ENDPOINT}formrecognizer/documentModels/${process.env.MODEL_ID}?api-version=2023-07-31`;
        console.log("Attempting to connect to:", url);
        console.log("Using API Key:", process.env.AZURE_API_KEY.substring(0, 5) + "..." + process.env.AZURE_API_KEY.substring(process.env.AZURE_API_KEY.length - 5));
        console.log("Model ID:", modelId);

        const response = await axios.get(url, {
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
            },
        });

        console.log("Successfully connected to Azure");
        console.log("Model status:", response.data.status);
        return response.data;
    } catch (error) {
        console.error("Error connecting to Azure:", error.message);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response data:", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}

export {
    transformResumeData,
    checkAzureConnection,
}