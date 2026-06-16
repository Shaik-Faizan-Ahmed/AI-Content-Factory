import wave

from piper import PiperVoice

from models.project_state import (
    ProjectState
)

from services.storage_service import (
    StorageService
)

from services.script_cleaner import (
    ScriptCleaner
)


class VoiceAgent:

    def __init__(self):

        self.voice = (
            PiperVoice.load(
                "../models/piper/en_US-lessac-medium.onnx"
            )
        )

    def run(
        self,
        state: ProjectState
    ) -> ProjectState:

        cleaned_script = (
            ScriptCleaner.clean(
                state.script
            )
        )

        audio_dir = (
            StorageService
            .get_audio_path(
                state.project_id
            )
        )

        output_path = (
            audio_dir
            /
            "narration.wav"
        )

        with wave.open(
            str(output_path),
            "wb"
        ) as wav_file:

            self.voice.synthesize_wav(
                cleaned_script,
                wav_file
            )

        state.audio_path = (
            str(output_path)
        )

        print(
            f"Audio saved: {output_path}"
        )

        return state