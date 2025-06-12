from sqlalchemy import Column, Integer, String, Text, Table, ForeignKey
from sqlalchemy.orm import relationship

from .base import Base

# Association table for the many-to-many relationship between Items and Tags
item_tags_association = Table(
    'item_tags', Base.metadata,
    Column('item_id', Integer, ForeignKey('items.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete="CASCADE"), primary_key=True)
)

class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)

    # Relationship to items (many-to-many)
    items = relationship(
        "Item",
        secondary=item_tags_association,
        back_populates="tags"
    )

    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}')>"
