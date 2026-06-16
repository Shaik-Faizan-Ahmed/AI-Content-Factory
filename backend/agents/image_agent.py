import time
import requests

from urllib.parse import quote

from models.project_state import (
    ProjectState
)

from services.storage_service import (
    StorageService
)


class ImageAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        image_paths = []

        images_dir = (
            StorageService
            .get_images_path(
                state.project_id
            )
        )

        for scene in state.scene_plan:

            scene_number = (
                scene["scene_number"]
            )

            visual_description = (
                scene[
                    "visual_description"
                ]
            )

            prompt = f"""
Cinematic

{visual_description}

Highly detailed
Professional photography
4k
"""

            encoded_prompt = quote(
                prompt
            )

            url = (
                "https://image.pollinations.ai/prompt/"
                f"{encoded_prompt}"
            )

            print(
                f"Generating Scene {scene_number}"
            )

            try:

                response = requests.get(
                    url,
                    timeout=180
                )

                content_type = (
                    response.headers.get(
                        "content-type",
                        ""
                    )
                )

                if (
                    "image"
                    not in content_type
                ):

                    print(
                        f"Failed Scene {scene_number}"
                    )

                    continue

                image_path = (
                    images_dir
                    /
                    f"scene_{scene_number}.png"
                )

                with open(
                    image_path,
                    "wb"
                ) as img:

                    img.write(
                        response.content
                    )

                image_paths.append(
                    {
                        "scene_number":
                        scene_number,

                        "image_path":
                        str(image_path)
                    }
                )

                print(
                    f"Saved {image_path}"
                )

                time.sleep(15)

            except Exception as e:

                print(
                    f"Scene {scene_number}"
                )

                print(e)

        state.image_paths = (
            image_paths
        )

        return state