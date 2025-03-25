// import { toast } from "@/lib/toast";

const API_BASE_URL = "http://52.194.95.181:8501/api";     // set elastic public ip url for the control plane

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
    // Step 1: Encrypt prompt with Key A
    const encryptRes = await fetch("http://52.194.95.181:8080/api/encrypt_prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const encryptData = await encryptRes.json();
    if (!encryptData.success && !encryptData.encrypted_prompt) throw new Error(encryptData.message);

    const encryptedPrompt = encryptData.encrypted_prompt;

    // Step 2: Generate text in the TEE (Data Plane)
    const generateRes = await fetch("http://57.182.161.85:5000/generate_text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted_prompt: encryptedPrompt }),
    });
    const encryptedResponse = await generateRes.arrayBuffer(); // bytes

    // Step 3: Decrypt response
    const decryptRes = await fetch("http://52.194.95.181:8080/api/decrypt_response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ encrypted_response: Array.from(new Uint8Array(encryptedResponse)) }), // convert to array of numbers
    });
    const decryptData = await decryptRes.json();

    if (!decryptData.success && !decryptData.decrypted_response) throw new Error(decryptData.message);

    return {
      success: true,
      encryptedPrompt: "[Encrypted Prompt]",
      encryptedResponse: "[Encrypted Response]",
      decryptedResponse: decryptData.decrypted_response,
    };
  } catch (err: any) {
    console.error(err);
    return { success: false, message: err.message };
  }
}

// Clear chat history (frontend only)
export async function clearChatHistory() {
  // This is handled in the frontend state, no backend call needed
  return { success: true, message: "Chat history cleared" };
}
