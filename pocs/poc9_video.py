from pathlib import Path

from moviepy import (
    ImageClip,
    AudioFileClip
)

# -------------------------------------------------
# PATHS
# -------------------------------------------------

IMAGE_PATH = "../outputs/images/scene_1.png"

AUDIO_PATH = "../outputs/audio/narration.wav"

OUTPUT_PATH = "../outputs/videos/video.mp4"

# -------------------------------------------------
# OUTPUT FOLDER
# -------------------------------------------------

Path(
    "../outputs/videos"
).mkdir(
    parents=True,
    exist_ok=True
)

# -------------------------------------------------
# LOAD AUDIO
# -------------------------------------------------

audio = AudioFileClip(
    AUDIO_PATH
)

# -------------------------------------------------
# CREATE IMAGE CLIP
# -------------------------------------------------

video = (
    ImageClip(
        IMAGE_PATH
    )
    .with_duration(
        audio.duration
    )
)

# -------------------------------------------------
# ATTACH AUDIO
# -------------------------------------------------

video = video.with_audio(
    audio
)

# -------------------------------------------------
# EXPORT
# -------------------------------------------------

video.write_videofile(
    OUTPUT_PATH,
    fps=24
)

print(
    f"Video saved: {OUTPUT_PATH}"
)