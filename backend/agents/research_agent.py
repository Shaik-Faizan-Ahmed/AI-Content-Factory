from models.project_state import (
    ProjectState
)

from services.gemini_service import (
    GeminiService
)

from services.project_status_service import (
    ProjectStatusService
)


class ResearchAgent:

    def __init__(self):

        self.gemini = (
            GeminiService()
        )

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        ProjectStatusService.update(
            project_id=state.project_id,
            status="researching",
            current_step="research",
            progress=10
        )

        prompt = f"""
You are a research analyst.

Research:

{state.topic}

Return:

1. Key Concepts
2. Important Facts
3. Timeline
4. Sources
"""

        state.research = (
            self.gemini.generate(
                prompt
            )
        )

        return state