import json

from moviepy import (
    ImageClip,
    AudioFileClip,
    concatenate_videoclips
)

from models.project_state import (
    ProjectState
)

from services.storage_service import (
    StorageService
)

from services.ffmpeg_service import (
    FFmpegService
)

from services.project_status_service import (
    ProjectStatusService
)

class VideoAgent:

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        ProjectStatusService.update(
            project_id=state.project_id,
            status="assembling_video",
            current_step="video_generation",
            progress=90
        )

        project_dir = (
            StorageService
            .get_project_path(
                state.project_id
            )
        )

        video_dir = (
            StorageService
            .get_video_path(
                state.project_id
            )
        )

        scene_plan_path = (
            project_dir
            /
            "scene_plan.json"
        )

        with open(
            scene_plan_path,
            "r",
            encoding="utf-8"
        ) as f:

            scene_plan = json.load(f)

        clips = []

        for scene in scene_plan:

            scene_number = (
                scene["scene_number"]
            )

            duration = (
                scene["duration"]
            )

            image_path = (
                project_dir
                /
                "images"
                /
                f"scene_{scene_number}.png"
            )

            if not image_path.exists():

                print(
                    f"Missing image:"
                    f" {image_path}"
                )

                continue

            clip = (
                ImageClip(
                    str(image_path)
                )
                .with_duration(
                    duration
                )
            )

            clips.append(
                clip
            )

        if not clips:

            raise ValueError(
                "No image clips found."
            )

        video = (
            concatenate_videoclips(
                clips,
                method="compose"
            )
        )

        audio_path = (
            project_dir
            /
            "audio"
            /
            "narration.wav"
        )

        audio = (
            AudioFileClip(
                str(audio_path)
            )
        )

        video = (
            video
            .with_audio(
                audio
            )
        )

        temp_video = (
            video_dir
            /
            "video_no_subs.mp4"
        )

        final_video = (
            video_dir
            /
            "final_video.mp4"
        )

        print(
            "Rendering video..."
        )

        video.write_videofile(

            str(temp_video),

            fps=24,

            codec="libx264",

            audio_codec="aac"
        )

        subtitle_file = (
            project_dir
            /
            "subtitles"
            /
            "subtitles.srt"
        )

        print(
            "Burning subtitles..."
        )

        FFmpegService.burn_subtitles(

            temp_video,

            subtitle_file,

            final_video
        )

        state.video_path = (
            str(final_video)
        )

        print(
            f"Video saved:"
            f" {final_video}"
        )

        return state