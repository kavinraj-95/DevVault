# DevVault: Quantum-Resistant Secure Code Collaboration Platform

DevVault is a state-of-the-art secure coding platform demonstrating advanced security concepts including Post-Quantum Cryptography, Behavioral Biometrics, and Lattice-Based Access Control.

## Features Implemented (Week 1-6)

### Week 1: Authentication & MFA
- **User Registration/Login**: Secure access with JWT sessions.
- **MFA**: Time-based One-Time Password (TOTP) integration with QR Code setup (Google Authenticator compatible).

### Week 2: Access Control
- **Role-Based Access Control (RBAC)**: Developer, Architect, Admin roles.
- **Bell-LaPadula Model**: "No Write Down, No Read Up" enforcement based on clearance levels (Unclassified, Confidential, Secret, Top Secret).
- **Secure Code Repository**: Manage code files with strict classification labels.

### Week 3: Cryptography
- **Hybrid Encryption**: AES-256 for data + RSA-2048 for key exchange.
- **Threshold Cryptography**: Shamir's Secret Sharing Scheme (split secrets among multiple stakeholders).

### Week 4: Hashing & Signatures
- **Merkle Trees**: Verify integrity of codebases.
- **Digital Signatures**: RSA-based signing and verification of code commits.

### Week 5: Encoding & Steganography
- **DNA Encoding**: Encode biological data patterns in text.

## How to Use

### Prerequisites
- Python 3.10+
- Node.js 18+
- `uv` (Python package manager)

### Backend Setup
1. Navigate to backend:
   ```bash
   cd DevVault/backend
   ```
2. Run with `uv` (automatically installs dependencies):
   ```bash
   uv run python run.py
   ```
   Server starts at `http://localhost:8000`.

### Frontend Setup
1. Navigate to frontend:
   ```bash
   cd DevVault/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`.

### Walkthrough
1. **Register**: Create an account (e.g., `alice`). Role defaults to `Developer` (Confidential).
2. **Dashboard**: Setup MFA by scanning the QR code with an authenticator app (or just copying the secret).
3. **Docs/Repos**: Try to create a "Top Secret" repository. It will fail if you are a "Developer" (No Write Up/Down rules applied strictly).
4. **Crypto Lab**: Use the API to encrypt messages or split secrets.

## Project Structure
- `backend/`: FastAPI application with modular services.
- `frontend/`: React + Tailwind application.
- `database/`: SQLite database (auto-created).

## Tech Stack
- **Backend**: FastAPI, SQLAlchemy, Python-Jose, PyCryptodome.
- **Frontend**: React, TailwindCSS, Framer Motion, Axios.
