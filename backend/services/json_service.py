import json


class JsonService:

    @staticmethod
    def clean_json_response(
        text: str
    ) -> str:

        text = text.strip()

        if text.startswith(
            "```json"
        ):
            text = text.replace(
                "```json",
                "",
                1
            )

        if text.endswith(
            "```"
        ):
            text = text[:-3]

        return text.strip()

    @staticmethod
    def parse_json(
        text: str
    ):

        cleaned = (
            JsonService
            .clean_json_response(
                text
            )
        )

        return json.loads(
            cleaned
        )