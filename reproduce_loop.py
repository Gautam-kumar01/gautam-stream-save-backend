import pyttsx3
import sounddevice as sd
import time
import numpy as np

# Initialize pyttsx3 engine
print("Initializing pyttsx3...")
engine = pyttsx3.init()
engine.setProperty('rate', 175)

def speak(text):
    print(f"Speaking: {text}")
    try:
        if engine._inLoop:
            engine.endLoop()
        engine.stop()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in speech synthesis: {e}")

def record_audio(duration=3, fs=44100):
    print("Listening (simulated)...")
    try:
        # Simulate recording
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()  # Wait until recording is finished
        print("Recording finished.")
        return recording
    except Exception as e:
        print(f"Error recording audio: {e}")
        return None

def main():
    print("--- Starting Loop Test ---")
    speak("Hello Gautam, I am Jarvis. This is the intro.")
    
    # Simulate one loop iteration
    print("\n--- Iteration 1 ---")
    record_audio(duration=2)
    speak("This is the reply for iteration 1.")
    
    # Simulate another loop iteration
    print("\n--- Iteration 2 ---")
    record_audio(duration=2)
    speak("This is the reply for iteration 2.")
    
    print("\n--- Test Complete ---")

if __name__ == "__main__":
    main()
