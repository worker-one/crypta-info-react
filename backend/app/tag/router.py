from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_async_db
from app.schemas import tag as tag_schemas
from app.schemas.common import Message, PaginationParams
from app.tag import service as tag_service

router = APIRouter(
    prefix="/tags",
    tags=["Tags"],
)

@router.post("/", response_model=tag_schemas.TagRead, status_code=status.HTTP_201_CREATED)
async def create_tag(
    tag_create: tag_schemas.TagCreate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Create a new tag.
    """
    existing_tag = await tag_service.tag_service.get_tag_by_name(db, name=tag_create.name)
    if existing_tag:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Tag with name '{tag_create.name}' already exists."
        )
    return await tag_service.tag_service.create_tag(db=db, tag_create=tag_create)

@router.get("/", response_model=List[tag_schemas.TagRead])
async def get_tags(
    pagination: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_async_db)
):
    """
    Retrieve all tags with pagination.
    """
    return await tag_service.tag_service.get_tags(db=db, pagination=pagination)

@router.get("/{tag_id}", response_model=tag_schemas.TagRead)
async def get_tag(
    tag_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get a specific tag by its ID.
    """
    db_tag = await tag_service.tag_service.get_tag_by_id(db=db, tag_id=tag_id)
    if db_tag is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
    return db_tag

@router.put("/{tag_id}", response_model=tag_schemas.TagRead)
async def update_tag(
    tag_id: int,
    tag_update: tag_schemas.TagUpdate,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Update an existing tag.
    """
    if tag_update.name:
        existing_tag = await tag_service.tag_service.get_tag_by_name(db, name=tag_update.name)
        if existing_tag and existing_tag.id != tag_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Another tag with name '{tag_update.name}' already exists."
            )
    updated_tag = await tag_service.tag_service.update_tag(db=db, tag_id=tag_id, tag_update=tag_update)
    if updated_tag is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
    return updated_tag

@router.delete("/{tag_id}", response_model=Message)
async def delete_tag(
    tag_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Delete a tag.
    The association with items will be removed due to CASCADE on the foreign key
    in the item_tags association table.
    """
    deleted_tag = await tag_service.tag_service.delete_tag(db=db, tag_id=tag_id)
    if deleted_tag is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tag not found")
    return {"message": f"Tag with ID {tag_id} deleted successfully."}
