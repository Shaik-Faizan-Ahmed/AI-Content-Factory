import os
import json

from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv("../backend/.env")

# Configure Gemini API
genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

# Initialize the model
model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

# Read the input script
with open(
    "script.txt",
    "r",
    encoding="utf-8"
) as f:
    script = f.read()

# Construct the prompt
prompt = f"""
You are a scene planning expert.

Convert the script into JSON.

For each scene return:

scene_number
duration
narration
visual_description

Rules:

- duration in seconds
- visual_description should describe
  what image should be shown

Return ONLY valid JSON.

Script:

{script}
"""

def clean_json_response(text):
    text = text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "", 1)

    if text.endswith("```"):
        text = text[:-3]

    return text.strip()

# Generate the content from Gemini
response = model.generate_content(
    prompt
)

# ARCHITECTURAL UPDATE: Convert raw text directly into a machine-readable Python object
try:
    scene_data = json.loads(
        clean_json_response(
            response.text
        )
    )
except json.JSONDecodeError as e:
    print("Invalid JSON returned by Gemini")
    print(response.text)
    raise e

# Print the structured data to the console
print(json.dumps(scene_data, indent=4))

# ARCHITECTURAL UPDATE: Save the Python object directly as formatted, valid JSON
with open(
    "scene_plan.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        scene_data, 
        f, 
        indent=4, 
        ensure_ascii=False
    )