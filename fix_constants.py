
import re
path = '/Users/maurolobo/SmartCloud/juarez/SQM-G-emes-/src/components/web-sections/inmersive/build/constant.js'
with open(path, 'r') as f:
    text = f.read()

# Fix incorrect rooms values
# 2 ambientes -> rooms: 2
text = text.replace("ambientes: '2 ambientes',\n        rooms: 1,", "ambientes: '2 ambientes',\n        rooms: 2,")
# 3 ambientes -> rooms: 3
text = text.replace("ambientes: '3 ambientes',\n        rooms: 1,", "ambientes: '3 ambientes',\n        rooms: 3,")
# Duplex 2 ambientes -> rooms: 2
text = text.replace("ambientes: '2 ambientes (Duplex)',\n        rooms: 1,", "ambientes: '2 ambientes (Duplex)',\n        rooms: 2,")
# Duplex 3 ambientes -> rooms: 3
text = text.replace("ambientes: '3 ambientes (Duplex)',\n        rooms: 1,", "ambientes: '3 ambientes (Duplex)',\n        rooms: 3,")
# Duplex Piso Alto 2 ambientes -> rooms: 2
text = text.replace("ambientes: '2 ambientes (Duplex - Piso Alto)',\n        rooms: 1,", "ambientes: '2 ambientes (Duplex - Piso Alto)',\n        rooms: 2,")

with open(path, 'w') as f:
    f.write(text)
print("Fixed rooms values in constant.js")
