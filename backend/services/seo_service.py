import json

from services.gemini_service import (
    GeminiService
)

from services.storage_service import (
    StorageService
)

from services.json_service import (
    JsonService
)


class SEOService:

    @staticmethod
    def generate(
        state
    ):

        gemini = GeminiService()

        prompt = f"""
Create SEO metadata for a YouTube video.

Topic:
{state.topic}

Script:
{state.script}

Return ONLY valid JSON:

{{
    "title": "...",
    "description": "...",
    "tags": [
        "...",
        "..."
    ]
}}
"""

        response = (
            gemini.generate(
                prompt
            )
        )

        seo_data = (
            JsonService.parse_json(
                response
            )
        )

        seo_dir = (
            StorageService
            .get_seo_path(
                state.project_id
            )
        )

        seo_file = (
            seo_dir
            /
            "seo.json"
        )

        with open(
            seo_file,
            "w",
            encoding="utf-8"
        ) as f:

            json.dump(
                seo_data,
                f,
                indent=4,
                ensure_ascii=False
            )

        return seo_data