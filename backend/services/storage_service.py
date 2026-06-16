from pathlib import Path


class StorageService:

    BASE_PATH = Path(
        "storage/projects"
    )

    @classmethod
    def get_project_path(
        cls,
        project_id: str
    ):

        project_path = (
            cls.BASE_PATH
            /
            project_id
        )

        project_path.mkdir(
            parents=True,
            exist_ok=True
        )

        return project_path

    @classmethod
    def get_images_path(
        cls,
        project_id: str
    ):

        path = (
            cls.get_project_path(
                project_id
            )
            /
            "images"
        )

        path.mkdir(
            parents=True,
            exist_ok=True
        )

        return path

    @classmethod
    def get_audio_path(
        cls,
        project_id: str
    ):

        path = (
            cls.get_project_path(
                project_id
            )
            /
            "audio"
        )

        path.mkdir(
            parents=True,
            exist_ok=True
        )

        return path

    @classmethod
    def get_subtitle_path(
        cls,
        project_id: str
    ):

        path = (
            cls.get_project_path(
                project_id
            )
            /
            "subtitles"
        )

        path.mkdir(
            parents=True,
            exist_ok=True
        )

        return path

    @classmethod
    def get_video_path(
        cls,
        project_id: str
    ):

        path = (
            cls.get_project_path(
                project_id
            )
            /
            "video"
        )

        path.mkdir(
            parents=True,
            exist_ok=True
        )

        return path