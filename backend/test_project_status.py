from services.project_registry_service import (
    ProjectRegistryService
)

from services.project_status_service import (
    ProjectStatusService
)

project_id = "test-project"

ProjectRegistryService.register_project(
    project_id=project_id,
    topic="Test Topic"
)

ProjectStatusService.update(
    project_id=project_id,
    status="researching",
    current_step="research",
    progress=10
)

print(
    ProjectRegistryService.get_project(
        project_id
    )
)