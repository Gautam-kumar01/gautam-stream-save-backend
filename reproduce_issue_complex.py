import pyttsx3
import sounddevice as sd
import time
import numpy as np

print("Initializing pyttsx3...")
engine = pyttsx3.init()
engine.setProperty('rate', 175)

def speak(text):
    print(f"Speaking: {text}")
    engine.say(text)
    engine.runAndWait()

def record_dummy():
    print("Recording dummy audio...")
    duration = 1
    fs = 44100
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()
    print("Recording finished.")

print("Step 1: Speak before recording")
speak("Testing speech before recording.")

print("Step 2: Record audio")
record_dummy()

print("Step 3: Speak after recording")
speak("Testing speech after recording. Can you hear this?")

print("Test complete.")
