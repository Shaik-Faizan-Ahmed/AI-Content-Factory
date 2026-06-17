from pathlib import Path

from services.storage_service import (
    StorageService
)


class ProjectAssetService:

    @staticmethod
    def get_assets(
        project_id: str
    ):

        project_dir = (
            StorageService
            .get_project_path(
                project_id
            )
        )

        video_path = (
            project_dir
            /
            "video"
            /
            "final_video.mp4"
        )

        audio_path = (
            project_dir
            /
            "audio"
            /
            "narration.wav"
        )

        subtitle_path = (
            project_dir
            /
            "subtitles"
            /
            "subtitles.srt"
        )

        image_dir = (
            project_dir
            /
            "images"
        )

        image_count = len(
            list(
                image_dir.glob(
                    "*.png"
                )
            )
        )

        return {

            "video_path":
            str(video_path),

            "audio_path":
            str(audio_path),

            "subtitle_path":
            str(subtitle_path),

            "image_count":
            image_count
        }