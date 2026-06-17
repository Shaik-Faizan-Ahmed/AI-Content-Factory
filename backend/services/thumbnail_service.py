from services.storage_service import (
    StorageService
)

from services.image_service import (
    ImageService
)


class ThumbnailService:

    @staticmethod
    def generate(
        state
    ):

        thumbnail_dir = (
            StorageService
            .get_thumbnail_path(
                state.project_id
            )
        )

        output_path = (
            thumbnail_dir
            /
            "thumbnail_1.png"
        )

        prompt = f"""
Professional YouTube Thumbnail

Topic:
{state.topic}

Bright colors
High contrast
Eye catching
Professional
Click worthy
"""

        ImageService.generate_image(
            prompt=prompt,
            output_path=output_path
        )

        return [
            str(output_path)
        ]