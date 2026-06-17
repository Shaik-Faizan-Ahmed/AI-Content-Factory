from models.project_state import (
    ProjectState
)

from services.project_status_service import (
    ProjectStatusService
)

from services.seo_service import (
    SEOService
)


class SEOAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        ProjectStatusService.update(
            project_id=state.project_id,
            status="generating_seo",
            current_step="seo_generation",
            progress=98
        )

        state.seo_data = (
            SEOService.generate(
                state
            )
        )

        return state