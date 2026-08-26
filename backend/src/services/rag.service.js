const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function createEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return response.embeddings[0].values;
}

function buildResumeText(resumeData) {
  return `
Summary:
${resumeData.summary || ""}

Skills:
${(resumeData.skills || []).join(", ")}

Education:
${(resumeData.education || []).join(", ")}

Experience:
${(resumeData.experience || []).join(", ")}

Projects:
${(resumeData.projects || []).join(", ")}

Certifications:
${(resumeData.certifications || []).join(", ")}
`.trim();
}

module.exports = {
  createEmbedding,
  buildResumeText,
};
