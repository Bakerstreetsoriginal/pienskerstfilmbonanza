#!/bin/bash

echo "🔒 Security Check - Pien's Kerstfilm Bonanza"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNINGS++))
}

echo "1. Checking environment configuration..."
echo "----------------------------------------"

# Check if .env exists
if [ -f ".env" ]; then
    check_pass ".env file exists"
    
    # Check for default/weak values
    if grep -q "change_this" .env; then
        check_fail "Default passwords/secrets found in .env"
    else
        check_pass "No default passwords found"
    fi
    
    # Check SECRET_KEY length
    SECRET_KEY=$(grep "^SECRET_KEY=" .env | cut -d'=' -f2)
    if [ ${#SECRET_KEY} -lt 32 ]; then
        check_fail "SECRET_KEY too short (< 32 chars)"
    else
        check_pass "SECRET_KEY length OK"
    fi
    
    # Check ADMIN_PASSWORD complexity
    ADMIN_PASS=$(grep "^ADMIN_PASSWORD=" .env | cut -d'=' -f2)
    if [ ${#ADMIN_PASS} -lt 12 ]; then
        check_warn "ADMIN_PASSWORD shorter than 12 characters"
    else
        check_pass "ADMIN_PASSWORD length OK"
    fi
    
    # Check CORS origins
    if grep -q "CORS_ORIGINS=\*" .env; then
        check_fail "CORS allows all origins (*)"
    elif grep -q "http://localhost" .env 2>/dev/null; then
        check_warn "CORS includes localhost (dev mode?)"
    else
        check_pass "CORS properly configured"
    fi
    
else
    check_fail ".env file not found"
fi

echo ""
echo "2. Checking file permissions..."
echo "----------------------------------------"

# Check .env permissions
if [ -f ".env" ]; then
    PERMS=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
    if [ "$PERMS" = "600" ] || [ "$PERMS" = "400" ]; then
        check_pass ".env has secure permissions ($PERMS)"
    else
        check_warn ".env permissions are $PERMS (recommend 600)"
    fi
fi

echo ""
echo "3. Checking for exposed secrets..."
echo "----------------------------------------"

# Check if .env is in .gitignore
if grep -q "^\.env$" .gitignore; then
    check_pass ".env in .gitignore"
else
    check_fail ".env NOT in .gitignore"
fi

# Check for secrets in git history
if git log --all --full-history --source -- "*env*" 2>/dev/null | grep -q "commit"; then
    check_warn "Found .env references in git history"
else
    check_pass "No .env in git history"
fi

echo ""
echo "4. Checking dependencies..."
echo "----------------------------------------"

# Backend dependencies
if [ -f "backend/requirements.txt" ]; then
    if grep -q "slowapi" backend/requirements.txt; then
        check_pass "Rate limiting library installed"
    else
        check_fail "Rate limiting library NOT installed"
    fi
fi

# Frontend dependencies
if [ -f "frontend/package.json" ]; then
    cd frontend
    if command -v npm &> /dev/null; then
        echo "Running npm audit..."
        AUDIT_RESULT=$(npm audit --audit-level=high 2>&1)
        if echo "$AUDIT_RESULT" | grep -q "found 0 vulnerabilities"; then
            check_pass "No high/critical npm vulnerabilities"
        else
            check_warn "npm vulnerabilities found (run 'npm audit' for details)"
        fi
    else
        check_warn "npm not installed, skipping audit"
    fi
    cd ..
fi

echo ""
echo "5. Checking Docker configuration..."
echo "----------------------------------------"

# Check if docker-compose uses secrets
if [ -f "docker-compose.prod.yml" ]; then
    if grep -q "secrets:" docker-compose.prod.yml; then
        check_pass "Docker secrets configured"
    else
        check_warn "Docker secrets not configured (using env vars)"
    fi
    
    # Check for exposed ports
    if grep -q "- \"5432:5432\"" docker-compose.prod.yml; then
        check_fail "Database port exposed externally"
    else
        check_pass "Database port not exposed"
    fi
fi

echo ""
echo "6. Checking HTTPS/TLS..."
echo "----------------------------------------"

# Check Traefik configuration
if grep -q "traefik.http.routers.*websecure" docker-compose.prod.yml; then
    check_pass "HTTPS configured via Traefik"
else
    check_warn "No HTTPS configuration found"
fi

echo ""
echo "7. Checking for common vulnerabilities..."
echo "----------------------------------------"

# Check for debug mode
if grep -q "DEBUG=True" .env 2>/dev/null; then
    check_fail "DEBUG mode enabled"
elif grep -q "ENVIRONMENT=development" .env 2>/dev/null; then
    check_warn "ENVIRONMENT set to development"
else
    check_pass "Production mode active"
fi

# Check for verbose logging
if grep -q "level=DEBUG" backend/app/*.py 2>/dev/null; then
    check_warn "DEBUG logging found in code"
else
    check_pass "No DEBUG logging in production code"
fi

echo ""
echo "=============================================="
echo "Summary:"
echo "=============================================="
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Failed:${NC} $FAILED"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${RED}⚠️  CRITICAL ISSUES FOUND${NC}"
    echo "Please fix failed checks before deploying to production"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNINGS FOUND${NC}"
    echo "Review warnings and consider fixing before production"
    exit 0
else
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
fi

