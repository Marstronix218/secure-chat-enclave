import { toast } from "@/lib/toast";

const API_BASE_URL = "http://localhost:5000/api";

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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    return await response.json();
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
    const encryptResult = await fetchApi('encrypt_prompt', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    
    const { encrypted_prompt } = encryptResult;
    
    // Send encrypted prompt to TEE and get encrypted response
    const responseResult = await fetchApi('generate_text', {
      method: 'POST',
      body: JSON.stringify({ encrypted_prompt }),
    });
    
    const { encrypted_response } = responseResult;
    
    // Decrypt the response
    const decryptResult = await fetchApi('decrypt_response', {
      method: 'POST',
      body: JSON.stringify({ encrypted_response }),
    });
    
    return {
      success: true,
      encryptedPrompt: encrypted_prompt,
      encryptedResponse: encrypted_response,
      decryptedResponse: decryptResult.decrypted_response
    };
  } catch (error) {
    console.error("Failed to process chat message:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error" 
    };
  }
}

// Clear chat history (frontend only)
export async function clearChatHistory() {
  // This is handled in the frontend state, no backend call needed
  return { success: true, message: "Chat history cleared" };
}
