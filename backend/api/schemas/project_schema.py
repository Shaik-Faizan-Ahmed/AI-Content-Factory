from pydantic import BaseModel


class CreateProjectRequest(
    BaseModel
):

    topic: str