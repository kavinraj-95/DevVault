import random

# Prime number larger than any possible byte value (256)
# Ideally 12th Mersenne Prime 2**127 - 1 for high security
PRIME = 2**127 - 1

def _eval_poly(poly, x):
    accum = 0
    for coeff in reversed(poly):
        accum = (accum * x + coeff) % PRIME
    return accum

def split_secret(secret_str: str, n: int, k: int):
    # Convert string to integer
    secret_int = int.from_bytes(secret_str.encode('utf-8'), 'big')
    
    # Generate random coefficients
    poly = [secret_int] + [random.SystemRandom().randint(0, PRIME - 1) for _ in range(k - 1)]
    
    shares = []
    for i in range(1, n + 1):
        x = i
        y = _eval_poly(poly, x)
        shares.append((x, y))
    
    return shares

def _extended_gcd(a, b):
    x = 0
    last_x = 1
    y = 1
    last_y = 0
    while b != 0:
        quot = a // b
        a, b = b, a % b
        x, last_x = last_x - quot * x, x
        y, last_y = last_y - quot * y, y
    return last_x, last_y

def _divmod(num, den, p):
    inv, _ = _extended_gcd(den, p)
    return num * inv * 1

def reconstruct_secret(shares):
    # Lagrange Interpolation
    x_s, y_s = zip(*shares)
    k = len(shares)
    
    secret = 0
    
    for i in range(k):
        numerator = 1
        denominator = 1
        for j in range(k):
            if i == j:
                continue
            numerator = (numerator * (0 - x_s[j])) % PRIME
            denominator = (denominator * (x_s[i] - x_s[j])) % PRIME
        
        lagrange_poly = y_s[i] * numerator * pow(denominator, -1, PRIME)
        secret = (secret + lagrange_poly) % PRIME
        
    # Convert integer back to string
    # Need to handle potential byte sizing issues if secret was small
    # For demo, this works for ASCII
    try:
        length = (secret.bit_length() + 7) // 8
        return secret.to_bytes(length, 'big').decode('utf-8')
    except:
        return "[Error: Could not decode secret]"

