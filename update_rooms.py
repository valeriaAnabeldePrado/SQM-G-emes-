
import re

file_path = '/Users/maurolobo/SmartCloud/juarez/SQM-G-emes-/src/components/web-sections/inmersive/build/constant.js'

with open(file_path, 'r') as f:
    content = f.read()

# First, remove any existing 'rooms: X,' lines to start clean or fix previous run
# We match newline, spaces, rooms: X,
content = re.sub(r"\n\s+rooms:\s*\d+,", "", content)

def replacer(match):
    full_match = match.group(0)
    ambientes_line = match.group(1) # The line with 'ambientes'
    # Group 2 is whitespace indentation captured by (\s*)
    ambientes_val = match.group(3)  # The value inside quotes
    
    rooms = 0
    val_lower = ambientes_val.lower()
    
    if '1 ambiente' in val_lower:
        rooms = 1
    elif '2 ambientes' in val_lower:
        rooms = 2
    elif '3 ambientes' in val_lower:
        rooms = 3
    elif 'planta libre' in val_lower or 'planta abierta' in val_lower:
        rooms = 1
    else:
        # Fallback
        rooms = 1

    return f"{ambientes_line}\n        rooms: {rooms},"

# Regex to find 'ambientes: 'Value',' 
# Group 1: The whole line "        ambientes: 'Value',"
# Group 2: Indentation "        "
# Group 3: Value "Value"
pattern = re.compile(r"((\s*)ambientes:\s*'([^']+)',)")

new_content = pattern.sub(replacer, content)

with open(file_path, 'w') as f:
    f.write(new_content)
