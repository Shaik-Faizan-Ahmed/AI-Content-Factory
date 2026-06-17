import json

from datetime import datetime

from services.storage_service import (
    StorageService
)


class PublishService:

    @staticmethod
    def publish(
        state
    ):

        publish_data = {

            "status":
            "ready_to_publish",

            "project_id":
            state.project_id,

            "video_path":
            state.video_path,

            "thumbnail_paths":
            state.thumbnail_paths,

            "published_at":
            datetime.now().isoformat()
        }

        publish_dir = (
            StorageService
            .get_publish_path(
                state.project_id
            )
        )

        publish_file = (
            publish_dir
            /
            "publish.json"
        )

        with open(
            publish_file,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                publish_data,
                f,
                indent=4,
                ensure_ascii=False
            )

        return publish_data