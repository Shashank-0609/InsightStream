# InsightStream Dashboard

A professional, AI-powered data visualization platform built with React, Tailwind CSS, and Gemini AI.

## Features

- **Dynamic Data Parsing**: Support for CSV and JSON datasets.
- **Interactive Visualizations**: Multiple chart types (Bar, Line, Area, Pie, Scatter, Radar) with dynamic axis selection.
- **AI Intelligence**: Automated dataset analysis and business recommendations powered by Google's Gemini AI.
- **Professional Export**: Download reports as PDF or export filtered data as CSV.
- **Responsive & Modern**: Fully responsive design with Dark/Light mode support.
- **SaaS Aesthetics**: Clean, polished UI using shadcn/ui and Framer Motion.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Recharts, Framer Motion.
- **Backend**: Express (Node.js), Google Generative AI (@google/genai).
- **Tools**: Vite, shadcn/ui.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   - Create a `.env` file based on `.env.example`.
   - Add your `GEMINI_API_KEY`.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## Connectivity

- To connect your own dataset, click on the **Upload Dataset** area in the dashboard or dataset tab.
- The application automatically detects column types and adapts the visualization controls.

## Future Enhancements

- Real-time data streaming support.
- Collaborative shared dashboards.
- Advanced filtering with custom SQL-like queries.
- Multi-dataset comparison.
