import os
import re

directory = r"h:\Documents\GitHub\vortexgello.github.io"

ga_pattern1 = re.compile(r'<!-- Analytics -->\s*<script async src="https://www.googletagmanager.com/gtag/js\?id=G-QJ8M5F06YR"></script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\) \{\s*dataLayer\.push\(arguments\);\s*\}\s*gtag\(\'js\', new Date\(\)\);\s*gtag\(\'config\', \'G-QJ8M5F06YR\'\);\s*</script>', re.DOTALL)
ga_pattern2 = re.compile(r'<!-- Google tag \(gtag\.js\) -->\s*<script async src="https://www.googletagmanager.com/gtag/js\?id=G-QJ8M5F06YR"></script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\) \{\s*dataLayer\.push\(arguments\);\s*\}\s*gtag\(\'js\', new Date\(\)\);\s*gtag\(\'config\', \'G-QJ8M5F06YR\'\);\s*</script>', re.DOTALL)
ga_pattern3 = re.compile(r'<script async src="https://www.googletagmanager.com/gtag/js\?id=G-QJ8M5F06YR"></script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\) \{\s*dataLayer\.push\(arguments\);\s*\}\s*gtag\(\'js\', new Date\(\)\);\s*gtag\(\'config\', \'G-QJ8M5F06YR\'\);\s*</script>', re.DOTALL)
ga_pattern4 = re.compile(r'<!-- Google tag \(gtag\.js\) -->\s*<script async src="https://www.googletagmanager.com/gtag/js\?id=G-QJ8M5F06YR"></script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\) \{ dataLayer\.push\(arguments\); \}\s*gtag\(\'js\', new Date\(\)\);\s*gtag\(\'config\', \'G-QJ8M5F06YR\'\);\s*</script>', re.DOTALL)
ga_pattern5 = re.compile(r'<script async src="https://www.googletagmanager.com/gtag/js\?id=G-QJ8M5F06YR"></script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\) \{ dataLayer\.push\(arguments\); \}\s*gtag\(\'js\', new Date\(\)\);\s*gtag\(\'config\', \'G-QJ8M5F06YR\'\);\s*</script>', re.DOTALL)


cf_pattern = re.compile(r'<!-- Cloudflare Web Analytics -->\s*<script defer src=\'https://static\.cloudflareinsights\.com/beacon\.min\.js\'\s*data-cf-beacon=\'\{"token": "63decb8a56714b5b828066cbbeb6cc36"\}\'></script>', re.DOTALL)
cf_pattern2 = re.compile(r'<script defer src=\'https://static\.cloudflareinsights\.com/beacon\.min\.js\'\s*data-cf-beacon=\'\{"token": "63decb8a56714b5b828066cbbeb6cc36"\}\'></script>', re.DOTALL)

logging_pattern1 = re.compile(r'<script src="\.\./js/logging\.js"></script>')
logging_pattern2 = re.compile(r'<script src="js/logging\.js"></script>')

canonical_pattern = re.compile(r'<link rel="canonical" href="http://www\.example\.com/">')

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    original = content
    content = ga_pattern1.sub('', content)
    content = ga_pattern2.sub('', content)
    content = ga_pattern3.sub('', content)
    content = ga_pattern4.sub('', content)
    content = ga_pattern5.sub('', content)
    content = cf_pattern.sub('', content)
    content = cf_pattern2.sub('', content)
    content = logging_pattern1.sub('', content)
    content = logging_pattern2.sub('', content)
    content = canonical_pattern.sub('', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".html"):
            filepath = os.path.join(root, filename)
            process_file(filepath)
