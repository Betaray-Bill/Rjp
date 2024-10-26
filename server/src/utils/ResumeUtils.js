// controllers/utils.js
export function transformResumeData(rawData) {
  const result = { status: rawData.status, fields: {} };

  for (const [key, value] of Object.entries(rawData.fields)) {
    if (value.content) {
      const lines = value.content.split('\n').map(line => line.trim()).filter(line => line);
      result.fields[key] = lines.length === 1 ? { content: lines[0] } : lines;
    } else {
      result.fields[key] = {};
    }
  }
  return result;
}
