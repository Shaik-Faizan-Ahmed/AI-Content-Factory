from services.scene_plan_validator import (
    ScenePlanValidator
)

bad_scene_plan = [

    {
        "scene_number": 1,

        "duration": 30,

        "naration": "wrong field",

        "visual_description":
        "test"
    }
]

ScenePlanValidator.validate(
    bad_scene_plan
)