import json

from pathlib import Path
from datetime import datetime


class ProjectRegistryService:

    REGISTRY_PATH = Path(
        "storage/projects_registry.json"
    )

    @classmethod
    def load_registry(
        cls
    ):

        if not cls.REGISTRY_PATH.exists():

            return []

        with open(
            cls.REGISTRY_PATH,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)

    @classmethod
    def save_registry(
        cls,
        registry
    ):

        with open(
            cls.REGISTRY_PATH,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                registry,
                f,
                indent=4,
                ensure_ascii=False
            )

    @classmethod
    def register_project(
        cls,
        project_id,
        topic,
        status="queued"
    ):

        registry = (
            cls.load_registry()
        )

        registry.append({

            "project_id":
            project_id,

            "topic":
            topic,

            "status":
            status,

            "current_step":
            "queued",

            "progress":
            0,

            "created_at":
            datetime.now().isoformat()
        })

        cls.save_registry(
            registry
        )

    @classmethod
    def get_all_projects(
        cls
    ):

        return cls.load_registry()

    @classmethod
    def get_project(
        cls,
        project_id
    ):

        registry = (
            cls.load_registry()
        )

        for project in registry:

            if (
                project["project_id"]
                ==
                project_id
            ):

                return project

        return None