import pyttsx3
import wikipedia
import time

# Initialize global engine like in jarvis.py
engine = pyttsx3.init()

def speak(text):
    print(f"Jarvis: {text}")
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"Error in speech synthesis: {e}")

def test_blackboard():
    speak("Searching for information...")
    try:
        query = "blackboard"
        results = wikipedia.summary(query, sentences=2)
        speak("According to Wikipedia")
        time.sleep(0.5)
        speak(results)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_blackboard()
