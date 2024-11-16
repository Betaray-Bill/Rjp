// controllers/utils.js
export function transformResumeData(rawData) {
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