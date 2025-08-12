from connector.shared.domain.repositories.market_read_repository import MarketReadRepository


class BybitReadRepository(MarketReadRepository):
    def get_symbol_stream(self, symbol: str) -> AsyncGenerator[TEvent, None]:
        pass
