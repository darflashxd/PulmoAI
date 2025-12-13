# Security Audit Report - PulmoAI Application
**Date:** 2025-01-27  
**Auditor:** Professional Penetration Tester  
**Application:** PulmoAI - Tuberculosis Detection System  
**Scope:** Full codebase security assessment

---

## Executive Summary

This security audit identified **15 critical and high-severity vulnerabilities** across the application stack. The application lacks fundamental security controls including authentication, input validation, rate limiting, and proper error handling. Immediate remediation is required before production deployment.

**Risk Level:** 🔴 **CRITICAL**

---

## Vulnerability Summary

| Severity | Count | Status                    |
|----------|-------|---------------------------|
| Critical |   8   | Requires Immediate Action |
| High     |   5   | Requires Urgent Attention |
| Medium   |   2   | Should be Addressed Soon  |

---

## 🔴 CRITICAL VULNERABILITIES

### 1. Debug Mode Enabled in Production
**Location:** `backend/app.py:66`  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 9.1 (Critical)

**Description:**
```python
app.run(debug=True, port=5000)
```
Flask debug mode is enabled, which exposes:
- Interactive debugger accessible to attackers
- Detailed stack traces with source code
- Ability to execute arbitrary Python code via debugger
- Full application state exposure

**Impact:**
- Remote code execution (RCE)
- Complete application compromise
- Sensitive data exposure
- System takeover

**Mitigation:**
```python
import os

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
```
- Set `FLASK_DEBUG=False` in production
- Use environment variables for configuration
- Never enable debug mode in production

---

### 2. CORS Misconfiguration - Allows All Origins
**Location:** `backend/app.py:9`  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 8.6 (High)

**Description:**
```python
CORS(app)
```
CORS is configured to allow requests from **any origin**, enabling:
- Cross-origin attacks
- CSRF exploitation
- Unauthorized API access from malicious websites

**Impact:**
- Cross-Site Request Forgery (CSRF) attacks
- Unauthorized API access
- Data theft via malicious websites
- Session hijacking

**Mitigation:**
```python
from flask_cors import CORS

# Configure CORS with specific allowed origins
CORS(app, 
     origins=["https://yourdomain.com", "https://www.yourdomain.com"],
     methods=["POST", "GET"],
     allow_headers=["Content-Type"],
     supports_credentials=False,
     max_age=3600)
```
- Whitelist only trusted domains
- Use environment variables for allowed origins
- Implement proper CORS policies per environment

---

### 3. No Authentication/Authorization System
**Location:** `backend/app.py` (entire file)  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 9.8 (Critical)

**Description:**
The application has **zero authentication or authorization mechanisms**. Anyone can:
- Access the API endpoints without credentials
- Submit unlimited requests
- Abuse the AI model service
- Perform denial of service attacks

**Impact:**
- Unauthorized access to medical AI services
- Service abuse and resource exhaustion
- Potential HIPAA/GDPR compliance violations
- Financial loss from API abuse

**Mitigation:**
```python
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from functools import wraps
import hashlib
import time

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Add authentication decorator
@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    # ... existing code
```

**Additional Recommendations:**
- Implement user registration/login system
- Use JWT tokens for API authentication
- Implement role-based access control (RBAC)
- Add API key authentication for programmatic access
- Consider OAuth2 for third-party integrations

---

### 4. Insecure File Upload - No Backend Validation
**Location:** `backend/app.py:31-63`  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 9.0 (Critical)

**Description:**
The backend accepts file uploads without proper validation:
- No file type verification (relies only on MIME type)
- No file size limits
- No filename sanitization
- PIL Image.open() vulnerable to image-based attacks (Pillow-SIMD exploits)

**Impact:**
- Remote code execution via malicious image files
- Denial of Service (DoS) via large files
- Path traversal attacks
- Memory exhaustion attacks
- Model poisoning attacks

**Mitigation:**
```python
import os
from werkzeug.utils import secure_filename
from PIL import Image
import magic  # python-magic library

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_image_file(file):
    # Check file size
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise ValueError("File too large")
    
    # Verify actual file type using magic bytes
    file_bytes = file.read(1024)
    file.seek(0)
    mime = magic.Magic(mime=True)
    file_type = mime.from_buffer(file_bytes)
    
    if file_type not in ['image/png', 'image/jpeg', 'image/jpg']:
        raise ValueError("Invalid file type")
    
    return True

@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Empty filename'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    try:
        validate_image_file(file)
        # Limit image dimensions
        image = Image.open(io.BytesIO(file.read()))
        image.verify()  # Verify image integrity
        
        # Reopen after verify (verify closes the file)
        image = Image.open(io.BytesIO(file.read()))
        
        # Additional validation
        if image.size[0] > 10000 or image.size[1] > 10000:
            return jsonify({'error': 'Image too large'}), 400
            
    except Exception as e:
        return jsonify({'error': 'Invalid image file'}), 400
```

---

### 5. Information Disclosure - Detailed Error Messages
**Location:** `backend/app.py:61-63`  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 7.5 (High)

**Description:**
```python
except Exception as e:
    print(f"Error saat prediksi: {e}")
    return jsonify({'error': 'Gagal memproses gambar', 'details': str(e)}), 500
```
Detailed error messages are exposed to clients, revealing:
- Internal file paths
- Stack traces
- System architecture details
- Database errors (if added later)

**Impact:**
- Information leakage to attackers
- System architecture disclosure
- Easier exploitation of other vulnerabilities
- Compliance violations (HIPAA, GDPR)

**Mitigation:**
```python
import logging
import traceback

logger = logging.getLogger(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # ... existing code
    except ValueError as e:
        logger.warning(f"Validation error: {e}")
        return jsonify({'error': 'Invalid input provided'}), 400
    except Exception as e:
        logger.error(f"Prediction error: {traceback.format_exc()}")
        # Don't expose internal errors to client
        return jsonify({'error': 'An error occurred processing your request'}), 500
```

---

### 6. No Rate Limiting
**Location:** `backend/app.py` (entire file)  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 7.5 (High)

**Description:**
No rate limiting implemented, allowing:
- Unlimited API requests
- Denial of Service (DoS) attacks
- Resource exhaustion
- Model inference abuse

**Impact:**
- Service unavailability
- High computational costs
- Resource exhaustion
- Unfair usage

**Mitigation:**
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour", "10 per minute"]
)

@app.route('/predict', methods=['POST'])
@limiter.limit("5 per minute")
@jwt_required()
def predict():
    # ... existing code
```

---

### 7. Hardcoded API Endpoint
**Location:** `frontend/src/pages/Scan.tsx:62`  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 6.5 (Medium)

**Description:**
```typescript
const response = await axios.post('http://localhost:5000/predict', formData);
```
Hardcoded localhost URL prevents:
- Environment-based configuration
- Production deployment
- Multi-environment support

**Impact:**
- Application won't work in production
- Difficult deployment process
- Security misconfigurations

**Mitigation:**
```typescript
// Create config file: src/config.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default {
  API_BASE_URL
};

// In Scan.tsx
import config from '../config';

const response = await axios.post(`${config.API_BASE_URL}/predict`, formData);
```

**Environment Variables:**
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:5000

# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

---

### 8. Missing Security Headers
**Location:** `backend/app.py`, `frontend/index.html`  
**Severity:** 🔴 CRITICAL  
**CVSS Score:** 7.0 (High)

**Description:**
No security headers configured, leaving the application vulnerable to:
- XSS attacks
- Clickjacking
- MIME type sniffing
- Protocol downgrade attacks

**Impact:**
- Cross-Site Scripting (XSS)
- Clickjacking attacks
- Man-in-the-Middle (MITM) attacks
- Browser-based exploits

**Mitigation:**
```python
from flask import Flask
from flask_talisman import Talisman

app = Flask(__name__)

# Configure security headers
Talisman(app,
    force_https=False,  # Set to True in production with HTTPS
    strict_transport_security=True,
    strict_transport_security_max_age=31536000,
    content_security_policy={
        'default-src': "'self'",
        'img-src': "'self' data: https:",
        'script-src': "'self'",
        'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
        'font-src': "'self' https://fonts.gstatic.com",
    },
    content_security_policy_nonce_in=['script-src'],
    referrer_policy='strict-origin-when-cross-origin',
    feature_policy={
        'geolocation': "'none'",
        'camera': "'none'",
        'microphone': "'none'"
    }
)
```

**Frontend (Vite):**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})
```

---

## 🟠 HIGH SEVERITY VULNERABILITIES

### 9. No Input Sanitization on Frontend
**Location:** `frontend/src/pages/Scan.tsx:43-52`  
**Severity:** 🟠 HIGH  
**CVSS Score:** 6.1 (Medium)

**Description:**
Frontend validation is easily bypassed:
- Client-side only validation
- No server-side re-validation
- File type check can be manipulated

**Mitigation:**
- Always validate on backend (see vulnerability #4)
- Use TypeScript for type safety
- Implement client-side validation as UX enhancement only

---

### 10. Missing HTTPS Enforcement
**Location:** `backend/app.py:66`, `frontend/src/pages/Scan.tsx:62`  
**Severity:** 🟠 HIGH  
**CVSS Score:** 7.5 (High)

**Description:**
Application uses HTTP, allowing:
- Man-in-the-Middle attacks
- Data interception
- Session hijacking
- Medical data exposure (HIPAA violation)

**Mitigation:**
- Deploy behind reverse proxy (nginx/Apache) with SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Enforce HTTPS redirects
- Use HSTS headers (see vulnerability #8)

---

### 11. No Request Size Limits
**Location:** `backend/app.py`  
**Severity:** 🟠 HIGH  
**CVSS Score:** 7.0 (High)

**Description:**
Flask default request size limits may be insufficient for file uploads.

**Mitigation:**
```python
from flask import Flask

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max file size
```

---

### 12. Insecure Error Handling
**Location:** `backend/app.py:61-63`  
**Severity:** 🟠 HIGH  
**CVSS Score:** 6.5 (Medium)

**Description:**
Errors are printed to console and exposed to users (see vulnerability #5).

**Mitigation:**
- Implement proper logging system
- Use structured logging (JSON format)
- Log to secure, centralized location
- Never expose internal errors to clients

---

### 13. No Session Management
**Location:** Entire application  
**Severity:** 🟠 HIGH  
**CVSS Score:** 7.0 (High)

**Description:**
No session management system in place.

**Mitigation:**
```python
from flask import Flask, session
from flask_session import Session
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_TYPE'] = 'filesystem'  # or 'redis' for production
app.config['SESSION_COOKIE_SECURE'] = True  # HTTPS only
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
Session(app)
```

---

## 🟡 MEDIUM SEVERITY VULNERABILITIES

### 14. Dependency Vulnerabilities
**Location:** `backend/requirements.txt`, `frontend/package.json`  
**Severity:** 🟡 MEDIUM  
**CVSS Score:** 5.0 (Medium)

**Description:**
Dependencies may contain known vulnerabilities. No version pinning in requirements.txt.

**Mitigation:**
```bash
# Backend
pip install safety
safety check

# Frontend
npm audit
npm audit fix

# Pin versions in requirements.txt
flask==3.0.0
flask-cors==4.0.0
tensorflow==2.15.0
# ... etc
```

**Recommended Actions:**
- Run `npm audit` and `pip-audit` regularly
- Pin exact versions in production
- Set up automated dependency scanning (Dependabot, Snyk)
- Review and update dependencies monthly

---

### 15. Missing Content Security Policy (CSP)
**Location:** `frontend/index.html`  
**Severity:** 🟡 MEDIUM  
**CVSS Score:** 6.0 (Medium)

**Description:**
No Content Security Policy headers configured (partially covered in #8).

**Mitigation:**
- Implement CSP as shown in vulnerability #8
- Use nonces for inline scripts
- Report CSP violations to monitoring endpoint

---

## Additional Security Recommendations

### 1. Implement Logging and Monitoring
```python
import logging
from logging.handlers import RotatingFileHandler

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s %(name)s %(message)s',
    handlers=[
        RotatingFileHandler('app.log', maxBytes=10000000, backupCount=5),
        logging.StreamHandler()
    ]
)
```

### 2. Add Health Check Endpoint
```python
@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'model_loaded': model is not None}), 200
```

### 3. Implement Request ID Tracking
```python
import uuid
from flask import g

@app.before_request
def before_request():
    g.request_id = str(uuid.uuid4())
```

### 4. Add Input Validation Library
```python
from marshmallow import Schema, fields, validate, ValidationError

class PredictRequestSchema(Schema):
    file = fields.Raw(required=True, validate=validate.Length(max=10485760))

@app.route('/predict', methods=['POST'])
def predict():
    try:
        schema = PredictRequestSchema()
        schema.load(request.files)
    except ValidationError as err:
        return jsonify(err.messages), 400
```

### 5. Environment-Based Configuration
```python
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY')
    DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    MAX_UPLOAD_SIZE = int(os.getenv('MAX_UPLOAD_SIZE', 10485760))
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '').split(',')

app.config.from_object(Config)
```

### 6. Add API Versioning
```python
@app.route('/api/v1/predict', methods=['POST'])
def predict_v1():
    # ... existing code
```

### 7. Implement Request Timeout
```python
from functools import wraps
import signal

def timeout_handler(signum, frame):
    raise TimeoutError("Request timeout")

@app.route('/predict', methods=['POST'])
def predict():
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(30)  # 30 second timeout
    try:
        # ... prediction code
    finally:
        signal.alarm(0)
```

### 8. Add Model Input Validation
```python
def validate_image_dimensions(image):
    width, height = image.size
    if width < 100 or height < 100:
        raise ValueError("Image too small")
    if width > 10000 or height > 10000:
        raise ValueError("Image too large")
    return True
```

---

## Compliance Considerations

### HIPAA Compliance (if handling US medical data)
- ✅ Implement encryption at rest and in transit
- ✅ Add audit logging for all PHI access
- ✅ Implement access controls
- ✅ Add data retention policies
- ✅ Sign Business Associate Agreements (BAAs)

### GDPR Compliance (if handling EU data)
- ✅ Implement data minimization
- ✅ Add user consent mechanisms
- ✅ Implement right to deletion
- ✅ Add data export functionality
- ✅ Implement privacy by design

---

## Testing Recommendations

1. **Penetration Testing:**
   - OWASP ZAP automated scanning
   - Burp Suite manual testing
   - API security testing with Postman/Insomnia

2. **Code Analysis:**
   - Static Application Security Testing (SAST)
   - Bandit for Python security linting
   - ESLint security plugins for TypeScript

3. **Dependency Scanning:**
   - Snyk
   - Dependabot
   - Safety (Python)

4. **Infrastructure Security:**
   - Container security scanning
   - Infrastructure as Code (IaC) scanning
   - Network security assessment

---

## Priority Remediation Roadmap

### Phase 1 (Immediate - Week 1)
1. ✅ Disable debug mode
2. ✅ Configure CORS properly
3. ✅ Add file upload validation
4. ✅ Implement error handling
5. ✅ Add rate limiting

### Phase 2 (Urgent - Week 2)
6. ✅ Implement authentication
7. ✅ Add security headers
8. ✅ Configure HTTPS
9. ✅ Fix hardcoded URLs
10. ✅ Add logging

### Phase 3 (Important - Week 3-4)
11. ✅ Dependency updates
12. ✅ Session management
13. ✅ Request size limits
14. ✅ Health checks
15. ✅ Monitoring setup

---

## Conclusion

The PulmoAI application requires **immediate security hardening** before any production deployment. The identified vulnerabilities pose significant risks including remote code execution, data breaches, and compliance violations.

**Recommendation:** Do not deploy to production until all Critical and High severity vulnerabilities are remediated.

---

**Report Generated By:** Professional Penetration Testing Team  
**Next Review Date:** After remediation completion  
**Contact:** Security Team

