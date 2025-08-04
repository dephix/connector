from abc import ABC

from connector.domain.models.bybit_event import BybitEvent

from .market_read_repository import MarketReadRepository
from .market_write_repository import MarketWriteRepository


class BybitRepository(MarketReadRepository[BybitEvent], MarketWriteRepository, ABC):
    pass
