def dna_encode(data: str):
    """
    Encode ascii string to DNA sequence.
    ASCII -> Binary -> DNA (00=A, 01=C, 10=G, 11=T)
    """
    mapping = {'00': 'A', '01': 'C', '10': 'G', '11': 'T'}
    binary = ''.join(format(ord(char), '08b') for char in data)
    dna = []
    for i in range(0, len(binary), 2):
        pair = binary[i:i+2]
        dna.append(mapping.get(pair, ''))
    return "".join(dna)

def dna_decode(dna: str):
    rev_mapping = {'A': '00', 'C': '01', 'G': '10', 'T': '11'}
    binary = []
    for char in dna:
        binary.append(rev_mapping.get(char, ''))
    binary_str = "".join(binary)
    
    chars = []
    for i in range(0, len(binary_str), 8):
        byte = binary_str[i:i+8]
        if len(byte) == 8:
            chars.append(chr(int(byte, 2)))
    return "".join(chars)
