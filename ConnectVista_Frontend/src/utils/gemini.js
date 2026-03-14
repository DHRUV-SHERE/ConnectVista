import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Get API Key from environment
 */
const getApiKey = () => import.meta.env.VITE_GEMINI_API_KEY;

/**
 * List of prioritized models for fallback
 */
const RECOMMENDED_MODELS = [
  "gemini-2.5-flash",        // Primary focus
  "gemini-3-flash",          // Fallback 1
  "gemini-2.5-flash-lite",   // Fallback 2
  "gemini-3.1-flash-lite",   // Fallback 3
  "gemma-3-27b",             // Fallback 4
  "gemma-3-12b",             // Fallback 5
  "gemma-3-4b",              // Fallback 6
  "gemma-3-2b",              // Fallback 7
  "gemma-3-1b",              // Fallback 8
  "gemini-2.0-flash",        // Legacy fallback
  "gemini-1.5-flash"         // Base fallback
];

/**
 * Generate a review comment based on stars and optional tags
 * @param {number} rating - Star rating (1-5)
 * @param {string[]} tags - Optional quality tags (e.g., "Punctual", "Clean")
 * @param {string} serviceName - Name of the service provided
 * @returns {Promise<string>} - Generated review text
 */
export const generateAIReview = async (rating, tags = [], serviceName = "") => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing in .env file");
    return "";
  }

  const prompt = `
    You are an AI assistant helping a user write a review for a service provider on a platform called ConnectVista.
    
    Service: ${serviceName}
    Rating: ${rating} out of 5 stars
    Selected Qualities: ${tags.join(", ") || "None specified"}
    
    Instructions:
    1. Write a natural-sounding, concise review (2-3 sentences).
    2. The tone should match the star rating.
    3. If tags are provided, include those points in the review.
    4. Do not use placeholders. Write the final text.
    5. Only return the review text itself.
  `;

  // Try each model until one works
  for (const modelName of RECOMMENDED_MODELS) {
    try {
      console.log(`Attempting AI generation with model: ${modelName}`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      if (text) {
        console.log(`Successfully generated review using ${modelName}`);
        return text;
      }
    } catch (error) {
      console.warn(`Model ${modelName} failed or not found, trying next...`, error.message);
      // Continue to next model in loop
      continue;
    }
  }

  console.error("All AI models failed to generate a review.");
  return "";
};

/**
 * Get suggested tags based on service type
 * @param {string} serviceType - Type of service
 * @returns {string[]} - Array of suggested tags
 */
export const getReviewTags = (serviceType = "") => {
  const commonTags = ["Professional", "Punctual", "Great Value", "Polite", "Expert", "Reliable"];
  
  const specializedTags = {
    "plumbing": ["Clean work", "Fast leak fix", "Knowledgable"],
    "cleaning": ["Spotless", "Deep cleaning", "Attentive to detail"],
    "electrical": ["Safety focused", "Quick diagnosis", "Professional tools"],
    "tutoring": ["Patient", "Clear explanations", "Effective"],
    "beauty": ["Talented", "Used good products", "Relaxing"]
  };

  const type = (serviceType || "").toLowerCase();
  for (const key in specializedTags) {
    if (type.includes(key)) {
      return [...commonTags, ...specializedTags[key]];
    }
  }

  return commonTags;
};
