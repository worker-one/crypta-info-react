from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
import logging

from app.models import tag as tag_models
from app.schemas import tag as tag_schemas
from app.schemas.common import PaginationParams

logger = logging.getLogger(__name__)

class TagService:
    async def get_tag_by_id(self, db: AsyncSession, tag_id: int) -> Optional[tag_models.Tag]:
        logger.debug(f"Retrieving tag with id {tag_id}")
        result = await db.execute(select(tag_models.Tag).filter(tag_models.Tag.id == tag_id))
        return result.scalars().first()

    async def get_tag_by_name(self, db: AsyncSession, name: str) -> Optional[tag_models.Tag]:
        logger.debug(f"Retrieving tag with name '{name}'")
        result = await db.execute(select(tag_models.Tag).filter(tag_models.Tag.name == name))
        return result.scalars().first()

    async def get_tags(self, db: AsyncSession, pagination: PaginationParams) -> List[tag_models.Tag]:
        logger.debug(f"Retrieving tags with skip {pagination.skip}, limit {pagination.limit}")
        result = await db.execute(
            select(tag_models.Tag)
            .offset(pagination.skip)
            .limit(pagination.limit)
            .order_by(tag_models.Tag.name)
        )
        return result.scalars().all()

    async def create_tag(self, db: AsyncSession, tag_create: tag_schemas.TagCreate) -> tag_models.Tag:
        logger.info(f"Creating new tag with name '{tag_create.name}'")
        db_tag = tag_models.Tag(name=tag_create.name, description=tag_create.description)
        db.add(db_tag)
        await db.commit()
        await db.refresh(db_tag)
        logger.info(f"Tag '{db_tag.name}' created with id {db_tag.id}")
        return db_tag

    async def update_tag(
        self, db: AsyncSession, tag_id: int, tag_update: tag_schemas.TagUpdate
    ) -> Optional[tag_models.Tag]:
        logger.debug(f"Attempting to update tag with id {tag_id}")
        db_tag = await self.get_tag_by_id(db, tag_id)
        if not db_tag:
            logger.warning(f"Tag with id {tag_id} not found for update.")
            return None

        update_data = tag_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_tag, key, value)
        
        await db.commit()
        await db.refresh(db_tag)
        logger.info(f"Tag with id {tag_id} updated successfully.")
        return db_tag

    async def delete_tag(self, db: AsyncSession, tag_id: int) -> Optional[tag_models.Tag]:
        logger.debug(f"Attempting to delete tag with id {tag_id}")
        db_tag = await self.get_tag_by_id(db, tag_id)
        if not db_tag:
            logger.warning(f"Tag with id {tag_id} not found for deletion.")
            return None
        
        # Manually remove associations if ON DELETE CASCADE is not fully relied upon or for logging
        # For item_tags, ON DELETE CASCADE on the FK should handle this.
        # If there were other direct relationships on Tag that needed manual handling, do it here.

        await db.delete(db_tag)
        await db.commit()
        logger.info(f"Tag with id {tag_id} deleted successfully.")
        return db_tag

tag_service = TagService()
