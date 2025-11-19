# 🔒 Security Policy

## Reporting Security Issues

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to: [security contact email]

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :x:                |

---

## Security Features

### ✅ Implemented

- **Authentication**: JWT-based with bcrypt password hashing
- **HTTPS**: Automatic via Traefik + Let's Encrypt
- **Rate Limiting**: Login endpoint limited to 5 attempts/minute
- **Security Headers**: X-Frame-Options, CSP, HSTS, etc.
- **SQL Injection Protection**: SQLAlchemy ORM with parameterized queries
- **CORS**: Whitelist-based origin validation
- **Input Validation**: Pydantic schemas with constraints

### ⚠️ In Progress

- Account lockout after failed attempts
- Audit logging
- 2FA support
- XSS sanitization in frontend

---

## Security Best Practices

### For Administrators

1. **Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Never reuse passwords

2. **Secret Management**
   ```bash
   # Generate strong SECRET_KEY
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

3. **Regular Updates**
   ```bash
   # Check for vulnerabilities
   cd backend && pip install safety && safety check
   cd frontend && npm audit
   ```

4. **Monitor Logs**
   ```bash
   # Watch for suspicious activity
   docker compose -f docker-compose.prod.yml logs -f | grep "401\|403\|429"
   ```

5. **Backup Strategy**
   ```bash
   # Daily database backups
   docker compose -f docker-compose.prod.yml exec db pg_dump -U pienskerst kerstfilms > backup_$(date +%Y%m%d).sql
   ```

### For Developers

1. **Never commit secrets**
   - Use `.env` files
   - Add `.env` to `.gitignore`
   - Use environment variables

2. **Validate all inputs**
   ```python
   # Use Pydantic for validation
   class ReviewCreate(BaseModel):
       review_text: str = Field(..., min_length=10, max_length=10000)
       arty_rating: float = Field(..., ge=-1000, le=1000000)
   ```

3. **Sanitize outputs**
   ```javascript
   // In frontend
   import DOMPurify from 'dompurify'
   const clean = DOMPurify.sanitize(dirtyHTML)
   ```

4. **Use parameterized queries**
   ```python
   # GOOD - Using ORM
   user = db.query(User).filter(User.email == email).first()
   
   # BAD - Raw SQL concatenation
   # db.execute(f"SELECT * FROM users WHERE email = '{email}'")
   ```

5. **Run security checks**
   ```bash
   chmod +x scripts/security_check.sh
   ./scripts/security_check.sh
   ```

---

## Deployment Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong `SECRET_KEY`
- [ ] Set `ENVIRONMENT=production`
- [ ] Enable HTTPS
- [ ] Configure proper `CORS_ORIGINS`
- [ ] Set secure database password
- [ ] Limit `ACCESS_TOKEN_EXPIRE_MINUTES` (recommend 60-120)
- [ ] Run `./scripts/security_check.sh`
- [ ] Review `SECURITY_AUDIT.md`
- [ ] Set up monitoring/alerting
- [ ] Configure automated backups

---

## Security Headers

The application includes these security headers:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
```

---

## Rate Limiting

Current limits:
- **Login endpoint**: 5 attempts per minute per IP
- **Other endpoints**: No limit (recommend adding for production)

To adjust:
```python
# backend/app/api/auth.py
@limiter.limit("5/minute")  # Change here
async def login(...):
```

---

## Known Limitations

1. **Single admin user**: Only one admin account supported
2. **No 2FA**: Two-factor authentication not yet implemented
3. **No session management**: JWT tokens cannot be invalidated before expiry
4. **No audit trail**: Admin actions not logged
5. **XSS risk**: User-generated content not sanitized

---

## Security Roadmap

### Q1 2026
- [ ] Implement account lockout
- [ ] Add audit logging
- [ ] Frontend XSS sanitization

### Q2 2026
- [ ] 2FA support
- [ ] JWT refresh tokens
- [ ] Session management

### Q3 2026
- [ ] Security headers CSP refinement
- [ ] API rate limiting for all endpoints
- [ ] Penetration testing

---

## Compliance

This application is designed for personal use and does not currently comply with:
- GDPR (no privacy policy, data deletion)
- PCI DSS (no payment processing)
- HIPAA (no health data)
- SOC 2 (no formal audit)

If you need compliance, additional work is required.

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

**Last Updated:** 19 November 2025  
**Security Version:** 1.1.0

