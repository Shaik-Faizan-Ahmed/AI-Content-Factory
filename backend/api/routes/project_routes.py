from fastapi import APIRouter

from api.schemas.project_schema import (
    CreateProjectRequest
)

from workflows.content_workflow import (
    ContentWorkflow
)

from services.project_registry_service import (
    ProjectRegistryService
)

from services.project_asset_service import (
    ProjectAssetService
)

from models.project_state import (
    ProjectState
)

from services.workflow_runner_service import (
    WorkflowRunnerService
)

router = APIRouter()

workflow = (
    ContentWorkflow()
)


@router.post(
    "/projects"
)
def create_project(
    request: CreateProjectRequest
):

    state = ProjectState(
        topic=request.topic
    )

    ProjectRegistryService.register_project(

        project_id=state.project_id,

        topic=state.topic,

        status="queued"
    )

    WorkflowRunnerService.start(
        state
    )

    return {

        "project_id":
        state.project_id,

        "status":
        "queued"
    }


@router.get(
    "/projects"
)
def get_projects():

    return (
        ProjectRegistryService
        .get_all_projects()
    )


@router.get(
    "/projects/{project_id}/assets"
)
def get_project_assets(
    project_id: str
):

    return (
        ProjectAssetService
        .get_assets(
            project_id
        )
    )


@router.get(
    "/projects/{project_id}"
)
def get_project(
    project_id: str
):

    project = (
        ProjectRegistryService
        .get_project(
            project_id
        )
    )

    if not project:

        return {
            "error":
            "Project not found"
        }

    return project