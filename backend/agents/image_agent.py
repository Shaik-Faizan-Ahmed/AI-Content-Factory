import time

from models.project_state import (
    ProjectState
)

from services.storage_service import (
    StorageService
)

from services.project_status_service import (
    ProjectStatusService
)

from services.image_service import (
    ImageService
)


class ImageAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        ProjectStatusService.update(
            project_id=state.project_id,
            status="generating_images",
            current_step="image_generation",
            progress=50
        )

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

            image_path = (
                images_dir
                /
                f"scene_{scene_number}.png"
            )

            print(
                f"Generating Scene {scene_number}"
            )

            try:

                ImageService.generate_image(
                    prompt=prompt,
                    output_path=image_path
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