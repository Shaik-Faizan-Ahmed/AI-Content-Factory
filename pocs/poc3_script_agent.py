import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv("../backend/.env")

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

with open(
    "research.txt",
    "r",
    encoding="utf-8"
) as f:
    research = f.read()

prompt = f"""
You are a professional documentary writer.

Using the research below,
create a 3 minute educational script.

Requirements:

- Engaging
- Factual
- Educational
- Clear narration

IMPORTANT:

IMPORTANT:

Return ONLY narration.

Do NOT describe visuals.

Do NOT describe camera shots.

Do NOT describe music.

Do NOT write NARRATOR.

Use this format:

[SCENE_1]
Narration text

[SCENE_2]
Narration text

Research:

{research}
"""

response = model.generate_content(
    prompt
)

script = response.text

print(script)

with open(
    "script.txt",
    "w",
    encoding="utf-8"
) as f:
    f.write(script)