import threading
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from api.schemas.project_schema import CreateProjectRequest
from services.project_registry_service import ProjectRegistryService
from services.project_asset_service import ProjectAssetService
from services.project_full_state_service import ProjectFullStateService
from services.continue_flag_service import ContinueFlagService
from services.project_status_service import ProjectStatusService
from services.storage_service import StorageService
from services.workflow_runner_service import WorkflowRunnerService
from models.project_state import ProjectState
from workflows.content_workflow import ContentWorkflow
from pathlib import Path

router = APIRouter()

BASE_URL = "http://localhost:8000"
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
STORAGE_DIR = BACKEND_DIR / "storage"

VALID_STATE_FIELDS = set(ProjectState.__dataclass_fields__.keys())


def build_state(data: dict) -> ProjectState:
    filtered = {k: v for k, v in data.items() if k in VALID_STATE_FIELDS}
    return ProjectState(**filtered)


def to_url(path: str) -> str:
    if not path:
        return ""
    p = Path(path).resolve()
    try:
        rel = p.relative_to(STORAGE_DIR)
        return f"{BASE_URL}/storage/{rel.as_posix()}"
    except Exception:
        return path


class ContinueRequest(BaseModel):
    stage: str


class RegenerateRequest(BaseModel):
    stage: str


@router.post("/projects")
def create_project(request: CreateProjectRequest):
    state = ProjectState(
        topic=request.topic,
        video_type=request.video_type,
        duration=request.duration,
        voice=request.voice,
        style=request.style,
        language=request.language,
        mode=request.mode,
    )
    ProjectRegistryService.register_project(
        project_id=state.project_id,
        topic=state.topic,
        status="queued",
    )
    WorkflowRunnerService.start(state)
    return {"project_id": state.project_id, "status": "queued"}


@router.get("/projects")
def get_projects():
    return ProjectRegistryService.get_all_projects()


@router.get("/projects/{project_id}")
def get_project(project_id: str):
    project = ProjectRegistryService.get_project(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/projects/{project_id}/state")
def get_project_state(project_id: str):
    state = ProjectFullStateService.load(project_id)
    if not state:
        project = ProjectRegistryService.get_project(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project

    state["audio_url"] = to_url(state.get("audio_path", ""))
    state["video_url"] = to_url(state.get("video_path", ""))
    state["subtitle_url"] = to_url(state.get("subtitle_path", ""))
    state["image_urls"] = [
        {**img, "url": to_url(img.get("image_path", ""))}
        for img in state.get("image_paths", [])
    ]
    state["thumbnail_urls"] = [
        to_url(p) for p in state.get("thumbnail_paths", [])
    ]
    return state


@router.post("/projects/{project_id}/continue")
def continue_project(project_id: str, body: ContinueRequest):
    if not ProjectRegistryService.get_project(project_id):
        raise HTTPException(status_code=404, detail="Project not found")
    ContinueFlagService.set_flag(project_id, body.stage)
    return {"status": "ok", "stage": body.stage}


def _run_regenerate(state: ProjectState, stage: str):
    workflow = ContentWorkflow()
    try:
        if stage == "research":
            state = workflow.research_agent.run(state)
        elif stage == "script":
            state = workflow.script_agent.run(state)
        elif stage == "scene_planning":
            state = workflow.scene_planner_agent.run(state)
        elif stage == "image_generation":
            state = workflow.image_agent.run(state)
        elif stage == "voice_generation":
            state = workflow.voice_agent.run(state)
        elif stage == "video_review":
            state = workflow.video_agent.run(state)
        elif stage == "thumbnail_generation":
            state = workflow.thumbnail_agent.run(state)
        elif stage == "seo_generation":
            state = workflow.seo_agent.run(state)
        ProjectFullStateService.save(state)
        ContinueFlagService.set_flag(state.project_id, stage)
    except Exception as e:
        print(f"Regenerate failed for {stage}: {e}")


@router.post("/projects/{project_id}/regenerate")
def regenerate_stage(project_id: str, body: RegenerateRequest):
    state_data = ProjectFullStateService.load(project_id)
    if not state_data:
        raise HTTPException(status_code=404, detail="State not found")

    valid_stages = {
        "research", "script", "scene_planning", "image_generation",
        "voice_generation", "video_review", "thumbnail_generation", "seo_generation"
    }
    if body.stage not in valid_stages:
        raise HTTPException(status_code=400, detail=f"Unknown stage: {body.stage}")

    state = build_state(state_data)
    thread = threading.Thread(target=_run_regenerate, args=(state, body.stage), daemon=True)
    thread.start()
    return {"status": "regenerating", "stage": body.stage}


@router.get("/projects/{project_id}/assets")
def get_project_assets(project_id: str):
    return ProjectAssetService.get_assets(project_id)
