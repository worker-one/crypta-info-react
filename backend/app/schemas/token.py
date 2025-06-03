# app/schemas/token.py
from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[int] = None # Subject (user ID)
    # Add other relevant claims if needed (e.g., roles, scope)

class RefreshTokenRequest(BaseModel):
    refresh_token: str