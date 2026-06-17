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

from services.project_status_service import (
    ProjectStatusService
)

from agents.thumbnail_agent import (
    ThumbnailAgent
)

from agents.seo_agent import (
    SEOAgent
)

from agents.publish_agent import (
    PublishAgent
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

        self.thumbnail_agent = (
            ThumbnailAgent()
        )

        self.seo_agent = (
            SEOAgent()
        )
        
        self.publish_agent = (
            PublishAgent()
        )

    def run(
        self,
        state: ProjectState
    ):

        try:

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

            ProjectStatusService.mark_completed(
                state.project_id
            )

            state = (
                self.thumbnail_agent.run(
                    state
                )
            )  

            state = (
                self.seo_agent.run(
                    state
                )   
            )

            state = (
                self.publish_agent.run(
                    state
                )
            ) 
            
            return state

        except Exception:

            ProjectStatusService.mark_failed(
                state.project_id
            )

            raise