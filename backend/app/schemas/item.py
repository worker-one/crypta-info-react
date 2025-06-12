# app/schemas/item.py
from pydantic import BaseModel
from typing import List, Optional # Added Optional and List
from .tag import TagRead # Import TagRead schema

# Base schema for common attributes
class ItemBase(BaseModel):
    id: int
    logo_url: str
    name: str
    overall_average_rating: float  # Overall average rating
    total_review_count: int  # Number of reviews with comments
    total_rating_count: int  # Number of reviews with ratings

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
    tags: List[TagRead] = [] # Add tags field

    class Config:
        from_attributes = True # Updated from orm_mode

class ItemReadBrief(ItemBase):
    id: int
    slug: str
    logo_url: str # Kept as non-optional based on original
    overall_average_rating: float
    total_review_count: int
    total_rating_count: int
    tags: List[TagRead] = [] # Add tags field

    class Config:
        from_attributes = True # Updated from orm_mode

# Schema for creating an item (if needed later)
# class ItemCreate(ItemBase):
#     pass

# Schema for updating an item (if needed later)
# class ItemUpdate(ItemBase):
#     pass

