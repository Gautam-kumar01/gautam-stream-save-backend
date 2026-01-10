import pyttsx3
import sounddevice as sd
import numpy as np
import time

def test_conflict():
    print("Initializing TTS...")
    engine = pyttsx3.init()
    
    print("Speaking before recording...")
    engine.say("I am speaking before recording.")
    engine.runAndWait()
    
    print("Recording for 2 seconds...")
    fs = 44100
    duration = 2
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()
    print("Recording done.")
    
    print("Speaking after recording...")
    engine.say("I am speaking after recording. Can you hear me?")
    engine.runAndWait()
    print("Done.")

if __name__ == "__main__":
    test_conflict()
