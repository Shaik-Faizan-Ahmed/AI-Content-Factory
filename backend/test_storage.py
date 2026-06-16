from models.project_state import (
    ProjectState
)

from services.storage_service import (
    StorageService
)

state = ProjectState(
    topic="test"
)

path = StorageService.get_project_path(
    state.project_id
)

print(path)