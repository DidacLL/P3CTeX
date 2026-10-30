#!/usr/bin/env python3
from pathlib import Path
import re

site_dir = Path("site")
gen_html = (site_dir / "generator.html").read_text(encoding="utf-8")
site_css = (site_dir / "assets" / "css" / "site.css").read_text(encoding="utf-8")
gen_css = (site_dir / "assets" / "css" / "generator.css").read_text(encoding="utf-8")
site_js = (site_dir / "assets" / "js" / "site.js").read_text(encoding="utf-8")
gen_js = (site_dir / "assets" / "js" / "generator.js").read_text(encoding="utf-8")

combined_css = f"/* Inlined site.css */\n{site_css}\n\n/* Inlined generator.css */\n{gen_css}"
combined_js = f"/* Inlined site.js */\n{site_js}\n\n/* Inlined generator.js */\n{gen_js}"

# Replace stylesheet links with inline style
gen_html = re.sub(r'<link\s+rel=["\']stylesheet["\'][^>]*>', '', gen_html)
# Replace script src with inline script
gen_html = re.sub(r'<script\s+src=["\'][^"\']+["\'][^>]*></script>', '', gen_html)

# Insert inlined style before </head>
gen_html = gen_html.replace("</head>", f"<style>\n{combined_css}\n</style>\n</head>")

# Insert inlined script before </body>
gen_html = gen_html.replace("</body>", f"<script>\n{combined_js}\n</script>\n</body>")

# Replace title
gen_html = gen_html.replace(
    "<title>Interactive Web Generator · P3CTeX Tooling</title>",
    "<title>Standalone Offline LaTeX Generator · P3CTeX Tooling</title>"
)

(site_dir / "standalone-generator.html").write_text(gen_html, encoding="utf-8")
print("standalone-generator.html generated successfully!")
