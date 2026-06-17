from dataclasses import dataclass, field
from uuid import uuid4


@dataclass
class ProjectState:

    # --------------------------------------------------
    # Project Metadata
    # --------------------------------------------------

    project_id: str = field(
        default_factory=lambda: str(uuid4())
    )

    topic: str = ""

    # --------------------------------------------------
    # Workflow Status
    # --------------------------------------------------

    status: str = "queued"

    current_step: str = "queued"

    progress: int = 0

    # --------------------------------------------------
    # Research Agent
    # --------------------------------------------------

    research: str = ""

    # --------------------------------------------------
    # Script Agent
    # --------------------------------------------------

    script: str = ""

    # --------------------------------------------------
    # Scene Planner Agent
    # --------------------------------------------------

    scene_plan: list = field(
        default_factory=list
    )

    # --------------------------------------------------
    # Image Agent
    # --------------------------------------------------

    image_paths: list = field(
        default_factory=list
    )

    # --------------------------------------------------
    # Voice Agent
    # --------------------------------------------------

    audio_path: str = ""

    # --------------------------------------------------
    # Subtitle Agent
    # --------------------------------------------------

    subtitle_path: str = ""

    # --------------------------------------------------
    # Video Agent
    # --------------------------------------------------

    video_path: str = ""

    # --------------------------------------------------
    # Future Agents
    # --------------------------------------------------

    thumbnail_paths: list = field(
        default_factory=list
    )

    seo_data: dict = field(
        default_factory=dict
    )

    publish_data: dict = field(
        default_factory=dict
    )