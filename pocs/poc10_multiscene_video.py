import json

from pathlib import Path

from moviepy import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips
)

# ------------------------------------
# LOAD SCENES
# ------------------------------------

with open(
    "scene_plan.json",
    "r",
    encoding="utf-8"
) as f:
    scenes = json.load(f)

# ------------------------------------
# AUDIO
# ------------------------------------

audio = AudioFileClip(
    "../outputs/audio/narration.wav"
)

# ------------------------------------
# VIDEO CLIPS
# ------------------------------------

clips = []

for scene in scenes:

    scene_number = (
        scene["scene_number"]
    )

    duration = (
        scene["duration"]
    )

    image_path = (
        f"../outputs/images/"
        f"scene_{scene_number}.png"
    )

    clip = (
        ImageClip(
            image_path
        )
        .with_duration(
            duration
        )
    )

    clips.append(
        clip
    )

# ------------------------------------
# MERGE
# ------------------------------------

video = concatenate_videoclips(
    clips,
    method="compose"
)

# ------------------------------------
# ATTACH AUDIO
# ------------------------------------

video = video.with_audio(
    audio
)

# ------------------------------------
# OUTPUT
# ------------------------------------

Path(
    "../outputs/videos"
).mkdir(
    parents=True,
    exist_ok=True
)

output_path = (
    "../outputs/videos/"
    "multiscene_video.mp4"
)

video.write_videofile(
    output_path,
    fps=24
)

print(
    f"Saved: {output_path}"
)