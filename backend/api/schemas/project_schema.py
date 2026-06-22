from pydantic import BaseModel


class CreateProjectRequest(
    BaseModel
):

    topic: str

    video_type: str = "educational"

    duration: int = 60

    voice: str = "narrator"

    style: str = "documentary"

    language: str = "english"

    mode: str = "review"