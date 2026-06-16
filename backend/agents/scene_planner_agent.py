from models.project_state import (
    ProjectState
)

from services.gemini_service import (
    GeminiService
)

from services.json_service import (
    JsonService
)

from services.scene_plan_validator import (
    ScenePlanValidator
)

from services.project_state_service import (
    ProjectStateService
)

class ScenePlannerAgent:

    def __init__(self):

        self.gemini = (
            GeminiService()
        )

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        prompt = f"""
You are a scene planning expert.

Convert the script into JSON.

For each scene return:

scene_number
duration
narration
visual_description

Rules:

- duration in seconds
- visual_description should describe
  what image should be shown

Return ONLY valid JSON.

Script:

{state.script}
"""

        response = (
            self.gemini.generate(
                prompt
            )
        )

        state.scene_plan = (
            JsonService.parse_json(
                response
            )
        )

        ScenePlanValidator.validate(
            state.scene_plan
        )
        
        ProjectStateService.save_scene_plan(
            state.project_id,
            state.scene_plan
        )
        return state