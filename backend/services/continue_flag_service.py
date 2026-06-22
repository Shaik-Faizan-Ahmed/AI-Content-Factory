import time
from pathlib import Path
from services.storage_service import StorageService


class ContinueFlagService:

    @staticmethod
    def _flag_path(project_id: str, stage: str) -> Path:
        return StorageService.get_project_path(project_id) / f"continue_{stage}.flag"

    @staticmethod
    def set_flag(project_id: str, stage: str):
        ContinueFlagService._flag_path(project_id, stage).touch()

    @staticmethod
    def wait_for_continue(project_id: str, stage: str, timeout: int = 3600):
        flag_path = ContinueFlagService._flag_path(project_id, stage)
        elapsed = 0
        while not flag_path.exists():
            time.sleep(2)
            elapsed += 2
            if elapsed >= timeout:
                raise TimeoutError(f"Timed out waiting for continue at stage: {stage}")
        flag_path.unlink(missing_ok=True)

    @staticmethod
    def clear_flag(project_id: str, stage: str):
        ContinueFlagService._flag_path(project_id, stage).unlink(missing_ok=True)
