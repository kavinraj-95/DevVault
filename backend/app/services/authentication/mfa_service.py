import pyotp
import qrcode
import io
import base64

def generate_mfa_secret():
    return pyotp.random_base32()

def get_totp_uri(secret, username, issuer="DevVault"):
    return pyotp.totp.TOTP(secret).provisioning_uri(name=username, issuer_name=issuer)

def verify_totp(secret, token):
    totp = pyotp.TOTP(secret)
    return totp.verify(token)

def generate_qr_code_base64(uri):
    img = qrcode.make(uri)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode("utf-8")
