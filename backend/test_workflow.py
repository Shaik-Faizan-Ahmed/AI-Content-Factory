from workflows.content_workflow import (
    ContentWorkflow
)

workflow = (
    ContentWorkflow()
)

result = workflow.run(
    "How Black Holes Work"
)

print("\n")
print("=" * 80)
print("SUBTITLES")
print("=" * 80)
print("\n")

print(
    result.subtitle_path
)