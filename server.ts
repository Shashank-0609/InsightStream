import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini API Setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API routes
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { dataSummary, dataStats, columnInfo, totalRows } = req.body;
      console.log("Analyzing data summary...");
      
      const prompt = `Analyze this dataset summary and provide professional business insights.
      Total Records: ${totalRows}
      Column Info: ${JSON.stringify(columnInfo)}
      Statistical Summary: ${JSON.stringify(dataStats)}
      Sample Data: ${JSON.stringify(dataSummary)}
      
      Task:
      - Provide a high-level executive summary (2-3 sentences).
      - Identify 3-4 key mathematical/statistical observations (trends, anomalies, correlations) based on the stats provided.
      - Suggest 2-3 actionable business recommendations.
      
      Return ONLY a JSON object. No markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              insights: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["summary", "insights", "recommendations"]
          }
        }
      });

      const responseText = response.text || "{}";
      res.json(JSON.parse(responseText.trim().replace(/^```json/, '').replace(/```$/, '')));
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Analysis service currently unavailable. Please try again later." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
