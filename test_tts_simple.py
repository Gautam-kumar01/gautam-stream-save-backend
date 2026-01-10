import pyttsx3

try:
    engine = pyttsx3.init()
    print("TTS Engine initialized.")
    engine.say("Testing text to speech. Can you hear me?")
    engine.runAndWait()
    print("TTS Test complete.")
except Exception as e:
    print(f"TTS Error: {e}")
