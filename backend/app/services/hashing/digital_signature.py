from Crypto.PublicKey import RSA
from Crypto.Signature import pkcs1_15
from Crypto.Hash import SHA256
import base64

def sign_data(data: str, private_key_str: str):
    key = RSA.import_key(private_key_str)
    h = SHA256.new(data.encode('utf-8'))
    signature = pkcs1_15.new(key).sign(h)
    return base64.b64encode(signature).decode('utf-8')

def verify_signature(data: str, signature: str, public_key_str: str):
    key = RSA.import_key(public_key_str)
    h = SHA256.new(data.encode('utf-8'))
    try:
        pkcs1_15.new(key).verify(h, base64.b64decode(signature))
        return True
    except (ValueError, TypeError):
        return False
