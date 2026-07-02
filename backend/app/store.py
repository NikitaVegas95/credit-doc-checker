from app.schemas import CheckResult


class CheckStore:
    def __init__(self) -> None:
        self._data: dict[str, CheckResult] = {}

    def save(self, result: CheckResult) -> None:
        self._data[result.check_id] = result

    def get(self, check_id: str) -> CheckResult | None:
        return self._data.get(check_id)

    def all(self) -> list[CheckResult]:
        return list(reversed(list(self._data.values())))

    def delete(self, check_id: str) -> bool:
        if check_id not in self._data:
            return False
        del self._data[check_id]
        return True


store = CheckStore()
