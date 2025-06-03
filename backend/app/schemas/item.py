# app/schemas/item.py
from pydantic import BaseModel

# Base schema for common attributes
class ItemBase(BaseModel):
    name: str
    # Add other common fields

# Schema for reading item data (e.g., in API responses)
class ItemRead(ItemBase):
    id: int
    item_type: str
    slug: str
    overview: str
    description: str
    logo_url: str
    website_url: str
    overall_average_rating: float  # Overall average rating
    total_review_count: int  # Number of reviews with comments
    total_rating_count: int  # Number of reviews with ratings

    class Config:
        orm_mode = True # Enable ORM mode for compatibility with SQLAlchemy models

class ItemReadBrief(ItemBase):
    id: int
    slug: str
    logo_url: str
    overall_average_rating: float  # Overall average rating
    total_review_count: int  # Number of reviews with comments
    total_rating_count: int  # Number of reviews with ratings

    class Config:
        orm_mode = True # Enable ORM mode for compatibility with SQLAlchemy models

# Schema for creating an item (if needed later)
# class ItemCreate(ItemBase):
#     pass

# Schema for updating an item (if needed later)
# class ItemUpdate(ItemBase):
#     pass

