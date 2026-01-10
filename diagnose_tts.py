import pyttsx3
import sys

print("Initializing pyttsx3...")
try:
    engine = pyttsx3.init()
    print("pyttsx3 initialized.")
except Exception as e:
    print(f"Failed to initialize pyttsx3: {e}")
    sys.exit(1)

try:
    rate = engine.getProperty('rate')
    print(f"Current rate: {rate}")
    
    voices = engine.getProperty('voices')
    print(f"Available voices: {len(voices)}")
    for voice in voices:
        print(f" - {voice.name} ({voice.id})")

    print("Attempting to speak...")
    engine.say("This is a diagnostic test. Can you hear me?")
    engine.runAndWait()
    print("Speech command executed.")

except Exception as e:
    print(f"Error during speech execution: {e}")
