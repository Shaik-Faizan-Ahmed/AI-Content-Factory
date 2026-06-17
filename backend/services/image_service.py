import requests

from urllib.parse import quote


class ImageService:

    @staticmethod
    def generate_image(
        prompt: str,
        output_path
    ):

        encoded_prompt = quote(
            prompt
        )

        url = (
            "https://image.pollinations.ai/prompt/"
            f"{encoded_prompt}"
        )

        response = requests.get(
            url,
            timeout=180
        )

        content_type = (
            response.headers.get(
                "content-type",
                ""
            )
        )

        if (
            "image"
            not in content_type
        ):

            raise Exception(
                "Image generation failed"
            )

        with open(
            output_path,
            "wb"
        ) as img:

            img.write(
                response.content
            )

        return str(
            output_path
        )