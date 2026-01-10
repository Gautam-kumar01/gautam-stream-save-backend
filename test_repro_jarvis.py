import speech_recognition as sr
import pyttsx3
import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import os
import time

# Global engine, just like jarvis.py
engine = pyttsx3.init()

def speak(text):
    print(f"Jarvis: {text}")
    try:
        if engine._inLoop:
            engine.endLoop()
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in speech synthesis: {e}")

def record_audio(duration=3, fs=44100):
    print("Listening (Simulated)...")
    try:
        recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()
        return recording, fs
    except Exception as e:
        print(f"Error recording audio: {e}")
        return None, fs

def main():
    print("--- Starting Repro Test ---")
    speak("Hello, I am Jarvis. This is the first message.")
    
    print("Simulating listening phase...")
    record_audio(duration=2)
    
    print("Attempting second message...")
    speak("This is the second message. If you hear this, the loop is working.")
    
    print("Simulating listening phase 2...")
    record_audio(duration=2)
    
    print("Attempting third message...")
    speak("This is the third message.")

if __name__ == "__main__":
    main()
