# app/item/service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload # Import selectinload
from typing import Optional, List # Import List
import logging

from app.models import item as item_models
from app.models import tag as tag_models # Import tag model

# Get logger
logger = logging.getLogger(__name__)

class ItemService:
    async def get_item_by_id(self, db: AsyncSession, item_id: int) -> Optional[item_models.Item]:
        """Retrieve a single item by its ID, including its tags."""
        logger.info(f"Retrieving item with id {item_id}.")
        result = await db.execute(
            select(item_models.Item)
            .filter(item_models.Item.id == item_id)
            .options(selectinload(item_models.Item.tags)) # Eager load tags
        )
        item = result.scalars().first()
        logger.info(f"Item with id {item_id} {'found' if item else 'not found'}.")
        return item

    async def get_tags_for_item(self, db: AsyncSession, item_id: int) -> Optional[List[tag_models.Tag]]:
        """Retrieve all tags for a specific item."""
        logger.info(f"Retrieving tags for item with id {item_id}.")
        item = await self.get_item_by_id(db, item_id) # This already loads tags
        if not item:
            logger.warning(f"Item with id {item_id} not found when trying to get tags.")
            return None
        logger.info(f"Found {len(item.tags)} tags for item id {item_id}.")
        return item.tags

    async def add_tag_to_item(
        self, db: AsyncSession, item_id: int, tag_id: int
    ) -> Optional[item_models.Item]:
        """Add a tag to an item."""
        logger.info(f"Adding tag id {tag_id} to item id {item_id}.")
        # Fetch item with tags preloaded to avoid lazy loading issues and for efficient check
        item_result = await db.execute(
            select(item_models.Item)
            .filter(item_models.Item.id == item_id)
            .options(selectinload(item_models.Item.tags))
        )
        item = item_result.scalars().first()

        if not item:
            logger.warning(f"Item with id {item_id} not found.")
            return None

        tag_result = await db.execute(select(tag_models.Tag).filter(tag_models.Tag.id == tag_id))
        tag = tag_result.scalars().first()

        if not tag:
            logger.warning(f"Tag with id {tag_id} not found.")
            return None # Or raise an error

        if tag not in item.tags:
            item.tags.append(tag)
            await db.commit()
            await db.refresh(item) # Refresh to get updated relationships if necessary
            # Re-load tags explicitly after commit if refresh doesn't capture it perfectly for the response
            # For many-to-many, SQLAlchemy usually handles this well.
            # If item.tags is not populated correctly after refresh, a specific query might be needed.
            # However, the `selectinload` on the initial fetch of `item` should make `item.tags` usable.
            logger.info(f"Tag id {tag_id} added to item id {item_id}.")
        else:
            logger.info(f"Tag id {tag_id} already associated with item id {item_id}.")
        
        return item


    async def remove_tag_from_item(
        self, db: AsyncSession, item_id: int, tag_id: int
    ) -> Optional[item_models.Item]:
        """Remove a tag from an item."""
        logger.info(f"Removing tag id {tag_id} from item id {item_id}.")
        # Fetch item with tags preloaded
        item_result = await db.execute(
            select(item_models.Item)
            .filter(item_models.Item.id == item_id)
            .options(selectinload(item_models.Item.tags))
        )
        item = item_result.scalars().first()

        if not item:
            logger.warning(f"Item with id {item_id} not found.")
            return None

        tag_to_remove = None
        for tag_in_item in item.tags:
            if tag_in_item.id == tag_id:
                tag_to_remove = tag_in_item
                break
        
        if tag_to_remove:
            item.tags.remove(tag_to_remove)
            await db.commit()
            await db.refresh(item) # Refresh to get updated relationships
            logger.info(f"Tag id {tag_id} removed from item id {item_id}.")
        else:
            logger.warning(f"Tag id {tag_id} not found on item id {item_id} or item/tag itself not found.")
            # If tag was not found on item, we might not need to return None,
            # as the state is "tag is not on item". But for consistency, if item exists, return item.
            # If the tag itself doesn't exist, it cannot be on the item.
            # The current logic implies tag must exist on item to be removed.
            if not await db.get(tag_models.Tag, tag_id): # Check if tag exists at all
                 logger.warning(f"Tag with id {tag_id} does not exist in the database.")
                 # Depending on desired behavior, could raise 404 for tag here or just return item
            # Return item as is if tag wasn't associated
        return item

item_service = ItemService()

