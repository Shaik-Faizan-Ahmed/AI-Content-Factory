from models.project_state import (
    ProjectState
)

from agents.video_agent import (
    VideoAgent
)

state = ProjectState()

state.project_id = (
    "a4125f71-f769-4436-b694-a6f88e8c2ac8"
)

agent = VideoAgent()

state = agent.run(
    state
)

print()

print(
    state.video_path
)