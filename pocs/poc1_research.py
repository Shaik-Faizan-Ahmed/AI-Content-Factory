import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv("../backend/.env")

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model=genai.GenerativeModel("gemini-2.5-flash")

topic=input("Topic: ")

prompt=f"""
You are a research analyst.

Research this topic:

{topic}

Return:

1. Key concepts
2. Important facts
3. Timeline if applicable
4. Sources to investigate

Be factual.
"""

response=model.generate_content(prompt)

print("\n")
print(response.text)
research=response.text

with open("research.txt","w",encoding="utf-8") as f:
    f.write(research)