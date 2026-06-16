from models.project_state import (
    ProjectState
)

from services.storage_service import (
    StorageService
)

from services.subtitle_service import (
    SubtitleService
)


class SubtitleAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        subtitle_dir = (
            StorageService
            .get_subtitle_path(
                state.project_id
            )
        )

        subtitle_path = (
            subtitle_dir
            /
            "subtitles.srt"
        )

        current_time = 0

        srt_lines = []

        for index, scene in enumerate(
            state.scene_plan,
            start=1
        ):

            duration = (
                scene["duration"]
            )

            narration = (
                scene["narration"]
            )

            start_time = (
                SubtitleService
                .seconds_to_srt_time(
                    current_time
                )
            )

            end_time = (
                SubtitleService
                .seconds_to_srt_time(
                    current_time
                    + duration
                )
            )

            srt_lines.append(
                str(index)
            )

            srt_lines.append(
                f"{start_time} --> "
                f"{end_time}"
            )

            srt_lines.append(
                narration
            )

            srt_lines.append(
                ""
            )

            current_time += (
                duration
            )

        with open(
            subtitle_path,
            "w",
            encoding="utf-8"
        ) as f:

            f.write(
                "\n".join(
                    srt_lines
                )
            )

        state.subtitle_path = (
            str(subtitle_path)
        )

        print(
            f"Subtitle saved: "
            f"{subtitle_path}"
        )

        return state