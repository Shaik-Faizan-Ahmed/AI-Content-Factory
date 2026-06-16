import json
import requests
from urllib.parse import quote

with open(
    "scene_plan.json",
    "r",
    encoding="utf-8"
) as f:
    scenes = json.load(f)

scene = scenes[0]

visual = scene["visual_description"]

prompt = f"""
Cinematic sports documentary.

{visual}

Highly detailed.
Professional photography.
Ultra realistic.
4k.
"""

encoded_prompt = quote(prompt)

url = f"https://image.pollinations.ai/prompt/{encoded_prompt}"

response = requests.get(url)

with open(
    "scene_1.png",
    "wb"
) as f:
    f.write(response.content)

print("Image saved as scene_1.png") 