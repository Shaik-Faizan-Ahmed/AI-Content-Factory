import subprocess
from pathlib import Path


class FFmpegService:

    @staticmethod
    def burn_subtitles(
        input_video,
        subtitle_file,
        output_video
    ):

        subtitle_path = (
            Path(subtitle_file)
            .resolve()
            .as_posix()
        )

        subtitle_path = (
            subtitle_path
            .replace(":", "\\:")
        )

        command = [

            "ffmpeg",

            "-y",

            "-i",
            str(input_video),

            "-vf",
            f"subtitles='{subtitle_path}'",

            str(output_video)
        ]

        print("\nFFMPEG COMMAND:")
        print(command)
        print()

        subprocess.run(
            command,
            check=True
        )