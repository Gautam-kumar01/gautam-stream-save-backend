from jarvis import speak
import time

print("Testing Jarvis speech loop...")
try:
    print("--- Iteration 1 ---")
    speak("This is the first sentence.")
    time.sleep(1)
    
    print("--- Iteration 2 ---")
    speak("This is the second sentence. If you hear this, the loop fix is working.")
    time.sleep(1)
    
    print("--- Iteration 3 ---")
    speak("This is the third sentence. Testing re-initialization stability.")
    
    print("Loop test complete.")
except Exception as e:
    print(f"Loop test failed: {e}")
