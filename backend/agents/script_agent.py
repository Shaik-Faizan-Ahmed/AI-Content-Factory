from models.project_state import (
    ProjectState
)

from services.gemini_service import (
    GeminiService
)


class ScriptAgent:

    def __init__(self):

        self.gemini = (
            GeminiService()
        )

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        prompt = f"""
You are a professional documentary writer.

Using the research below,
create an educational script.

Requirements:

- Engaging
- Factual
- Educational
- Clear narration

IMPORTANT:

Return ONLY narration.

Do NOT describe visuals.

Do NOT describe camera shots.

Do NOT describe music.

Do NOT write NARRATOR.

Format:

[SCENE_1]
Narration

[SCENE_2]
Narration

[SCENE_3]
Narration

Research:

{state.research}
"""

        state.script = (
            self.gemini.generate(
                prompt
            )
        )

        return state