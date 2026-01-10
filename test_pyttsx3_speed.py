import pyttsx3

try:
    engine = pyttsx3.init()
    rate = engine.getProperty('rate')
    print(f"Current rate: {rate}")
    
    # Test speaking
    engine.say("Testing speech rate.")
    engine.runAndWait()
    
    # Test changing rate
    new_rate = 175
    print(f"Setting rate to {new_rate}")
    engine.setProperty('rate', new_rate)
    engine.say("This is a medium speaking rate.")
    engine.runAndWait()
    
    print("pyttsx3 test completed successfully.")
except Exception as e:
    print(f"Error with pyttsx3: {e}")
