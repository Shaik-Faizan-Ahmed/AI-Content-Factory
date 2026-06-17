from services.project_registry_service import (
    ProjectRegistryService
)


class ProjectStatusService:

    @staticmethod
    def update(
        project_id: str,
        status: str,
        current_step: str,
        progress: int
    ):

        registry = (
            ProjectRegistryService
            .load_registry()
        )

        for project in registry:

            if (
                project["project_id"]
                ==
                project_id
            ):

                project[
                    "status"
                ] = status

                project[
                    "current_step"
                ] = current_step

                project[
                    "progress"
                ] = progress

                break

        ProjectRegistryService.save_registry(
            registry
        )

    @staticmethod
    def mark_completed(
        project_id: str
    ):

        ProjectStatusService.update(
            project_id=project_id,
            status="completed",
            current_step="completed",
            progress=100
        )

    @staticmethod
    def mark_failed(
        project_id: str
    ):

        ProjectStatusService.update(
            project_id=project_id,
            status="failed",
            current_step="failed",
            progress=0
        )