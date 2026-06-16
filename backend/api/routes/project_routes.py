from fastapi import APIRouter

from api.schemas.project_schema import (
    CreateProjectRequest
)

from workflows.content_workflow import (
    ContentWorkflow
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

    result = workflow.run(
        request.topic
    )

    return {

        "project_id":
        result.project_id,

        "video_path":
        result.video_path,

        "status":
        "completed"
    }