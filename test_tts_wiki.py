import pyttsx3
import wikipedia

def test_tts():
    engine = pyttsx3.init()
    
    # Test simple speech
    print("Testing simple speech...")
    engine.say("This is a test of the speech engine.")
    engine.runAndWait()
    
    # Test wikipedia result
    print("Testing Wikipedia result...")
    try:
        results = wikipedia.summary("black hole", sentences=2)
        print(f"Result: {results}")
        
        print("Speaking result...")
        engine.say(results)
        engine.runAndWait()
        print("Done speaking.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_tts()
