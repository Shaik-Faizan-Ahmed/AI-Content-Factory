from services.ffmpeg_service import (
    FFmpegService
)

FFmpegService.burn_subtitles(

    "storage/projects/a4125f71-f769-4436-b694-a6f88e8c2ac8/video/video_no_subs.mp4",

    "storage/projects/a4125f71-f769-4436-b694-a6f88e8c2ac8/subtitles/subtitles.srt",

    "storage/projects/a4125f71-f769-4436-b694-a6f88e8c2ac8/video/final_video.mp4"
)

print("Done")