from models.project_state import (
    ProjectState
)

from services.gemini_service import (
    GeminiService
)

from services.project_status_service import (
    ProjectStatusService
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

        ProjectStatusService.update(
            project_id=state.project_id,
            status="writing_script",
            current_step="script",
            progress=20
        )

        duration_rules = {

            30: (
                "Maximum 80 words.\n"
                "Exactly 3 scenes."
            ),

            60: (
                "Maximum 150 words.\n"
                "Exactly 5 scenes."
            ),

            90: (
                "Maximum 220 words.\n"
                "Exactly 7 scenes."
            ),

            180: (
                "Maximum 450 words.\n"
                "Exactly 10 scenes."
            ),

            300: (
                "Maximum 700 words.\n"
                "Exactly 15 scenes."
            ),

            600: (
                "Maximum 1400 words.\n"
                "Exactly 20 scenes."
            )
        }

        style_rules = {

            "educational":
            """
Educational tone.

Explain concepts clearly.

Use simple language.

Focus on teaching.
""",

            "documentary":
            """
Cinematic documentary narration.

Professional tone.

Fact driven.

Slightly dramatic.
""",

            "storytelling":
            """
Narrative storytelling style.

Create curiosity.

Use engaging storytelling.
""",

            "news":
            """
News anchor style.

Professional reporting tone.

Present information clearly.
""",

            "product_ad":
            """
Marketing style.

Highlight benefits.

Include persuasive language.

Strong call to action.
""",

            "podcast_clip":
            """
Conversational tone.

Natural speaking style.

Podcast-like delivery.
"""
        }

        duration_instruction = (
            duration_rules.get(
                state.duration,
                duration_rules[60]
            )
        )

        style_instruction = (
            style_rules.get(
                state.video_type.lower(),
                style_rules["educational"]
            )
        )

        prompt = f"""
You are a professional script writer.

Language:
{state.language}

Video Type:
{state.video_type}

Requirements:

{style_instruction}

{duration_instruction}

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

Continue until all scenes are completed.

Research:

{state.research}
"""

        state.script = (
            self.gemini.generate(
                prompt
            )
        )

        return state