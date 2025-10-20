
export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: [{
    type: string;
    text: string;
  }];
  model: string;
  stop_reason: string | null;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Send a message to Claude AI and get a response
 */
export const sendMessageToClaude = async (
  messages: ClaudeMessage[],
  apiKey: string
): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219",
        max_tokens: 1024,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to communicate with Claude AI');
    }

    const data: ClaudeResponse = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error communicating with Claude AI:', error);
    throw error;
  }
};
