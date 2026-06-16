class ScenePlanValidator:

    REQUIRED_FIELDS = [

        "scene_number",

        "duration",

        "narration",

        "visual_description"
    ]

    @classmethod
    def validate(
        cls,
        scene_plan: list
    ):

        if not scene_plan:

            raise ValueError(
                "Scene plan is empty."
            )

        for index, scene in enumerate(
            scene_plan,
            start=1
        ):

            if not isinstance(
                scene,
                dict
            ):

                raise ValueError(
                    f"Scene {index} is not a dictionary."
                )

            for field in cls.REQUIRED_FIELDS:

                if field not in scene:

                    # Common LLM typo
                    if (
                        field == "narration"
                        and "naration" in scene
                    ):

                        scene["narration"] = (
                            scene["naration"]
                        )

                        continue

                    raise ValueError(
                        f"Scene {index} missing field: {field}"
                    )

        return True