import os
import json

from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv("../backend/.env")

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model=genai.GenerativeModel(
    "gemini-2.5-flash"
)

with open(
    "scene_plan.json",
    "r",
    encoding="utf-8"
) as f:
    scenes=json.load(f)

scene=scenes[0]

visual=scene["visual_description"]

video_style="Cinematic"

prompt=f"""
You are an expert prompt engineer.

Convert this visual description into a
high quality AI image prompt.

Video Style:
{video_style}

Visual:
{visual}

Requirements:

- highly detailed
- image generation ready
- no explanation
- single paragraph

Return only the prompt.
"""

response=model.generate_content(
    prompt
)

image_prompt=response.text

print(image_prompt)

with open(
    "image_prompt.txt",
    "w",
    encoding="utf-8"
) as f:
    f.write(image_prompt)