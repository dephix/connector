from abc import ABC

from connector.domain.models.drift_event import DriftEvent

from .market_read_repository import MarketReadRepository
from .market_write_repository import MarketWriteRepository


class DriftRepository(MarketReadRepository[DriftEvent], MarketWriteRepository, ABC):
    pass
