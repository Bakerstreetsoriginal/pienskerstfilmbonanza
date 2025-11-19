"""
Audit logging for security-sensitive operations
"""
import logging
from datetime import datetime
from typing import Optional

# Configure audit logger
audit_logger = logging.getLogger("audit")
audit_logger.setLevel(logging.INFO)

# Create handler if not exists
if not audit_logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '%(asctime)s - AUDIT - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)
    audit_logger.addHandler(handler)

def log_login_attempt(email: str, success: bool, ip_address: Optional[str] = None):
    """Log login attempts"""
    status = "SUCCESS" if success else "FAILED"
    audit_logger.info(
        f"LOGIN {status} | email={email} | ip={ip_address or 'unknown'}"
    )

def log_admin_action(action: str, user_email: str, details: str = "", ip_address: Optional[str] = None):
    """Log admin actions"""
    audit_logger.info(
        f"ADMIN ACTION | action={action} | user={user_email} | details={details} | ip={ip_address or 'unknown'}"
    )

def log_security_event(event_type: str, details: str, ip_address: Optional[str] = None):
    """Log security events"""
    audit_logger.warning(
        f"SECURITY EVENT | type={event_type} | details={details} | ip={ip_address or 'unknown'}"
    )

