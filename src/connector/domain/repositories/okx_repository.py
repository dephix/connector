from abc import ABC

from connector.domain.models.okx_event import OkxEvent

from .market_read_repository import MarketReadRepository
from .market_write_repository import MarketWriteRepository


class OkxRepository(MarketReadRepository[OkxEvent], MarketWriteRepository, ABC):
    pass
