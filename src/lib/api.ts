// No need to import toast in this file as it's not used directly

// Determine if we're in a development environment or not
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Set API base URL based on environment
const API_BASE_URL = isDevelopment 
  ? "http://localhost:5000/api"  // Use localhost in development
  : "https://eaglys-tee-demo-api.onrender.com/api";  // Use a deployed API in production

// Base API request function
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Try to get error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      } catch (parseError) {
        // If we can't parse the error response, just use the status
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
    }

    // For empty responses, return an empty object rather than trying to parse
    if (response.headers.get('content-length') === '0' || 
        response.status === 204) {
      return { success: true };
    }

    // Safely parse JSON response, handle empty or invalid JSON
    try {
      return await response.json();
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", jsonError);
      return { success: true, message: "Operation completed but no valid JSON returned" };
    }
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Key Directory Management
export async function createKeyDirectory() {
  try {
    const result = await fetchApi('create_key_directory');
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Failed to create key directory:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Server Key Retrieval
export async function retrieveServerKey() {
  try {
    const result = await fetchApi('retrieve_server_key');
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Failed to retrieve server key:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Key Generation
export async function generateKey(keyName: string) {
  try {
    const result = await fetchApi('generate_key', {
      method: 'POST',
      body: JSON.stringify({ key_name: keyName }),
    });
    return { success: true, message: result.message };
  } catch (error) {
    console.error(`Failed to generate key ${keyName}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Encrypt Key A
export async function encryptKeyA() {
  try {
    const result = await fetchApi('encrypt_key_a');
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Failed to encrypt Key A:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Send Encrypted Key A to TEE
export async function sendEncryptedKeyA() {
  try {
    const result = await fetchApi('send_encrypted_key_a');
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Failed to send encrypted Key A:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Send Public Key B to TEE
export async function sendPublicKeyB() {
  try {
    const result = await fetchApi('send_public_key_b');
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Failed to send public Key B:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Delete specific key
export async function deleteKey(keyName: string) {
  try {
    const result = await fetchApi('delete_key', {
      method: 'POST',
      body: JSON.stringify({ key_name: keyName }),
    });
    return { success: true, message: result.message };
  } catch (error) {
    console.error(`Failed to delete key ${keyName}:`, error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Delete all keys
export async function deleteAllKeys() {
  try {
    const result = await fetchApi('delete_all_keys');
    return { success: true, message: result.message };
  } catch (error) {
    console.error("Failed to delete all keys:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}

// Chat functions

// Encrypt and send prompt to TEE
export async function encryptAndSendPrompt(prompt: string) {
  try {
    // If API is unreachable, we'll simulate the responses for demo purposes
    let isSimulated = false;
    let encryptResult;
    
    try {
      encryptResult = await fetchApi('encrypt_prompt', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });
    } catch (error) {
      console.log("API unreachable, using simulated response");
      isSimulated = true;
      encryptResult = {
        success: true,
        encrypted_prompt: "SIMULATED-ENCRYPTED-" + Math.random().toString(36).substring(2, 10)
      };
    }
    
    const { encrypted_prompt } = encryptResult;
    
    // Send encrypted prompt to TEE and get encrypted response
    let responseResult;
    try {
      if (!isSimulated) {
        responseResult = await fetchApi('generate_text', {
          method: 'POST',
          body: JSON.stringify({ encrypted_prompt }),
        });
      } else {
        responseResult = {
          success: true,
          encrypted_response: "SIMULATED-RESPONSE-" + Math.random().toString(36).substring(2, 10)
        };
      }
    } catch (error) {
      console.log("API unreachable for text generation, using simulated response");
      isSimulated = true;
      responseResult = {
        success: true,
        encrypted_response: "SIMULATED-RESPONSE-" + Math.random().toString(36).substring(2, 10)
      };
    }
    
    const { encrypted_response } = responseResult;
    
    // Decrypt the response
    let decryptResult;
    try {
      if (!isSimulated) {
        decryptResult = await fetchApi('decrypt_response', {
          method: 'POST',
          body: JSON.stringify({ encrypted_response }),
        });
      } else {
        decryptResult = {
          success: true,
          decrypted_response: `This is a simulated response since the API is currently unavailable. You asked: "${prompt}"\n\nIn a real implementation, this response would be genuinely processed within a Trusted Execution Environment (TEE).`
        };
      }
    } catch (error) {
      console.log("API unreachable for decryption, using simulated response");
      decryptResult = {
        success: true,
        decrypted_response: `This is a simulated response since the API is currently unavailable. You asked: "${prompt}"\n\nIn a real implementation, this response would be genuinely processed within a Trusted Execution Environment (TEE).`
      };
    }
    
    return {
      success: true,
      encryptedPrompt: encrypted_prompt,
      encryptedResponse: encrypted_response,
      decryptedResponse: decryptResult.decrypted_response,
      isSimulated: isSimulated
    };
  } catch (error) {
    console.error("Failed to process chat message:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error",
      encryptedPrompt: "ERROR-ENCRYPTED",
      encryptedResponse: "ERROR-RESPONSE",
      decryptedResponse: `I apologize, but I encountered an error processing your message. This is likely due to API connectivity issues. Your message was: "${prompt}"`,
      isSimulated: true
    };
  }
}

// Clear chat history (frontend only)
export async function clearChatHistory() {
  // This is handled in the frontend state, no backend call needed
  return { success: true, message: "Chat history cleared" };
}
