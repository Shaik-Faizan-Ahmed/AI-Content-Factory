from piper import PiperVoice
import wave
from pathlib import Path

# Ensure output directory exists
Path("../outputs/audio").mkdir(
    parents=True, 
    exist_ok=True
)

# Load the Piper voice model
voice = PiperVoice.load(
    "../models/piper/en_US-lessac-medium.onnx"
)

# Open using the 'wave' module, but DO NOT set headers manually
with wave.open(
    "../outputs/audio/test.wav", 
    "wb"
) as wav_file:
    
    # Piper internally reads your model configs and populates wav_file headers
    voice.synthesize_wav(
        "Hello, this is a Piper voice test.", 
        wav_file
    )

print("Audio generated successfully")
