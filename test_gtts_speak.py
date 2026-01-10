import jarvis
import time

print("Testing gTTS speak function...")
try:
    jarvis.speak("Hello, I am using Google Text to Speech now.")
    print("First message sent.")
    time.sleep(1)
    jarvis.speak("This voice should be much clearer.")
    print("Second message sent.")
except Exception as e:
    print(f"FAILED: {e}")
