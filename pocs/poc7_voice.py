from piper import PiperVoice
import wave
from pathlib import Path
import re

# Ensure output directory exists
Path("../outputs/audio").mkdir(
    parents=True, 
    exist_ok=True
)

# -------------------------------------------------------------
# ARCHITECTURAL UPDATE: Helper to strip scene markers & blank lines
# -------------------------------------------------------------
def clean_script(raw_script: str) -> str:
    """
    Removes [SCENE_1], [SCENE_2], etc., along with any extra blank lines
    or trailing spaces left behind, ensuring clean text for the TTS engine.
    """
    # Match the bracketed scene marker and any trailing whitespace/newlines
    cleaned = re.sub(r"\[SCENE_\d+\]\s*", "", raw_script)
    
    # Strip leading/trailing whitespace from the entire document
    return cleaned.strip()


# Read the raw input script containing markers
with open(
    "script.txt", 
    "r", 
    encoding="utf-8"
) as f:
    raw_script = f.read()

# Clean the script so the TTS engine never sees architectural markers
final_script = clean_script(raw_script)

# Load the working Piper voice model
voice = PiperVoice.load(
    "../models/piper/en_US-lessac-medium.onnx"
)

output_path = "../outputs/audio/narration.wav"

# Synthesize the pristine, marker-free text
with wave.open(
    output_path, 
    "wb"
) as wav_file:
    
    voice.synthesize_wav(
        final_script, 
        wav_file
    )

print(
    f"Audio saved: {output_path}"
)