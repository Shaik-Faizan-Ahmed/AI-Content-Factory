import json
import requests
import time

from pathlib import Path
from urllib.parse import quote

# ----------------------------------------------------
# CONFIG
# ----------------------------------------------------

VIDEO_STYLE = "Cinematic"

IMAGE_OUTPUT_DIR = Path(
    "../outputs/images"
)

IMAGE_OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)

# ----------------------------------------------------
# LOAD SCENES
# ----------------------------------------------------

with open(
    "scene_plan.json",
    "r",
    encoding="utf-8"
) as f:

    scenes = json.load(f)

# ----------------------------------------------------
# GENERATE IMAGES
# ----------------------------------------------------

for scene in scenes:

    scene_number = scene["scene_number"]

    visual = scene["visual_description"]

    prompt = f"""
    {VIDEO_STYLE}

    {visual}

    highly detailed
    professional photography
    4k
    """

    encoded_prompt = quote(prompt)

    url = (
        "https://image.pollinations.ai/prompt/"
        f"{encoded_prompt}"
    )

    print(
        f"\nGenerating Scene {scene_number}..."
    )

    success = False

    for attempt in range(3):

        try:

            response = requests.get(
                url,
                timeout=180
            )

            content_type = response.headers.get(
                "content-type",
                ""
            )

            if "image" not in content_type:

                print(
                    f"Attempt {attempt+1} failed."
                )

                print(
                    response.text[:200]
                )

                time.sleep(10)

                continue

            image_path = (
                IMAGE_OUTPUT_DIR
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

            print(
                f"Saved {image_path}"
            )

            success = True

            break

        except Exception as e:

            print(
                f"Error: {e}"
            )

            time.sleep(10)

    if not success:

        print(
            f"FAILED Scene {scene_number}"
        )

    # Give Pollinations breathing room
    time.sleep(15)

print(
    "\nAll image generation attempts complete."
)