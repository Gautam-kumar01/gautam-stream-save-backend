import jarvis
import time

print("Testing Jarvis module...")

print("Call 1: Hello")
jarvis.speak("Hello, this is the first test.")

time.sleep(1)

print("Call 2: Wikipedia style")
jarvis.speak("According to Wikipedia, this is the second test to ensure I can speak multiple times.")

print("Done.")
