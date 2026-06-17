from models.project_state import (
    ProjectState
)

from services.project_status_service import (
    ProjectStatusService
)

from services.publish_service import (
    PublishService
)


class PublishAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        ProjectStatusService.update(
            project_id=state.project_id,
            status="ready_to_publish",
            current_step="publishing",
            progress=99
        )

        state.publish_data = (
            PublishService.publish(
                state
            )
        )

        return state