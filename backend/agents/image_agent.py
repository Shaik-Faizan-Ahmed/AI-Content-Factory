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

        style_prompts = {

            "documentary":
            """
Documentary photography.
National Geographic style.
Professional photography.
Real world imagery.
""",

            "realistic":
            """
Ultra realistic.
Photorealistic.
Natural lighting.
Real world details.
""",

            "anime":
            """
Anime art style.
Japanese animation.
Vibrant colors.
Detailed characters.
""",

            "pixar":
            """
Pixar style.
3D animated movie.
Family friendly.
Expressive characters.
""",

            "motion_graphics":
            """
Modern motion graphics.
Infographic style.
Clean design.
Professional presentation visuals.
""",

            "ai_generated":
            """
Creative AI artwork.
Futuristic.
Highly detailed.
Modern generative art.
""",

            "product_commercial":
            """
Luxury product advertisement.
Studio lighting.
Commercial photography.
Premium branding visuals.
""",

            "cinematic":
            """
Hollywood cinematic frame.
Movie scene.
Dramatic lighting.
High production quality.
"""
        }

        style_prompt = (
            style_prompts.get(
                state.style.lower(),
                style_prompts["documentary"]
            )
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
{style_prompt}

Scene Description:

{visual_description}

Highly detailed

4k

Professional quality

No text

No watermark
"""

            image_path = (
                images_dir
                /
                f"scene_{scene_number}.png"
            )

            print(
                f"Generating Scene {scene_number}"
            )

            print(
                f"Style: {state.style}"
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