# app/models/__init__.py
from .base import Base  # Import Base first
from .common import Country, Language, FiatCurrency
from .user import User
from .exchange import (
    Exchange, License, ExchangeSocialLink,
    exchange_languages_table, exchange_availability_table,
    exchange_fiat_support_table, news_item_exchanges_table
)
from .books import (
    Book,
)
from .review import (
    Review, ReviewScreenshot, ReviewUsefulnessVote
)
from .news import NewsItem
from .guide import GuideItem
from .static_page import StaticPage
from .item import Item, ItemTypeEnum
from .tag import Tag, item_tags_association

# You can optionally define __all__ if needed
__all__ = [
    "Base",
    "Item",
    "ItemTypeEnum",
    "Tag",
    "item_tags_association"
]