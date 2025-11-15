from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Token data schema"""
    email: str | None = None

class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    """User response schema"""
    id: int
    email: str
    is_active: bool
    
    class Config:
        from_attributes = True

