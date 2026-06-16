from models.project_state import (
    ProjectState
)

from agents.research_agent import (
    ResearchAgent
)

from agents.script_agent import (
    ScriptAgent
)
from agents.scene_planner_agent import (
    ScenePlannerAgent
)
from agents.image_agent import (
    ImageAgent
)

from agents.voice_agent import (
    VoiceAgent
)

from agents.subtitle_agent import (
    SubtitleAgent
)

from agents.video_agent import (
    VideoAgent
)

class ContentWorkflow:

    def __init__(self):

        self.research_agent = (
            ResearchAgent()
        )

        self.script_agent = (
            ScriptAgent()
        )
        
        self.scene_planner_agent = (
            ScenePlannerAgent()
        )
        self.image_agent = (
            ImageAgent()
        )

        self.voice_agent = (
            VoiceAgent()
        )

        self.subtitle_agent = (
            SubtitleAgent()
        )

        self.video_agent = (
            VideoAgent()
        )

    def run(
        self,
        topic: str
    ):

        state = ProjectState(
            topic=topic
        )

        state = (
            self.research_agent.run(
                state
            )
        )

        state = (
            self.script_agent.run(
                state
            )
        )

        state = (
            self.scene_planner_agent.run(
                state
            )
        )
        
        state = (
            self.image_agent.run(
                state
            )
        )
        
        state = (
            self.voice_agent.run(
                state
            )
        )
        
        state = (
            self.subtitle_agent.run(
                state
            )
        )
        
        state = (
            self.video_agent.run(
                state
            )
        )

        return state