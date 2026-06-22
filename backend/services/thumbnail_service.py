from services.storage_service import StorageService
from services.image_service import ImageService


class ThumbnailService:

    @staticmethod
    def generate(state):
        thumbnail_dir = StorageService.get_thumbnail_path(state.project_id)
        count = 3 if state.mode == "review" else 1
        thumbnail_paths = []

        for i in range(1, count + 1):
            output_path = thumbnail_dir / f"thumbnail_{i}.png"
            prompt = f"""
Professional YouTube Thumbnail
Topic: {state.topic}
Style variation {i}
Bright colors
High contrast
Eye catching
Professional
Click worthy
No text
"""
            try:
                ImageService.generate_image(prompt=prompt, output_path=output_path)
                thumbnail_paths.append(str(output_path))
            except Exception as e:
                print(f"Thumbnail {i} failed: {e}")

        return thumbnail_paths
