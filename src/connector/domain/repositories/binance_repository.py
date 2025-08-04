from abc import ABC

from connector.domain.models.binance_event import BinanceEvent

from .market_read_repository import MarketReadRepository
from .market_write_repository import MarketWriteRepository


class BinanceRepository(MarketReadRepository[BinanceEvent], MarketWriteRepository, ABC):
    pass
