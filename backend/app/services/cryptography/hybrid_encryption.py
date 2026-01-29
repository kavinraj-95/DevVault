from Crypto.PublicKey import RSA
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes
import base64

def generate_key_pair():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key.decode('utf-8'), public_key.decode('utf-8')

def encrypt_message(message: str, public_key_str: str):
    # 1. Generate AES Session Key
    session_key = get_random_bytes(16)

    # 2. Encrypt AES key with RSA Public Key
    recipient_key = RSA.import_key(public_key_str)
    cipher_rsa = PKCS1_OAEP.new(recipient_key)
    enc_session_key = cipher_rsa.encrypt(session_key)

    # 3. Encrypt Message with AES Session Key
    cipher_aes = AES.new(session_key, AES.MODE_EAX)
    ciphertext, tag = cipher_aes.encrypt_and_digest(message.encode("utf-8"))

    return {
        "enc_session_key": base64.b64encode(enc_session_key).decode("utf-8"),
        "nonce": base64.b64encode(cipher_aes.nonce).decode("utf-8"),
        "tag": base64.b64encode(tag).decode("utf-8"),
        "ciphertext": base64.b64encode(ciphertext).decode("utf-8")
    }

def decrypt_message(encrypted_data: dict, private_key_str: str):
    # 1. Decrypt AES Session Key with RSA Private Key
    private_key = RSA.import_key(private_key_str)
    cipher_rsa = PKCS1_OAEP.new(private_key)
    enc_session_key = base64.b64decode(encrypted_data["enc_session_key"])
    session_key = cipher_rsa.decrypt(enc_session_key)

    # 2. Decrypt Message with AES Session Key
    nonce = base64.b64decode(encrypted_data["nonce"])
    tag = base64.b64decode(encrypted_data["tag"])
    ciphertext = base64.b64decode(encrypted_data["ciphertext"])

    cipher_aes = AES.new(session_key, AES.MODE_EAX, nonce)
    data = cipher_aes.decrypt_and_verify(ciphertext, tag)
    return data.decode("utf-8")
