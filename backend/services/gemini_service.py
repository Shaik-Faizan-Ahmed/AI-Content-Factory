import os

from pathlib import Path

import google.generativeai as genai

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent

ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)


class GeminiService:

    def __init__(self):

        api_key = os.getenv(
            "GEMINI_API_KEY"
        )

        if not api_key:

            raise ValueError(
                "GEMINI_API_KEY not found."
            )

        genai.configure(
            api_key=api_key
        )

        self.model = (
            genai.GenerativeModel(
                "gemini-2.5-flash"
            )
        )

    def generate(
        self,
        prompt: str
    ) -> str:

        response = (
            self.model.generate_content(
                prompt
            )
        )

        return response.text