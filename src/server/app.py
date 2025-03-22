
import os
import shutil
from flask import Flask, request, jsonify
from flask_cors import CORS
from Crypto.PublicKey import RSA
from utils import encrypt_by_chunk, decrypt_by_chunk, RSA_KEY_SIZE

app = Flask(__name__)
CORS(app)

# Constants
KEY_DIRECTORY = "/tmp/secure_chat_keys"

# Create key directory if it doesn't exist
if not os.path.exists(KEY_DIRECTORY):
    os.makedirs(KEY_DIRECTORY)

@app.route('/api/create_key_directory', methods=['GET'])
def create_key_directory():
    """Create a key directory for storing RSA keys."""
    try:
        if not os.path.exists(KEY_DIRECTORY):
            os.mkdir(KEY_DIRECTORY)
        return jsonify({
            "status": "success",
            "message": f"Key directory created at {KEY_DIRECTORY}."
        })
    except OSError as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to create directory: {str(e)}"
        }), 500

@app.route('/api/retrieve_server_key', methods=['GET'])
def retrieve_server_key():
    """Simulates retrieving the server's public key."""
    try:
        # In a real application, this would make a vSock request to the Nitro Enclave
        # For demo purposes, we'll generate a server key locally
        server_key = RSA.generate(RSA_KEY_SIZE)
        file_path = os.path.join(KEY_DIRECTORY, "server_key.bin")
        
        with open(file_path, "wb") as f:
            f.write(server_key.export_key())
            
        return jsonify({
            "status": "success",
            "message": "Server public key retrieved and saved to server_key.bin."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to retrieve server key: {str(e)}"
        }), 500

@app.route('/api/generate_key', methods=['POST'])
def generate_key():
    """Generate a new RSA key pair."""
    try:
        data = request.json
        key_name = data.get('key_name')
        
        if not key_name:
            return jsonify({
                "status": "error",
                "message": "Key name is required."
            }), 400
            
        key = RSA.generate(RSA_KEY_SIZE)
        private_key_path = os.path.join(KEY_DIRECTORY, f"{key_name}_private.pem")
        public_key_path = os.path.join(KEY_DIRECTORY, f"{key_name}_public.pem")
        
        with open(private_key_path, "wb") as f:
            f.write(key.export_key())
        with open(public_key_path, "wb") as f:
            f.write(key.publickey().export_key())
            
        return jsonify({
            "status": "success",
            "message": f"Key {key_name} generated and saved."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to generate key: {str(e)}"
        }), 500

@app.route('/api/encrypt_key_a', methods=['GET'])
def encrypt_key_a():
    """Encrypt key A using the server's public key."""
    try:
        private_key_path = os.path.join(KEY_DIRECTORY, "key_a_private.pem")
        server_key_path = os.path.join(KEY_DIRECTORY, "server_key.bin")
        
        if not os.path.exists(private_key_path) or not os.path.exists(server_key_path):
            return jsonify({
                "status": "error",
                "message": "Key A private key or server key not found."
            }), 404
            
        with open(private_key_path, "rb") as pk_file:
            private_key = pk_file.read()
            
        with open(server_key_path, "rb") as sk_file:
            server_key = sk_file.read()
            
        encrypted_key_a = encrypt_by_chunk(private_key, server_key)
        
        # Save the encrypted key for later use
        encrypted_key_path = os.path.join(KEY_DIRECTORY, "key_a_encrypted.bin")
        with open(encrypted_key_path, "wb") as f:
            f.write(encrypted_key_a)
            
        return jsonify({
            "status": "success",
            "message": "Key A (private key) encrypted successfully."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to encrypt Key A: {str(e)}"
        }), 500

@app.route('/api/send_encrypted_key_a', methods=['GET'])
def send_encrypted_key_a():
    """Send the encrypted Key A to the TEE."""
    try:
        encrypted_key_path = os.path.join(KEY_DIRECTORY, "key_a_encrypted.bin")
        
        if not os.path.exists(encrypted_key_path):
            return jsonify({
                "status": "error",
                "message": "Encrypted Key A not found."
            }), 404
            
        # In a real application, this would send the encrypted key to the Nitro Enclave
        # For demo purposes, we'll just acknowledge the request
        
        return jsonify({
            "status": "success",
            "message": "Encrypted Key A sent to the TEE successfully."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to send encrypted Key A: {str(e)}"
        }), 500

@app.route('/api/send_public_key_b', methods=['GET'])
def send_public_key_b():
    """Send Key B (public) to the TEE."""
    try:
        public_key_b_path = os.path.join(KEY_DIRECTORY, "key_b_public.pem")
        
        if not os.path.exists(public_key_b_path):
            return jsonify({
                "status": "error",
                "message": "Key B public key not found."
            }), 404
            
        # In a real application, this would send the public key to the Nitro Enclave
        # For demo purposes, we'll just acknowledge the request
        
        return jsonify({
            "status": "success",
            "message": "Key B (public) sent to the TEE successfully."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to send Key B public key: {str(e)}"
        }), 500

@app.route('/api/delete_key', methods=['POST'])
def delete_key():
    """Delete a specific key."""
    try:
        data = request.json
        key_name = data.get('key_name')
        
        if not key_name:
            return jsonify({
                "status": "error",
                "message": "Key name is required."
            }), 400
            
        private_key_path = os.path.join(KEY_DIRECTORY, f"{key_name}_private.pem")
        public_key_path = os.path.join(KEY_DIRECTORY, f"{key_name}_public.pem")
        
        files_deleted = 0
        
        if os.path.exists(private_key_path):
            os.remove(private_key_path)
            files_deleted += 1
            
        if os.path.exists(public_key_path):
            os.remove(public_key_path)
            files_deleted += 1
            
        if files_deleted == 0:
            return jsonify({
                "status": "error",
                "message": f"No keys found for {key_name}."
            }), 404
            
        return jsonify({
            "status": "success",
            "message": f"Deleted {files_deleted} files for key {key_name}."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to delete key: {str(e)}"
        }), 500

@app.route('/api/delete_all_keys', methods=['GET'])
def delete_all_keys():
    """Delete all keys."""
    try:
        if os.path.exists(KEY_DIRECTORY):
            shutil.rmtree(KEY_DIRECTORY)
            os.makedirs(KEY_DIRECTORY)
            
        return jsonify({
            "status": "success",
            "message": "All keys deleted successfully."
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to delete all keys: {str(e)}"
        }), 500

@app.route('/api/encrypt_prompt', methods=['POST'])
def encrypt_prompt():
    """Encrypt a prompt using Key A public key."""
    try:
        data = request.json
        prompt = data.get('prompt')
        
        if not prompt:
            return jsonify({
                "status": "error",
                "message": "Prompt is required."
            }), 400
            
        key_a_public_path = os.path.join(KEY_DIRECTORY, "key_a_public.pem")
        
        if not os.path.exists(key_a_public_path):
            return jsonify({
                "status": "error",
                "message": "Key A public key not found."
            }), 404
            
        with open(key_a_public_path, "rb") as f:
            key_a_public = f.read()
            
        encrypted_prompt = encrypt_by_chunk(prompt.encode("utf-8"), key_a_public)
        
        return jsonify({
            "status": "success",
            "encrypted_prompt": encrypted_prompt
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to encrypt prompt: {str(e)}"
        }), 500

@app.route('/api/generate_text', methods=['POST'])
def generate_text():
    """Simulate the TEE processing the encrypted prompt and returning an encrypted response."""
    try:
        data = request.json
        encrypted_prompt = data.get('encrypted_prompt')
        
        if not encrypted_prompt:
            return jsonify({
                "status": "error",
                "message": "Encrypted prompt is required."
            }), 400
            
        # In a real application, this would be sent to the Nitro Enclave
        # Here we simulate decryption with Key A private, processing, and encryption with Key B public
        
        # For simplicity, we'll just create a mock response that depends on the hash of the input
        import hashlib
        
        # Create a hash of the encrypted prompt to deterministically generate a response
        hash_obj = hashlib.md5(str(encrypted_prompt).encode())
        hash_digest = hash_obj.hexdigest()
        
        # Generate a mock response based on the hash
        responses = [
            "I'm processing your request securely within the TEE environment.",
            "Your encrypted message has been processed. All operations occurred in the secure enclave.",
            "The data you provided was handled with end-to-end encryption throughout.",
            "I've analyzed your input while maintaining complete confidentiality.",
            "Your request was processed in an isolated trusted execution environment for maximum security."
        ]
        
        # Use the hash to select a response
        response_index = int(hash_digest, 16) % len(responses)
        response_text = responses[response_index]
        
        # Now "encrypt" the response with Key B public key
        key_b_public_path = os.path.join(KEY_DIRECTORY, "key_b_public.pem")
        
        if not os.path.exists(key_b_public_path):
            return jsonify({
                "status": "error",
                "message": "Key B public key not found."
            }), 404
            
        with open(key_b_public_path, "rb") as f:
            key_b_public = f.read()
            
        encrypted_response = encrypt_by_chunk(response_text.encode("utf-8"), key_b_public)
        
        return jsonify({
            "status": "success",
            "encrypted_response": encrypted_response
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to generate text: {str(e)}"
        }), 500

@app.route('/api/decrypt_response', methods=['POST'])
def decrypt_response():
    """Decrypt the response using Key B private key."""
    try:
        data = request.json
        encrypted_response = data.get('encrypted_response')
        
        if not encrypted_response:
            return jsonify({
                "status": "error",
                "message": "Encrypted response is required."
            }), 400
            
        key_b_private_path = os.path.join(KEY_DIRECTORY, "key_b_private.pem")
        
        if not os.path.exists(key_b_private_path):
            return jsonify({
                "status": "error",
                "message": "Key B private key not found."
            }), 404
            
        with open(key_b_private_path, "rb") as f:
            key_b_private = f.read()
            
        decrypted_response = decrypt_by_chunk(encrypted_response, key_b_private).decode("utf-8")
        
        return jsonify({
            "status": "success",
            "decrypted_response": decrypted_response
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to decrypt response: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
