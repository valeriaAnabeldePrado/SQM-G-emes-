
import re

file_path = '/Users/maurolobo/SmartCloud/juarez/SQM-G-emes-/src/components/web-sections/inmersive/build/constant.js'

with open(file_path, 'r') as f:
    content = f.read()

# Function to determine rooms based on tipologia
def get_rooms(tipologia):
    tipologia = tipologia.lower()
    if '2 dormitorio' in tipologia:
        return 2
    if '1 dormitorio' in tipologia:
        return 1
    # Lofts, Studios, Oficinas, Locales -> 0 (or simply not 1 or 2)
    return 0

# We need to replace the 'rooms: X,' line for each unit. 
# Or inject it if missing (but we know it's there from previous step).

# Strategy: Find the full block of a unit or line-by-line?
# The file structure is consistent:
# ...
# tipologia: '...',
# ambientes: '...',
# rooms: X,
# ...

# We can look for tipologia line, then capture subsequent lines until we find (or insert) rooms.
# However, purely regexing 'tipologia' and then finding 'rooms' might be modifying far away lines if not careful.
# But 'rooms' is right after 'ambientes' now because I put it there. And 'ambientes' is right after 'tipologia'.

# Let's iterate over matches of the whole unit block structure roughly.
# Better yet, I can match:
# (tipologia: '([^']+)',\s*ambientes: '[^']+',\s*rooms: )(\d+)

# Pattern explanation:
# 1. tipologia: 'Value'
# 2. whitespace/newlines
# 3. ambientes: 'Value'
# 4. whitespace/newlines
# 5. rooms: 
# 6. Value (digit)

pattern = re.compile(r"(tipologia:\s*'([^']+)',\s*ambientes:\s*'[^']+',\s*rooms:\s*)(\d+)", re.MULTILINE | re.DOTALL)

def replacer(match):
    prefix = match.group(1) # tipologia ... rooms: 
    tipologia_val = match.group(2)
    old_rooms = match.group(3)
    
    new_rooms = get_rooms(tipologia_val)
    
    # If it's an office or loft, new_rooms is 0. 
    # If we want to keep it as valid number even if 0.
    
    return f"{prefix}{new_rooms}"

new_content = pattern.sub(replacer, content)

with open(file_path, 'w') as f:
    f.write(new_content)
