import re
from pathlib import Path

# -------------------------------------------------
# CONFIG
# -------------------------------------------------

WORDS_PER_SECOND = 2.5

# -------------------------------------------------
# HELPERS
# -------------------------------------------------

def format_timestamp(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)

    return (
        f"{hours:02}:{minutes:02}:{secs:02},"
        f"{millis:03}"
    )

# -------------------------------------------------
# READ SCRIPT
# -------------------------------------------------

with open(
    "script.txt",
    "r",
    encoding="utf-8"
) as f:
    script = f.read()

# Remove scene markers

script = re.sub(
    r"\[SCENE_\d+\]",
    "",
    script
)

# Split into subtitle chunks

sentences = re.split(
    r'(?<=[.!?])\s+',
    script
)

# -------------------------------------------------
# BUILD SRT
# -------------------------------------------------

current_time = 0

srt_lines = []

for index, sentence in enumerate(
    sentences,
    start=1
):

    sentence = sentence.strip()

    if not sentence:
        continue

    word_count = len(
        sentence.split()
    )

    duration = (
        word_count
        / WORDS_PER_SECOND
    )

    start_time = current_time

    end_time = (
        current_time
        + duration
    )

    srt_lines.append(
        str(index)
    )

    srt_lines.append(
        f"{format_timestamp(start_time)} --> "
        f"{format_timestamp(end_time)}"
    )

    srt_lines.append(
        sentence
    )

    srt_lines.append("")

    current_time = end_time

# -------------------------------------------------
# SAVE
# -------------------------------------------------

Path(
    "../outputs/subtitles"
).mkdir(
    parents=True,
    exist_ok=True
)

output_path = (
    "../outputs/subtitles/captions.srt"
)

with open(
    output_path,
    "w",
    encoding="utf-8"
) as f:
    f.write(
        "\n".join(srt_lines)
    )

print(
    f"Saved: {output_path}"
)