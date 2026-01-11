import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get current weather for a location",
  inputSchema: z.object({
    location: z.string().describe("City name"),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    conditions: z.string(),
    humidity: z.number(),
  }),
  execute: async ({ location }) => {
    // Mock weather data for testing
    const mockWeather: Record<
      string,
      { temperature: number; conditions: string; humidity: number }
    > = {
      "new york": {
        temperature: 72,
        conditions: "Partly cloudy",
        humidity: 65,
      },
      london: { temperature: 58, conditions: "Overcast", humidity: 80 },
      tokyo: { temperature: 68, conditions: "Clear", humidity: 55 },
      paris: { temperature: 64, conditions: "Light rain", humidity: 75 },
    };

    const normalizedLocation = location.toLowerCase();
    const weather = mockWeather[normalizedLocation] || {
      temperature: 70,
      conditions: "Sunny",
      humidity: 50,
    };

    return weather;
  },
});
