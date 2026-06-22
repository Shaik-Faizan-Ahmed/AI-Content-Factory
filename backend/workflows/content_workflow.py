from models.project_state import ProjectState
from agents.research_agent import ResearchAgent
from agents.script_agent import ScriptAgent
from agents.scene_planner_agent import ScenePlannerAgent
from agents.image_agent import ImageAgent
from agents.voice_agent import VoiceAgent
from agents.subtitle_agent import SubtitleAgent
from agents.video_agent import VideoAgent
from agents.thumbnail_agent import ThumbnailAgent
from agents.seo_agent import SEOAgent
from agents.publish_agent import PublishAgent
from services.project_status_service import ProjectStatusService
from services.project_full_state_service import ProjectFullStateService
from services.continue_flag_service import ContinueFlagService


class ContentWorkflow:

    def __init__(self):
        self.research_agent = ResearchAgent()
        self.script_agent = ScriptAgent()
        self.scene_planner_agent = ScenePlannerAgent()
        self.image_agent = ImageAgent()
        self.voice_agent = VoiceAgent()
        self.subtitle_agent = SubtitleAgent()
        self.video_agent = VideoAgent()
        self.thumbnail_agent = ThumbnailAgent()
        self.seo_agent = SEOAgent()
        self.publish_agent = PublishAgent()

    def _pause_if_review(self, state: ProjectState, stage: str):
        if state.mode == "review":
            ProjectStatusService.update(
                project_id=state.project_id,
                status="awaiting_review",
                current_step=stage,
                progress=state.progress,
            )
            ProjectFullStateService.save(state)
            ContinueFlagService.wait_for_continue(state.project_id, stage)

    def run(self, state: ProjectState):
        try:
            state = self.research_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "research")

            state = self.script_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "script")

            state = self.scene_planner_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "scene_planning")

            state = self.image_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "image_generation")

            state = self.voice_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "voice_generation")

            state = self.subtitle_agent.run(state)
            ProjectFullStateService.save(state)

            state = self.video_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "video_review")

            state = self.thumbnail_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "thumbnail_generation")

            state = self.seo_agent.run(state)
            ProjectFullStateService.save(state)
            self._pause_if_review(state, "seo_generation")

            ProjectStatusService.update(
                project_id=state.project_id,
                status="awaiting_publish",
                current_step="publishing",
                progress=99,
            )
            ProjectFullStateService.save(state)
            ContinueFlagService.wait_for_continue(state.project_id, "publishing")

            state = self.publish_agent.run(state)
            ProjectStatusService.mark_completed(state.project_id)
            ProjectFullStateService.save(state)

            return state

        except Exception:
            ProjectStatusService.mark_failed(state.project_id)
            raise
