class SubtitleService:

    @staticmethod
    def seconds_to_srt_time(
        seconds: float
    ) -> str:

        hours = int(
            seconds // 3600
        )

        minutes = int(
            (seconds % 3600) // 60
        )

        secs = int(
            seconds % 60
        )

        millis = int(
            (seconds - int(seconds))
            * 1000
        )

        return (
            f"{hours:02}:{minutes:02}:"
            f"{secs:02},{millis:03}"
        )