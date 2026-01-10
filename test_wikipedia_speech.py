import pyttsx3
import wikipedia

print("Initializing pyttsx3...")
engine = pyttsx3.init()
engine.setProperty('rate', 175)

def speak(text):
    print(f"Speaking: {text}")
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error speaking: {e}")

try:
    print("Fetching wikipedia summary for 'Python'...")
    # Simulate the exact call from jarvis.py
    results = wikipedia.summary("Python programming language", sentences=2)
    
    print("Speaking 'According to Wikipedia'...")
    speak("According to Wikipedia")
    
    print(f"Speaking results: {results}")
    speak(results)
    
    print("Test complete.")
except Exception as e:
    print(f"Error: {e}")
