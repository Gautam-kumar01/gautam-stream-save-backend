import pyttsx3

engine = pyttsx3.init()
voices = engine.getProperty('voices')

print(f"Found {len(voices)} voices.")
for index, voice in enumerate(voices):
    print(f"Voice {index}: {voice.name} - {voice.id}")
    engine.setProperty('voice', voice.id)
    engine.say(f"This is voice {index}.")
    engine.runAndWait()
