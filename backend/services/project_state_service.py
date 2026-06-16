import json

from services.storage_service import (
    StorageService
)


class ProjectStateService:

    @staticmethod
    def save_scene_plan(
        project_id: str,
        scene_plan: list
    ):

        project_dir = (
            StorageService
            .get_project_path(
                project_id
            )
        )

        scene_plan_path = (
            project_dir
            /
            "scene_plan.json"
        )

        with open(
            scene_plan_path,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                scene_plan,
                f,
                indent=4,
                ensure_ascii=False
            )

    @staticmethod
    def load_scene_plan(
        project_id: str
    ):

        project_dir = (
            StorageService
            .get_project_path(
                project_id
            )
        )

        scene_plan_path = (
            project_dir
            /
            "scene_plan.json"
        )

        with open(
            scene_plan_path,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)