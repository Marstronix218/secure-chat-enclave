
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Util.Padding import pad, unpad
import base64

# Constants
RSA_KEY_SIZE = 2048

def encrypt_by_chunk(data, public_key_data):
    """
    Encrypt data using RSA public key with chunking for larger data.
    
    Args:
        data (bytes): Data to encrypt
        public_key_data (bytes): RSA public key in binary format
    
    Returns:
        bytes: Base64-encoded encrypted data
    """
    try:
        public_key = RSA.import_key(public_key_data)
        cipher = PKCS1_OAEP.new(public_key)
        
        # Calculate chunk size (key size in bytes - 42 bytes for PKCS#1 OAEP padding)
        key_size_bytes = public_key.size_in_bytes()
        chunk_size = key_size_bytes - 42
        
        # Process data in chunks
        encrypted_chunks = []
        for i in range(0, len(data), chunk_size):
            chunk = data[i:i+chunk_size]
            encrypted_chunk = cipher.encrypt(chunk)
            encrypted_chunks.append(encrypted_chunk)
        
        # Combine chunks and encode as base64
        encrypted_data = b''.join(encrypted_chunks)
        return base64.b64encode(encrypted_data)
    
    except Exception as e:
        print(f"Encryption error: {e}")
        raise

def decrypt_by_chunk(encrypted_data, private_key_data):
    """
    Decrypt data using RSA private key with chunking for larger data.
    
    Args:
        encrypted_data (bytes or str): Base64-encoded encrypted data
        private_key_data (bytes): RSA private key in binary format
    
    Returns:
        bytes: Decrypted data
    """
    try:
        # Handle string input for encrypted_data
        if isinstance(encrypted_data, str):
            encrypted_data = encrypted_data.encode('utf-8')
        
        # Decode from base64
        encrypted_data = base64.b64decode(encrypted_data)
        
        private_key = RSA.import_key(private_key_data)
        cipher = PKCS1_OAEP.new(private_key)
        
        # Calculate chunk size (key size in bytes)
        key_size_bytes = private_key.size_in_bytes()
        
        # Process data in chunks
        decrypted_chunks = []
        for i in range(0, len(encrypted_data), key_size_bytes):
            chunk = encrypted_data[i:i+key_size_bytes]
            decrypted_chunk = cipher.decrypt(chunk)
            decrypted_chunks.append(decrypted_chunk)
        
        # Combine chunks
        return b''.join(decrypted_chunks)
    
    except Exception as e:
        print(f"Decryption error: {e}")
        raise

# Additional utility functions
def generate_key_pair(key_size=RSA_KEY_SIZE):
    """
    Generate a new RSA key pair.
    
    Args:
        key_size (int): Size of the RSA key in bits
    
    Returns:
        tuple: (private_key, public_key) as RSA key objects
    """
    key = RSA.generate(key_size)
    private_key = key
    public_key = key.publickey()
    return private_key, public_key

def export_key(key, is_private=True):
    """
    Export an RSA key to bytes.
    
    Args:
        key: RSA key object
        is_private (bool): Whether the key is private
    
    Returns:
        bytes: Exported key data
    """
    if is_private:
        return key.export_key()
    else:
        return key.publickey().export_key()

def import_key(key_data):
    """
    Import an RSA key from bytes.
    
    Args:
        key_data (bytes): Key data
    
    Returns:
        RSA key object
    """
    return RSA.import_key(key_data)
