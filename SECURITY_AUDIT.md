# 🔒 Security Audit - Pien's Kerstfilm Bonanza

**Audit Date:** 19 November 2025  
**Version:** 1.1.0  
**Environment:** Production

---

## ✅ STRENGTHS (Goed Beveiligd)

### 1. **Authentication & Password Security**
- ✅ **Bcrypt password hashing** met automatische salt
- ✅ **JWT tokens** voor stateless authentication
- ✅ **Bearer token** scheme in headers (niet in URL)
- ✅ **Token expiratie** ingesteld (1 week)
- ✅ **Password verification** met timing-attack resistant comparison

### 2. **SQL Injection Protection**
- ✅ **SQLAlchemy ORM** gebruikt (parametrized queries)
- ✅ Geen raw SQL queries zonder parameterisatie
- ✅ Type validation via Pydantic schemas

### 3. **Environment Variables**
- ✅ Secrets in `.env` file (niet in code)
- ✅ `.env` in `.gitignore`
- ✅ `env.example` zonder echte credentials

### 4. **CORS Configuration**
- ✅ Expliciete origin whitelist
- ✅ Configureerbaar via environment variables
- ✅ Credentials allowed (nodig voor JWT in headers)

### 5. **Input Validation**
- ✅ Pydantic schemas valideren alle inputs
- ✅ Field constraints (min_length, ge, le)
- ✅ Type safety door TypeScript + Pydantic

### 6. **HTTPS/TLS**
- ✅ Traefik met Let's Encrypt automatische SSL
- ✅ HTTP→HTTPS redirect
- ✅ TLS certificate auto-renewal

### 7. **Docker Security**
- ✅ Non-root user in containers (default)
- ✅ Minimal base images (alpine, slim)
- ✅ Multi-stage builds (frontend)
- ✅ No secrets in Docker images

---

## ⚠️ VULNERABILITIES & RISKS (Moet Gefixed Worden)

### 🔴 CRITICAL

#### 1. **No Rate Limiting on Login Endpoint**
**Risk:** Brute force attacks mogelijk  
**Impact:** Account takeover

**Current Code:**
```python
@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # No rate limiting!
```

**Fix:** Implementeer rate limiting

#### 2. **No Account Lockout Policy**
**Risk:** Unlimited login attempts  
**Impact:** Brute force attacks

**Fix:** Lock account na 5 failed attempts

#### 3. **JWT Token Lifetime Too Long**
**Risk:** 10080 minutes = 7 days  
**Impact:** Stolen token blijft lang geldig

**Current:** `ACCESS_TOKEN_EXPIRE_MINUTES=10080`  
**Recommend:** 60-120 minutes met refresh tokens

#### 4. **No CSRF Protection for State-Changing Operations**
**Risk:** Cross-Site Request Forgery  
**Impact:** Ongewenste acties namens ingelogde user

**Note:** JWT in Authorization header biedt *enige* bescherming, maar niet volledig

---

### 🟡 HIGH

#### 5. **No Input Sanitization for HTML/XSS**
**Risk:** Stored XSS in review texts  
**Impact:** Script injection

**Vulnerable Field:** `review_text`

**Example Attack:**
```javascript
review_text: "<script>alert('XSS')</script>"
```

**Fix:** Sanitize HTML output in frontend

#### 6. **No API Rate Limiting**
**Risk:** API abuse, DoS  
**Impact:** Resource exhaustion

**Fix:** Rate limit per IP/user

#### 7. **Admin Credentials in Plaintext in Logs**
**Risk:** Credentials leakage  
**Impact:** Full admin access

**Current:** Startup logs tonen admin email

**Fix:** Don't log credentials

#### 8. **No Security Headers**
**Risk:** Various attack vectors  
**Impact:** XSS, clickjacking, MIME sniffing

**Missing:**
- X-Content-Type-Options
- X-Frame-Options
- Content-Security-Policy
- Strict-Transport-Security

---

### 🟢 MEDIUM

#### 9. **No Password Complexity Requirements**
**Risk:** Weak passwords  
**Impact:** Easy brute force

**Fix:** Enforce: min 12 chars, uppercase, lowercase, numbers, symbols

#### 10. **No Email Verification**
**Risk:** Fake accounts  
**Impact:** Account enumeration

**Note:** Voor single-user app minder relevant

#### 11. **TMDB API Key in Environment**
**Risk:** Key exposure if `.env` leaks  
**Impact:** Unauthorized API usage

**Mitigation:** Gebruik secrets management (Vault, AWS Secrets Manager)

#### 12. **No Request Size Limits**
**Risk:** Large payload DoS  
**Impact:** Memory exhaustion

**Fix:** Limit request body size

#### 13. **No Audit Logging**
**Risk:** No forensics after breach  
**Impact:** Cannot trace unauthorized access

**Fix:** Log all authentication attempts, admin actions

#### 14. **Database Connection String Contains Password**
**Risk:** Password in environment  
**Impact:** If process listing exposed

**Current:** `DATABASE_URL=postgresql://user:pass@host/db`  
**Better:** Use IAM authentication or certificate-based auth

---

### 🔵 LOW

#### 15. **No Content Security Policy**
**Risk:** XSS mitigation layer missing  
**Impact:** Reduced defense-in-depth

#### 16. **Uvicorn Debug Mode**
**Risk:** Information disclosure  
**Impact:** Stack traces in production

**Check:** Ensure `--reload` niet in production

#### 17. **No HTTPS for Local Dev**
**Risk:** Credentials over HTTP in development  
**Impact:** Training bad habits

#### 18. **Frontend Dependencies Outdated Risk**
**Risk:** Known vulnerabilities in dependencies  
**Impact:** Various

**Action:** Regular `npm audit` en updates

---

## 🛡️ RECOMMENDED FIXES

### Priority 1 (Implement Immediately)

**1. Rate Limiting**
```python
# requirements.txt
slowapi==0.1.9

# backend/app/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# backend/app/api/auth.py
@router.post("/login")
@limiter.limit("5/minute")  # 5 attempts per minute
async def login(request: Request, login_data: LoginRequest, ...):
```

**2. Security Headers**
```python
# backend/app/main.py
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.sessions import SessionMiddleware

app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["pienskerstfilmbonanza.nl", "*.pienskerstfilmbonanza.nl"]
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'; img-src 'self' https://image.tmdb.org; script-src 'self'"
    return response
```

**3. XSS Protection in Frontend**
```javascript
// frontend/src/utils/sanitize.js
import DOMPurify from 'dompurify'

export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: []
  })
}

// In ReviewDetailPage.jsx
<div dangerouslySetInnerHTML={{ 
  __html: sanitizeHTML(review.review_text) 
}} />
```

**4. Failed Login Tracking**
```python
# backend/app/models/user.py
class User(Base):
    # Add fields
    failed_login_attempts = Column(Integer, default=0)
    locked_until = Column(DateTime(timezone=True), nullable=True)

# backend/app/api/auth.py
@router.post("/login")
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    
    # Check if locked
    if user and user.locked_until and user.locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Account locked. Try again after {user.locked_until}"
        )
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        if user:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.locked_until = datetime.utcnow() + timedelta(minutes=15)
            db.commit()
        raise HTTPException(...)
    
    # Reset on successful login
    user.failed_login_attempts = 0
    user.locked_until = None
    db.commit()
```

### Priority 2 (Implement Soon)

**5. Shorter JWT Expiration + Refresh Tokens**
```env
ACCESS_TOKEN_EXPIRE_MINUTES=60  # 1 hour instead of 1 week
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**6. Audit Logging**
```python
# Log all admin actions
logger.info(f"AUDIT: User {user.email} performed action {action} at {datetime.utcnow()}")
```

**7. Password Complexity**
```python
# backend/app/schemas/auth.py
from pydantic import validator
import re

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
    @validator('password')
    def password_complexity(cls, v):
        if len(v) < 12:
            raise ValueError('Password must be at least 12 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain digit')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain special character')
        return v
```

### Priority 3 (Nice to Have)

**8. 2FA (Two-Factor Authentication)**
```python
# Using pyotp
pip install pyotp qrcode

# Add to user model
totp_secret = Column(String, nullable=True)
totp_enabled = Column(Boolean, default=False)
```

**9. Security Monitoring**
```python
# Integration with Sentry for error tracking
pip install sentry-sdk

import sentry_sdk
sentry_sdk.init(
    dsn="your-sentry-dsn",
    environment="production"
)
```

---

## 📊 Security Checklist

### Before Going Live

- [ ] Change all default passwords
- [ ] Generate strong SECRET_KEY (32+ random characters)
- [ ] Enable HTTPS (Let's Encrypt via Traefik)
- [ ] Set strong CORS_ORIGINS (no wildcards)
- [ ] Enable rate limiting on login
- [ ] Add security headers
- [ ] Sanitize user input (XSS protection)
- [ ] Implement account lockout
- [ ] Set up audit logging
- [ ] Regular backup strategy
- [ ] Dependency vulnerability scanning (`npm audit`, `safety check`)
- [ ] Remove debug mode/verbose logging
- [ ] Set up monitoring/alerts

### Regular Maintenance

- [ ] Monthly: Update dependencies
- [ ] Monthly: Review audit logs
- [ ] Quarterly: Security audit
- [ ] Quarterly: Penetration testing (optional)
- [ ] Yearly: Rotate secrets/keys

---

## 🔧 Quick Wins

**Commands to run now:**

```bash
# Check for known vulnerabilities
cd frontend && npm audit
cd backend && pip install safety && safety check

# Generate secure SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Review nginx/traefik logs for suspicious activity
docker compose -f docker-compose.prod.yml logs nginx | grep -i "40[0134]"
```

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

## ✅ Conclusion

**Overall Security Score: 6/10**

**Strengths:**
- Good authentication foundation
- Proper password hashing
- SQL injection protection
- HTTPS enabled

**Critical Gaps:**
- No rate limiting
- No account lockout
- XSS vulnerability
- Long JWT expiration

**Recommendation:** Implement Priority 1 fixes before handling sensitive data.

---

**Last Updated:** 19 November 2025  
**Next Audit:** February 2026

