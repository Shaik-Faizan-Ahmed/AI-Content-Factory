from services.script_cleaner import (
    ScriptCleaner
)

sample = """
[SCENE_1]
Hello world

[SCENE_2]
This is scene two
"""

print(
    ScriptCleaner.clean(
        sample
    )
)