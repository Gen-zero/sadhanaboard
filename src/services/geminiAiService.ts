// Gemini API Service for AI-powered text enhancement
const GEMINI_API_KEY = 'AIzaSyBas50-LKDTR7mWNAbuiOf9N9vSam8a_64';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface AIEnhancementPrompt {
  type: 'purpose' | 'goal' | 'message';
  userInput: string;
}

export interface AIEnhancementResponse {
  enhanced: string;
  suggestions: string[];
}

const getPromptTemplate = (type: string, userInput: string): string => {
  const basePrompt = `You are a spiritual guide helping a practitioner articulate their spiritual intentions. 
Your role is to enhance and refine spiritual expressions while maintaining authenticity and the user's original intent.

User's input: "${userInput}"

`;

  switch (type) {
    case 'purpose':
      return `${basePrompt}
Task: Enhance this spiritual practice purpose statement. 
Make it more profound, clear, and spiritually resonant while keeping the user's core intention.
Provide 2-3 alternative enhanced versions that are concise (1-2 sentences each).
Format your response as:
ENHANCED: [primary enhanced version]
ALTERNATIVE_1: [alternative version 1]
ALTERNATIVE_2: [alternative version 2]`;

    case 'goal':
      return `${basePrompt}
Task: Refine this spiritual goal into a more specific, measurable, and meaningful objective.
Make it spiritually aligned and actionable while preserving the user's original desire.
Provide 2-3 alternative goal statements that are concise (1-2 sentences each).
Format your response as:
ENHANCED: [primary enhanced version]
ALTERNATIVE_1: [alternative version 1]
ALTERNATIVE_2: [alternative version 2]`;

    case 'message':
      return `${basePrompt}
Task: Transform this message into a more powerful, heartfelt expression that could be written on sacred paper.
Keep it authentic and personal while making it more poetic and spiritually meaningful.
Provide 2-3 alternative versions that are slightly longer (2-3 sentences each).
Format your response as:
ENHANCED: [primary enhanced version]
ALTERNATIVE_1: [alternative version 1]
ALTERNATIVE_2: [alternative version 2]`;

    default:
      return basePrompt;
  }
};

export const enhanceWithGemini = async (
  type: 'purpose' | 'goal' | 'message',
  userInput: string
): Promise<AIEnhancementResponse> => {
  if (!userInput.trim()) {
    throw new Error('Input cannot be empty');
  }

  try {
    const prompt = getPromptTemplate(type, userInput);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to enhance text with AI');
    }

    const data = await response.json();
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Parse the response
    const enhanced = extractSection(generatedText, 'ENHANCED') || userInput;
    const alt1 = extractSection(generatedText, 'ALTERNATIVE_1');
    const alt2 = extractSection(generatedText, 'ALTERNATIVE_2');

    const suggestions = [alt1, alt2].filter((s) => s && s !== enhanced);

    return {
      enhanced,
      suggestions,
    };
  } catch (error) {
    console.error('Gemini AI Enhancement Error:', error);
    throw error;
  }
};

const extractSection = (text: string, sectionName: string): string => {
  const regex = new RegExp(`${sectionName}:\\s*(.+?)(?=(?:ENHANCED|ALTERNATIVE_\\d|$))`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
};
