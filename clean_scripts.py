import os
import glob
import re

directory = r"h:\Documents\GitHub\vortexgello.github.io"
html_files = glob.glob(os.path.join(directory, "**", "*.html"), recursive=True)

patterns_to_remove = [
    # Remove Cloudflare Web Analytics comments
    r'<!--\s*Cloudflare Web Analytics\s*-->\n?',
    r'<!--\s*End Cloudflare Web Analytics\s*-->\n?',
    # The beacon script (handling potential line breaks inside the tag)
    r'<script\s+defer\s+src=[\'"]https://static\.cloudflareinsights\.com/beacon\.min\.js[\'"][^>]*>\s*</script>\n?',
    # The logging script (handling potential relative paths)
    r'<script\s+src=[\'"](?:\.\./)*js/logging\.js[\'"]>\s*</script>\n?',
    # The canonical link
    r'<link rel="canonical" href="http://www\.example\.com/">\n?'
]

modified_count = 0

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Could not read {file_path}: {e}")
        continue
        
    new_content = content
    for pattern in patterns_to_remove:
        new_content = re.sub(pattern, '', new_content, flags=re.IGNORECASE)
        
    if new_content != content:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            modified_count += 1
            print(f"Cleaned {file_path}")
        except Exception as e:
            print(f"Could not write {file_path}: {e}")

print(f"\nSuccessfully modified {modified_count} files.")
