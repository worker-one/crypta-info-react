# app/item/router.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List # Import List

from app.core.database import get_async_db
from app.schemas import item as item_schemas
from app.schemas import tag as tag_schemas # Import TagRead schema
from app.schemas.common import Message # Import Message schema
from app.item import service as item_service
# No need to import tag_service here unless directly using it, item_service handles tag interactions for items

router = APIRouter(
    tags=["Items"],
    prefix="/items",
)

@router.get("/{item_id}", response_model=item_schemas.ItemRead)
async def get_item(
    item_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get a specific item by its ID.
    """
    item = await item_service.item_service.get_item_by_id(db=db, item_id=item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item

@router.get("/{item_id}/tags", response_model=List[tag_schemas.TagRead])
async def get_item_tags(
    item_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get all tags associated with a specific item.
    """
    tags = await item_service.item_service.get_tags_for_item(db=db, item_id=item_id)
    if tags is None: # This implies item was not found
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return tags

@router.post("/{item_id}/tags/{tag_id}", response_model=item_schemas.ItemRead, status_code=status.HTTP_200_OK)
async def add_tag_to_item(
    item_id: int,
    tag_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Associate a tag with an item.
    """
    # The service method get_item_by_id in item_service now eager loads tags.
    # We need to ensure the tag exists before attempting to add it.
    # The item_service.add_tag_to_item handles checks for item and tag existence.
    updated_item = await item_service.item_service.add_tag_to_item(db=db, item_id=item_id, tag_id=tag_id)
    if updated_item is None:
        # This could be due to item not found or tag not found.
        # Service logs should indicate which. For API, a generic 404 for item or specific for tag.
        # Let's assume if item_service returns None, it's an issue finding the item or tag.
        # A more granular error handling could be:
        # item = await item_service.item_service.get_item_by_id(db, item_id) (without tags for this check)
        # if not item: raise HTTPException(status_code=404, detail="Item not found")
        # tag = await some_tag_service.get_tag_by_id(db, tag_id)
        # if not tag: raise HTTPException(status_code=404, detail="Tag not found")
        # Then call add_tag_to_item.
        # For now, relying on service's None return.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item or Tag not found, or association failed.")
    return updated_item

@router.delete("/{item_id}/tags/{tag_id}", response_model=item_schemas.ItemRead, status_code=status.HTTP_200_OK)
async def remove_tag_from_item(
    item_id: int,
    tag_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Disassociate a tag from an item.
    """
    updated_item = await item_service.item_service.remove_tag_from_item(db=db, item_id=item_id, tag_id=tag_id)
    if updated_item is None:
        # This implies item was not found.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found.")
    # If the tag was not associated, the item is returned as is.
    # If the tag itself didn't exist, it also effectively means it wasn't associated.
    return updated_item

# Add other item-related endpoints here (e.g., list, create, update, delete) later if needed.

