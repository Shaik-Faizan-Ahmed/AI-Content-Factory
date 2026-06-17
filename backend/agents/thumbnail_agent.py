from models.project_state import (
    ProjectState
)

from services.project_status_service import (
    ProjectStatusService
)

from services.thumbnail_service import (
    ThumbnailService
)


class ThumbnailAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        ProjectStatusService.update(
            project_id=state.project_id,
            status="generating_thumbnail",
            current_step="thumbnail_generation",
            progress=95
        )

        thumbnail_paths = (
            ThumbnailService.generate(
                state
            )
        )

        state.thumbnail_paths = (
            thumbnail_paths
        )

        return state