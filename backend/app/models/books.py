# app/models/book.py
from sqlalchemy import (
    Column, Integer, String, ForeignKey, SmallInteger
)
# Import Base and Item
from .item import Item, ItemTypeEnum # Import Item and the Enum

# --- Model Class ---

# Inherit from Item
class Book(Item):
    __tablename__ = 'books'

    # Primary Key is now also a Foreign Key to the items table
    id = Column(Integer, ForeignKey('items.id', ondelete='CASCADE'), primary_key=True)

    # --- Common fields are inherited from Item ---
    # Inherited: name (will act as title), slug, overview, description, logo_url, website_url
    # Inherited: rating, total_review_count
    # Inherited: created_at, updated_at

    # --- Book-specific fields ---
    # Note: 'name' from Item serves as the 'title'.
    # Note: 'logo_url' from Item serves as the 'cover_url'.

    year = Column(SmallInteger)             # Publication year
    author = Column(String(255), nullable=True) # Author(s) of the book
    publisher = Column(String(255), nullable=True) # Publisher of the book
    pages = Column(Integer, nullable=True)    # Number of pages
    number = Column(String(50), index=True) # e.g., ISBN, ASIN, or other identifier

    # --- Relationships ---
    # The 'reviews' relationship is inherited from Item.

    # --- Polymorphism Setup ---
    __mapper_args__ = {
        'polymorphic_identity': ItemTypeEnum.book, # Specific identity for this subclass
    }

    # Optional: Define __repr__ if you want specific Book details
    # def __repr__(self):
    #    return f"<Book(id={self.id}, title='{self.name}', year={self.year})>" # name is inherited
