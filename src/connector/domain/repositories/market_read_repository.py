from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
from typing import Generic, TypeVar

TEvent = TypeVar("TEvent")


class MarketReadRepository(ABC, Generic[TEvent]):
    @abstractmethod
    def get_symbol_stream(self, symbol: str) -> AsyncGenerator[TEvent, None]:
        pass
