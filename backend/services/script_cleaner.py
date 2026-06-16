import re


class ScriptCleaner:

    @staticmethod
    def clean(
        script: str
    ) -> str:

        cleaned = re.sub(
            r"\[SCENE_\d+\]\s*",
            "",
            script
        )

        return cleaned.strip()