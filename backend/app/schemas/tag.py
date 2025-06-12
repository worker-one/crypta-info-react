from pydantic import BaseModel
from typing import Optional

# Base schema for common attributes
class TagBase(BaseModel):
    name: str
    description: Optional[str] = None

# Schema for creating a tag
class TagCreate(TagBase):
    pass

# Schema for reading tag data (e.g., in API responses)
class TagRead(TagBase):
    id: int

    class Config:
        from_attributes = True # Enable ORM mode for compatibility with SQLAlchemy models

# Schema for updating a tag
class TagUpdate(TagBase):
    name: Optional[str] = None # Allow partial updates
    description: Optional[str] = None
