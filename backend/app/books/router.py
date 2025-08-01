# app/books/router.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, List

from app.core.database import get_async_db
from app.books import schemas
from app.books.service import book_service  # Updated import
from app.schemas.common import PaginationParams, PaginatedResponse
from app.schemas.tag import TagRead

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

@router.get("/details/{slug}", response_model=schemas.BookRead)
async def get_book_details_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get detailed information about a specific book by its slug.
    """
    db_book = await book_service.get_book_by_slug(db, slug=slug)
    if db_book is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return db_book

@router.get("/", response_model=PaginatedResponse[schemas.BookReadBrief])
async def list_books(
    db: AsyncSession = Depends(get_async_db),
    # Filtering parameters
    name: Optional[str] = Query(None, description="Search by book title (partial match)"),
    tag_id: Optional[int] = Query(None, description="Filter by tag ID"),
    min_year: Optional[int] = Query(None, description="Minimum publication year"),
    max_year: Optional[int] = Query(None, description="Maximum publication year"),
    min_total_review_count: Optional[int] = Query(None, description="Minimum total review count"),
    # Sorting parameters
    sort_by: schemas.BookSortBy = Depends(),
    # Pagination parameters
    pagination: PaginationParams = Depends(),
):
    """
    Get a list of books with filtering, sorting, and pagination.
    """
    filters = schemas.BookFilterParams(
        name=name,
        tag_id=tag_id,
        min_year=min_year,
        max_year=max_year,
        min_total_review_count=min_total_review_count,
    )

    books, total = await book_service.list_books(
        db=db, filters=filters, sort=sort_by, pagination=pagination
    )

    # Convert ORM objects to Pydantic models
    books_out = [schemas.BookReadBrief.model_validate(book) for book in books]

    return PaginatedResponse(
        total=total,
        items=books_out,
        skip=pagination.skip,
        limit=pagination.limit,
    )

# --- Optional CRUD Endpoints (Potentially Admin Only) ---

@router.post("/", response_model=schemas.BookRead, status_code=status.HTTP_201_CREATED)
async def create_book(
    book_in: schemas.BookCreate,
    db: AsyncSession = Depends(get_async_db)
    # Add authentication dependency here later
):
    """
    Create a new book. (Requires Admin privileges)
    """
    try:
        new_book = await book_service.create_book(db=db, book_in=book_in)
        return new_book
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
         # Log the exception e
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error during book creation.")


# @router.put("/{slug}", response_model=schemas.BookRead)
# async def update_book(
#     slug: str,
#     book_in: schemas.BookUpdate,
#     db: AsyncSession = Depends(get_async_db)
#     # Add authentication dependency here later
# ):
#     """
#     Update an existing book by slug. (Requires Admin privileges)
#     """
#     db_book = await service.book_service.get_book_by_slug(db, slug=slug)
#     if db_book is None:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
#     try:
#         updated_book = await service.book_service.update_book(db=db, db_book=db_book, book_in=book_in)
#         return updated_book
#     except ValueError as e:
#         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
#     except Exception as e:
#          # Log the exception e
#          raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error during book update.")


# @router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_book(
#     book_id: int,
#     db: AsyncSession = Depends(get_async_db)
#     # Add authentication dependency here later
# ):
#     """
#     Delete a book by its ID. (Requires Admin privileges)
#     """
#     deleted = await service.book_service.delete_book(db=db, book_id=book_id)
#     if not deleted:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
#     return None # Return No Content on success

@router.get("/tags", response_model=list[TagRead])
async def get_book_tags(
    db: AsyncSession = Depends(get_async_db)
):
    """
    Get all unique tags that are attached to books.
    """
    tags = await book_service.get_book_tags(db)
    return tags
