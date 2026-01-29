import hashlib

class MerkleNode:
    def __init__(self, left, right, value):
        self.left = left
        self.right = right
        self.value = value

    @staticmethod
    def hash(val):
        return hashlib.sha256(val.encode('utf-8')).hexdigest()

def build_merkle_tree(leaves: list):
    nodes = [MerkleNode(None, None, MerkleNode.hash(leaf)) for leaf in leaves]
    
    if not nodes:
        return None

    while len(nodes) > 1:
        temp_nodes = []
        for i in range(0, len(nodes), 2):
            left = nodes[i]
            if i + 1 < len(nodes):
                right = nodes[i + 1]
                combined_hash = hashlib.sha256((left.value + right.value).encode('utf-8')).hexdigest()
                temp_nodes.append(MerkleNode(left, right, combined_hash))
            else:
                temp_nodes.append(left) # Odd one out, carry up
        nodes = temp_nodes
    
    return nodes[0] # Root

def get_merkle_root(leaves: list):
    root = build_merkle_tree(leaves)
    return root.value if root else ""
