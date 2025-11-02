#!/usr/bin/env python3
"""
Remove problematic case statements that reference undefined functions
"""

import re

# Read the file
with open(r'd:\sadhanaboard\src\components\ThemedBackground.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Case statements to completely remove (entire blocks):
# - case 'yoga'
# - case 'sunset'
# - case 'night'
# - case 'rainbow'

# These cases have references to undefined functions like:
# drawYogaPose, drawYogaMat, drawYogaLight, drawYogaReflection

# Remove case 'yoga' block
pattern_yoga = r"case 'yoga':\s+particleCount = 100;[\s\S]*?break;\s*\}"
content = re.sub(pattern_yoga, "", content)

# Remove case 'sunset' block  
pattern_sunset = r"case 'sunset':\s+particleCount = 120;[\s\S]*?break;\s*\}"
content = re.sub(pattern_sunset, "", content)

# Remove case 'night' block
pattern_night = r"case 'night':\s+particleCount = 150;[\s\S]*?break;\s*\}"
content = re.sub(pattern_night, "", content)

# Remove case 'rainbow' block (if it exists)
pattern_rainbow = r"case 'rainbow':\s+[\s\S]*?break;\s*\}"
content = re.sub(pattern_rainbow, "", content)

# Clean up multiple consecutive newlines
content = re.sub(r'\n\n\n+', '\n\n', content)

# Write back
with open(r'd:\sadhanaboard\src\components\ThemedBackground.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed syntax errors by removing problematic case statements")
