# app/models/exchange.py
import enum
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Boolean, Numeric,
    ForeignKey, Enum as SQLAlchemyEnum, SmallInteger, Date, Table,
    UniqueConstraint, Index, PrimaryKeyConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.sql import expression  # Required for server_default=expression.false()

# Import Base and Item
from .base import Base
from .item import Item, ItemTypeEnum  # Import Item and the Enum

# Define KycTypeEnum
class KycTypeEnum(enum.Enum):
    NONE = "none"
    BASIC = "basic"
    ADVANCED = "advanced"
    VERIFIED_PLUS = "verified_plus"

# --- Association Tables (Many-to-Many) ---
exchange_languages_table = Table('exchange_languages', Base.metadata,
    Column('exchange_id', Integer, ForeignKey('exchanges.id', ondelete='CASCADE'), primary_key=True),
    Column('language_id', Integer, ForeignKey('languages.id', ondelete='CASCADE'), primary_key=True)
)

exchange_availability_table = Table('exchange_availability', Base.metadata,
    Column('exchange_id', Integer, ForeignKey('exchanges.id', ondelete='CASCADE'), primary_key=True),
    Column('country_id', Integer, ForeignKey('countries.id', ondelete='CASCADE'), primary_key=True)
)

exchange_fiat_support_table = Table('exchange_fiat_support', Base.metadata,
    Column('exchange_id', Integer, ForeignKey('exchanges.id', ondelete='CASCADE'), primary_key=True),
    Column('fiat_currency_id', Integer, ForeignKey('fiat_currencies.id', ondelete='CASCADE'), primary_key=True)
)

news_item_exchanges_table = Table('news_item_exchanges', Base.metadata,
    Column('news_item_id', Integer, ForeignKey('news_items.id', ondelete='CASCADE'), primary_key=True),
    Column('exchange_id', Integer, ForeignKey('exchanges.id', ondelete='CASCADE'), primary_key=True)
)

# --- Model Class ---

# Inherit from Item instead of Base
class Exchange(Item):
    __tablename__ = 'exchanges'

    # Primary Key is now also a Foreign Key to the items table
    id = Column(Integer, ForeignKey('items.id', ondelete='CASCADE'), primary_key=True)

    # --- Common fields are inherited from Item ---
    # Note: Item class contains total_review_count (reviews with comments)
    # and total_rating_count (reviews with ratings) fields

    # --- Exchange-specific fields ---
    year_founded = Column(SmallInteger)
    registration_country_id = Column(Integer, ForeignKey('countries.id', ondelete='SET NULL'))
    headquarters_country_id = Column(Integer, ForeignKey('countries.id', ondelete='SET NULL'), nullable=True)

    has_kyc = Column(Boolean, nullable=True, default=None, server_default=expression.false())  # Changed from nullable=False
    has_p2p = Column(Boolean, nullable=True, default=None)  # SQL: bool NOT NULL
    has_copy_trading = Column(Boolean, nullable=True, default=None, server_default=expression.false())
    has_staking = Column(Boolean, nullable=True, default=None, server_default=expression.false())
    has_futures = Column(Boolean, nullable=True, default=None, server_default=expression.false())
    has_spot_trading = Column(Boolean, nullable=True, default=None, server_default=expression.false())
    has_demo_trading = Column(Boolean, nullable=True, default=None, server_default=expression.false())

    trading_volume_24h = Column(Numeric(20, 2), index=True, nullable=True)
    
    spot_maker_fee = Column(Numeric(8, 5), nullable=True)  # Renamed from spot_fee
    futures_maker_fee = Column(Numeric(8, 5), nullable=True)  # Renamed from futures_fee
    spot_taker_fee = Column(Numeric(8, 5), nullable=True)  # New field
    futures_taker_fee = Column(Numeric(8, 5), nullable=True)  # New field
    
    fee_structure_summary = Column(Text, nullable=True)
    security_details = Column(Text, nullable=True)
    kyc_aml_policy = Column(Text, nullable=True)

    # Exchange-specific aggregated fields
    liquidity_score = Column(Numeric(5, 2), nullable=True)  # Removed default, nullable=True
    newbie_friendliness_score = Column(Numeric(3, 2), nullable=True)  # Removed default, nullable=True

    # --- Relationships ---
    registration_country = relationship("Country", back_populates="registered_exchanges", foreign_keys=[registration_country_id])
    headquarters_country = relationship("Country", back_populates="headquartered_exchanges", foreign_keys=[headquarters_country_id])
    available_in_countries = relationship("Country", secondary=exchange_availability_table, back_populates="available_exchanges")
    languages = relationship("Language", secondary=exchange_languages_table, back_populates="exchanges")
    supported_fiat_currencies = relationship("FiatCurrency", secondary=exchange_fiat_support_table, back_populates="exchanges")
    licenses = relationship("License", back_populates="exchange", cascade="all, delete-orphan")
    social_links = relationship("ExchangeSocialLink", back_populates="exchange", cascade="all, delete-orphan")
    news_items = relationship("NewsItem", secondary=news_item_exchanges_table, back_populates="exchanges")
    guide_items = relationship("GuideItem", back_populates="exchange", cascade="all, delete-orphan")

    # --- Polymorphism Setup ---
    __mapper_args__ = {
        'polymorphic_identity': ItemTypeEnum.exchange,  # Specific identity for this subclass
    }

    # Optional: Define __repr__ if you want specific Exchange details
    # def __repr__(self):
    #     return f"<Exchange(id={self.id}, name='{self.name}')>"  # name is inherited

class License(Base):
    __tablename__ = 'licenses'
    id = Column(Integer, primary_key=True)
    exchange_id = Column(Integer, ForeignKey('exchanges.id', ondelete='CASCADE'), nullable=False)
    jurisdiction_country_id = Column(Integer, ForeignKey('countries.id', ondelete='RESTRICT'), nullable=False)  # Prevent deleting country if license exists
    license_number = Column(String(255))
    status = Column(String(50))
    issue_date = Column(Date)
    expiry_date = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    exchange = relationship("Exchange", back_populates="licenses")
    jurisdiction_country = relationship("Country", back_populates="licenses_issued")

    __table_args__ = (Index('idx_licenses_exchange', 'exchange_id'), )

class ExchangeSocialLink(Base):
    __tablename__ = 'exchange_social_links'
    id = Column(Integer, primary_key=True)
    exchange_id = Column(Integer, ForeignKey('exchanges.id', ondelete='CASCADE'), nullable=False)
    platform_name = Column(String(50), nullable=False)  # e.g., 'Twitter', 'Telegram'
    url = Column(String(512), nullable=False)

    # Relationships
    exchange = relationship("Exchange", back_populates="social_links")

    __table_args__ = (UniqueConstraint('exchange_id', 'platform_name', name='uk_exchange_platform'),)
