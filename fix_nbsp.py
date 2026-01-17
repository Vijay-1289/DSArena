
path = r'd:\DSArena\DSArena\src\pages\DailyChallenge.tsx'
try:
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    if '\u00A0' in c:
        print("Found NBSP, replacing...")
        c = c.replace('\u00A0', ' ')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print("Replaced.")
    else:
        print("No NBSP found.")
except Exception as e:
    print(e)
