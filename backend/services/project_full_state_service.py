import json
from pathlib import Path
from services.storage_service import StorageService
from services.project_registry_service import ProjectRegistryService


class ProjectFullStateService:

    @staticmethod
    def save(state):
        project_dir = StorageService.get_project_path(state.project_id)
        path = project_dir / "state.json"
        registry_entry = ProjectRegistryService.get_project(state.project_id) or {}
        data = {
            "project_id":      state.project_id,
            "topic":           state.topic,
            "video_type":      state.video_type,
            "duration":        state.duration,
            "voice":           state.voice,
            "style":           state.style,
            "language":        state.language,
            "mode":            state.mode,
            "status":          registry_entry.get("status", state.status),
            "current_step":    registry_entry.get("current_step", state.current_step),
            "progress":        registry_entry.get("progress", state.progress),
            "research":        state.research,
            "script":          state.script,
            "scene_plan":      state.scene_plan,
            "image_paths":     state.image_paths,
            "audio_path":      state.audio_path,
            "subtitle_path":   state.subtitle_path,
            "video_path":      state.video_path,
            "thumbnail_paths": state.thumbnail_paths,
            "seo_data":        state.seo_data,
            "publish_data":    state.publish_data,
        }
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    @staticmethod
    def load(project_id: str):
        project_dir = StorageService.get_project_path(project_id)
        path = project_dir / "state.json"
        if not path.exists():
            return None
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        registry_entry = ProjectRegistryService.get_project(project_id) or {}
        data["status"] = registry_entry.get("status", data.get("status", "queued"))
        data["current_step"] = registry_entry.get("current_step", data.get("current_step", "queued"))
        data["progress"] = registry_entry.get("progress", data.get("progress", 0))
        return data
