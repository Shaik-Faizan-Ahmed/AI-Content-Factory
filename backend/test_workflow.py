from workflows.content_workflow import (
    ContentWorkflow
)

from models.project_state import (
    ProjectState
)

from services.project_registry_service import (
    ProjectRegistryService
)

workflow = ContentWorkflow()

state = ProjectState(
    topic="cricket t20 world cup 2026"
)

ProjectRegistryService.register_project(
    project_id=state.project_id,
    topic=state.topic,
    status="queued"
)

result = workflow.run(
    state
)

print(result.project_id)
print(result.video_path)