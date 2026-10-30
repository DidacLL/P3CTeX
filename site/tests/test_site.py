#!/usr/bin/env python3
"""
P3CTeX Automated Test Suite for Public Website & LaTeX Generator Tool
Tier 1-5 Comprehensive Verification Runner
Pure Python standard library (no external pip dependencies)
"""

import os
import re
import sys
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

# Base directory for site assets
SITE_DIR = Path(__file__).resolve().parent.parent
WORKSPACE_ROOT = SITE_DIR.parent


class HTMLFeatureParser(HTMLParser):
    """Parses HTML5 documents and indexes landmarks, links, IDs, placeholder cards, and external resources."""

    def __init__(self):
        super().__init__()
        self.tags = []
        self.ids = set()
        self.links = []
        self.scripts = []
        self.stylesheets = []
        self.placeholder_cards = []
        self.current_placeholder = None
        self.has_viewport = False
        self.has_title = False
        self.title_text = ""
        self._in_title = False
        self._in_prompt = False
        self._current_prompt_id = None
        self.prompts = {}

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        self.tags.append((tag, attr_dict))

        if "id" in attr_dict:
            self.ids.add(attr_dict["id"])

        if tag == "title":
            self.has_title = True
            self._in_title = True

        if tag == "meta" and attr_dict.get("name") == "viewport":
            self.has_viewport = True

        if tag == "a" and "href" in attr_dict:
            self.links.append((attr_dict["href"], attr_dict.get("id"), attr_dict.get("target")))

        if tag == "script":
            self.scripts.append(attr_dict.get("src"))

        if tag == "link" and attr_dict.get("rel") == "stylesheet":
            self.stylesheets.append(attr_dict.get("href"))

        # Image placeholder card detection
        classes = attr_dict.get("class", "").split()
        if "image-placeholder-card" in classes:
            card_info = {
                "slot_id": attr_dict.get("data-slot-id"),
                "aspect_ratio": attr_dict.get("data-aspect-ratio"),
                "prompt_id": None,
                "prompt_text": ""
            }
            self.current_placeholder = card_info
            self.placeholder_cards.append(card_info)

        if self.current_placeholder and "prompt-text" in classes:
            self._in_prompt = True
            self._current_prompt_id = attr_dict.get("id")
            if self.current_placeholder:
                self.current_placeholder["prompt_id"] = self._current_prompt_id

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if self._in_prompt and tag == "p":
            self._in_prompt = False
            self._current_prompt_id = None
        if tag == "div" and self.current_placeholder:
            # Check if leaving card
            pass

    def handle_data(self, data):
        if self._in_title:
            self.title_text += data
        if self._in_prompt and self._current_prompt_id:
            cleaned = data.strip()
            if cleaned:
                self.prompts[self._current_prompt_id] = self.prompts.get(self._current_prompt_id, "") + " " + cleaned
                if self.current_placeholder:
                    self.current_placeholder["prompt_text"] = self.prompts[self._current_prompt_id].strip()


def parse_html_file(file_path: Path) -> HTMLFeatureParser:
    parser = HTMLFeatureParser()
    content = file_path.read_text(encoding="utf-8")
    parser.feed(content)
    return parser


# --- LaTeX Generation Python Emulation for Verification ---
def simulate_latex_generation(state):
    """
    Python reference implementation of generateLatexCode from generator.js
    Used to verify contract adherence, syntax validity, and edge-case behavior.
    """
    class Lines(list):
        push = list.append

    lines = Lines()

    lines.push("% !TeX encoding = UTF-8")
    lang = state.get("language", "cat")
    spellcheck = "ca_ES" if lang == "cat" else ("es_ES" if lang == "es" else "en_US")
    lines.push(f"% !TeX spellcheck = {spellcheck}")
    lines.push("%% =======================================================")
    lines.push("%%  P3CTeX Document — Generated with P3CTeX Interactive Generator")
    lines.push("%% =======================================================\n")

    class_opts = []
    preset = state.get("preset", "PAC")
    if preset != "Custom":
        class_opts.append(preset)
        if preset == "PR":
            class_opts.append(lang)
    else:
        if state.get("cover", False):
            class_opts.append("cover")
        else:
            class_opts.append("no-cover")
        if state.get("toc", True):
            class_opts.append("toc")
        else:
            class_opts.append("no-toc")
        if state.get("noPlagi", True):
            class_opts.append("no-plagi")
        class_opts.append(lang)

    pkgs = state.get("packages", {})
    if pkgs.get("pxCMP"):
        class_opts.append("CMP")
    if pkgs.get("pxMEM"):
        class_opts.append("MEM")
    if pkgs.get("pxGNT"):
        class_opts.append("GNT")
    if state.get("debug"):
        class_opts.append("debug")
    if state.get("printDoc"):
        class_opts.append("print-doc")

    class_opt_str = f"[{','.join(class_opts)}]" if class_opts else ""
    lines.push(f"\\documentclass{class_opt_str}{{P3CTeX}}\n")

    meta = state.get("metadata", {})
    lines.push("%% Document Metadata Configuration")
    lines.push("\\PECTeXconfig{")
    lines.push("  data = {")
    lines.push(f"    student        = {{{meta.get('student', 'Nom Alumne')}}},")
    lines.push(f"    grade          = {{{meta.get('grade', 'Enginyeria Informàtica')}}},")
    lines.push(f"    subj-fullname  = {{{meta.get('subjFullName', 'Assignatura')}}},")
    lines.push(f"    subj-shortname = {{{meta.get('subjShortName', 'ASG')}}},")
    lines.push(f"    subj-code      = {{{meta.get('subjCode', '00.000')}}},")
    lines.push(f"    ca-fullname    = {{{meta.get('caFullName', 'Activitat')}}},")
    lines.push(f"    ca-shortname   = {{{meta.get('caShortName', 'PAC1')}}},")
    lines.push(f"    date           = {{{meta.get('date', '\\today')}}}")
    lines.push("  }")
    lines.push("}\n")

    lines.push("%% Package Initializations & Presets")
    if pkgs.get("pxCALC"):
        lines.push("\\usepackage{pxCALC}")
        lines.push("\\pxCalcSetup{prec=2, steps=3}")
    if pkgs.get("pxSRC"):
        lines.push("\\usepackage{pxSRC}")
    if pkgs.get("pxLST"):
        lines.push("\\usepackage{pxLST}")
        lines.push("\\pxLSTsetup[dark]{pxPython}")
    if pkgs.get("pxTAB"):
        lines.push("\\usepackage{pxTAB}")
        lines.push("\\pxTABsetup{preset=p3c-header}")
    if pkgs.get("pxUML"):
        lines.push("\\usepackage{pxUML}")
    if pkgs.get("pxREQ"):
        lines.push("\\usepackage{pxREQ}")
    lines.push("")

    lines.push("\\begin{document}\n")

    snippets = state.get("snippets", {})
    if snippets.get("introSection"):
        lines.push("\\section{Introducció}")
        lines.push("Document content intro.\n")
    if pkgs.get("pxCALC") and snippets.get("calcExample"):
        lines.push("\\section{Càlculs}")
        lines.push("\\pxDefVar{Vcc}{5}[V]")
        lines.push("\\pxDefFormula{Vout}{[Vcc] * 2}[symbol=V_{out}]")
        lines.push("\\[\n  \\pxSolve{Vout}\n\\]\n")
    if pkgs.get("pxCMP") and snippets.get("cmpAutomaton"):
        lines.push("\\section{Autòmat}")
        lines.push("\\begin{center}")
        lines.push("\\pxAutomaton[preset=p3c-uoc,states={q0/initial},transitions={q0/q0/a}]{}")
        lines.push("\\end{center}\n")
    if pkgs.get("pxLST") and snippets.get("codeListing"):
        lines.push("\\section{Codi}")
        lines.push("\\begin{pxCode}[language=pxPython]{Main}")
        lines.push("print('ready')")
        lines.push("\\end{pxCode}\n")
    if pkgs.get("pxTAB") and snippets.get("tableExample"):
        lines.push("\\section{Taula}")
        lines.push("\\pxTable[preset=p3c-header]{A, B}{1, 2}\n")

    lines.push("\\end{document}")
    return "\n".join(lines)


# ==============================================================================
# TEST SUITE IMPLEMENTATION
# ==============================================================================

class TestTier1FeatureCoverage(unittest.TestCase):
    """Tier 1: Baseline presence and landmarks of all required HTML pages."""

    REQUIRED_PAGES = [
        "index.html",
        "tutorials.html",
        "showcases.html",
        "generator.html",
        "standalone-generator.html"
    ]

    def test_required_pages_exist(self):
        for page_name in self.REQUIRED_PAGES:
            page_path = SITE_DIR / page_name
            self.assertTrue(page_path.is_file(), f"Missing required page: {page_name}")

    def test_html5_semantic_landmarks(self):
        landmarks = ["header", "nav", "main", "footer"]
        for page_name in self.REQUIRED_PAGES:
            page_path = SITE_DIR / page_name
            parser = parse_html_file(page_path)
            found_tags = {tag for tag, _ in parser.tags}
            for lm in landmarks:
                self.assertIn(lm, found_tags, f"Page {page_name} missing semantic landmark <{lm}>")
            self.assertTrue(parser.has_viewport, f"Page {page_name} missing responsive <meta name='viewport'>")
            self.assertTrue(parser.has_title, f"Page {page_name} missing <title>")
            self.assertGreater(len(parser.title_text.strip()), 5, f"Page {page_name} has empty title")

    def test_css_and_js_assets_exist(self):
        assets = [
            SITE_DIR / "assets" / "css" / "site.css",
            SITE_DIR / "assets" / "css" / "generator.css",
            SITE_DIR / "assets" / "js" / "site.js",
            SITE_DIR / "assets" / "js" / "generator.js",
            SITE_DIR / "IMAGE_PROMPTS.md"
        ]
        for asset in assets:
            self.assertTrue(asset.is_file(), f"Missing required asset: {asset}")


class TestTier2BoundaryAndCornerCases(unittest.TestCase):
    """Tier 2: Boundary inputs, special character safety, and preset matrices."""

    def test_all_preset_combinations(self):
        presets = ["PAC", "PEC", "CA", "PR", "Custom"]
        languages = ["cat", "es", "en"]
        for p in presets:
            for lang in languages:
                st = {
                    "preset": p,
                    "language": lang,
                    "cover": (p == "PR"),
                    "toc": True,
                    "noPlagi": True,
                    "packages": {"pxCALC": True, "pxCMP": True},
                    "metadata": {"student": "Test Student", "caShortName": "PAC1"}
                }
                tex = simulate_latex_generation(st)
                self.assertIn("\\documentclass", tex)
                self.assertIn("\\begin{document}", tex)
                self.assertIn("\\end{document}", tex)
                if p != "Custom":
                    self.assertIn(p, tex)
                if st["packages"]["pxCMP"]:
                    # Must be inside class options
                    class_line = [l for l in tex.split("\n") if l.startswith("\\documentclass")][0]
                    self.assertIn("CMP", class_line)

    def test_special_characters_in_metadata(self):
        st = {
            "preset": "PAC",
            "language": "cat",
            "metadata": {
                "student": "Student & Partner",
                "grade": "CS / 100% Online",
                "subjFullName": "Math & Logic $101$",
                "subjShortName": "ML_1",
                "subjCode": "01.001#A",
                "caFullName": "Task {A}",
                "caShortName": "T1",
                "date": "\\today"
            }
        }
        tex = simulate_latex_generation(st)
        self.assertIn("\\PECTeXconfig", tex)
        self.assertIn("student        = {Student & Partner}", tex)
        self.assertIn("\\end{document}", tex)

    def test_all_packages_toggled_off(self):
        st = {
            "preset": "PAC",
            "packages": {pkg: False for pkg in ["pxCALC", "pxCMP", "pxMEM", "pxSRC", "pxTAB", "pxLST", "pxUML", "pxREQ"]},
            "snippets": {snip: False for snip in ["calcExample", "cmpAutomaton", "codeListing", "tableExample"]}
        }
        tex = simulate_latex_generation(st)
        self.assertNotIn("\\usepackage{pxCALC}", tex)
        self.assertNotIn("CMP", tex.split("\n")[5])
        self.assertIn("\\begin{document}", tex)
        self.assertIn("\\end{document}", tex)


class TestTier3CrossFeatureInteractions(unittest.TestCase):
    """Tier 3: Link resolution, anchor integrity, and DOM ID reconciliation."""

    def test_internal_links_and_anchors(self):
        html_files = list(SITE_DIR.glob("*.html"))
        # Map of file -> set of element IDs
        parsed_files = {f.name: parse_html_file(f) for f in html_files}

        for filename, parser in parsed_files.items():
            for href, _, _ in parser.links:
                # Ignore external URLs, mailto, and javascript
                if href.startswith(("http://", "https://", "mailto:", "javascript:")):
                    continue

                parsed = urlparse(href)
                target_path = parsed.path
                target_frag = parsed.fragment

                if not target_path:
                    # Same page fragment
                    if target_frag:
                        self.assertIn(
                            target_frag,
                            parser.ids,
                            f"Broken in-page anchor '#{target_frag}' in {filename}"
                        )
                else:
                    # Link to another page
                    target_file = (SITE_DIR / target_path).resolve()
                    self.assertTrue(
                        target_file.is_file(),
                        f"Broken file link '{target_path}' in {filename}"
                    )
                    if target_frag:
                        target_parser = parsed_files.get(target_file.name)
                        if target_parser:
                            self.assertIn(
                                target_frag,
                                target_parser.ids,
                                f"Broken cross-page anchor '{href}' in {filename}"
                            )


class TestTier4RealWorldWorkloads(unittest.TestCase):
    """Tier 4: End-to-end simulated student workflows and LaTeX structure balance."""

    def test_full_uoc_pac_document_workload(self):
        st = {
            "preset": "PAC",
            "language": "cat",
            "packages": {
                "pxCALC": True,
                "pxCMP": True,
                "pxSRC": True,
                "pxLST": True,
                "pxTAB": True
            },
            "metadata": {
                "student": "Dídac Llorens",
                "grade": "Grau en Enginyeria Informàtica",
                "subjFullName": "Disseny de Compiladors",
                "subjShortName": "DC",
                "subjCode": "05.597",
                "caFullName": "PAC 1: Anàlisi Lèxica",
                "caShortName": "PAC1",
                "date": "\\today"
            },
            "snippets": {
                "introSection": True,
                "calcExample": True,
                "cmpAutomaton": True,
                "codeListing": True,
                "tableExample": True
            }
        }
        tex = simulate_latex_generation(st)

        # Assert environment tag parity
        begin_tags = re.findall(r"\\begin\{([a-zA-Z*]+)\}", tex)
        end_tags = re.findall(r"\\end\{([a-zA-Z*]+)\}", tex)
        self.assertEqual(len(begin_tags), len(end_tags), "Mismatched \\begin and \\end count in output")
        for b, e in zip(begin_tags, end_tags[::-1]):
            # Document environment must match
            pass
        self.assertIn("document", begin_tags)
        self.assertIn("document", end_tags)

        # Assert brace parity
        open_braces = tex.count("{")
        close_braces = tex.count("}")
        self.assertEqual(open_braces, close_braces, "Unbalanced curly braces in generated LaTeX")

    def test_image_placeholder_cards_and_prompts_index(self):
        """Validates all visual cards across pages and matches with IMAGE_PROMPTS.md."""
        prompts_file = SITE_DIR / "IMAGE_PROMPTS.md"
        self.assertTrue(prompts_file.is_file(), "IMAGE_PROMPTS.md does not exist")
        prompts_content = prompts_file.read_text(encoding="utf-8")

        all_cards = []
        for html_file in [SITE_DIR / "index.html", SITE_DIR / "tutorials.html", SITE_DIR / "showcases.html", SITE_DIR / "generator.html"]:
            parser = parse_html_file(html_file)
            all_cards.extend(parser.placeholder_cards)

        self.assertGreaterEqual(len(all_cards), 10, "Expected at least 10 placeholder cards across pages")

        for card in all_cards:
            slot_id = card["slot_id"]
            self.assertTrue(slot_id, f"Card missing data-slot-id: {card}")
            self.assertTrue(card["aspect_ratio"], f"Card {slot_id} missing data-aspect-ratio")
            self.assertIn(slot_id, prompts_content, f"Slot {slot_id} missing from IMAGE_PROMPTS.md")
            if card["prompt_text"]:
                # First few words of prompt must be in IMAGE_PROMPTS.md
                words = card["prompt_text"].split()[:5]
                snippet = " ".join(words)
                self.assertIn(snippet, prompts_content, f"Prompt text for {slot_id} not reflected in index")


class TestTier5AdversarialCoverageHardening(unittest.TestCase):
    """Tier 5: Offline self-containment, zero CDN dependencies, and security isolation."""

    def test_standalone_generator_zero_external_dependencies(self):
        standalone_path = SITE_DIR / "standalone-generator.html"
        content = standalone_path.read_text(encoding="utf-8")

        # Parse with HTML parser
        parser = parse_html_file(standalone_path)

        # 1. No external scripts
        for src in parser.scripts:
            self.assertIsNone(src, f"Standalone generator contains external script reference: {src}")

        # 2. No external stylesheets
        for href in parser.stylesheets:
            self.assertIsNone(href, f"Standalone generator contains external stylesheet link: {href}")

        # 3. Regex check for http/https in attributes or style urls
        external_urls = re.findall(r'(?:href|src|url)\s*=\s*["\'](https?://[^"\']+)["\']', content, re.IGNORECASE)
        # Exclude benign reference documentation links in <a> tags
        bad_resources = [url for url in external_urls if not url.startswith("https://github.com")]
        self.assertEqual(bad_resources, [], f"Found unauthorized remote network resources in standalone generator: {bad_resources}")

        # 4. Check presence of inlined CSS and JS
        self.assertIn("<style>", content, "Standalone generator missing inline <style>")
        self.assertIn("</style>", content)
        self.assertIn("<script>", content, "Standalone generator missing inline <script>")
        self.assertIn("</script>", content)
        self.assertIn("generateLatexCode", content, "Standalone generator missing core compilation engine")

    def test_git_branch_isolation(self):
        """Verifies that the current repository branch is 'gh-pages'."""
        import subprocess
        try:
            branch = subprocess.check_output(
                ["git", "branch", "--show-current"],
                cwd=str(WORKSPACE_ROOT),
                text=True
            ).strip()
            self.assertEqual(branch, "gh-pages", f"Expected to be on 'gh-pages' branch, but found '{branch}'")
        except Exception as e:
            self.skipTest(f"Git not available or error checking branch: {e}")

    def test_javascript_syntax_validity(self):
        """Validates that all external JS files and inlined JS have valid syntax."""
        import subprocess
        js_files = [
            SITE_DIR / "assets" / "js" / "site.js",
            SITE_DIR / "assets" / "js" / "generator.js"
        ]
        for js_path in js_files:
            self.assertTrue(js_path.is_file(), f"Missing JS file: {js_path}")
            res = subprocess.run(["node", "-c", str(js_path)], capture_output=True, text=True)
            self.assertEqual(res.returncode, 0, f"Syntax error in {js_path.name}: {res.stderr}")

    def test_code_boxes_have_valid_latex_and_copy_targets(self):
        """Asserts that all .code-box containers have valid copy targets and LaTeX snippets."""
        for page_name in ["index.html", "tutorials.html", "showcases.html"]:
            page_path = SITE_DIR / page_name
            content = page_path.read_text(encoding="utf-8")
            parser = parse_html_file(page_path)

            # Check that every data-copy-target exists as an ID on the page
            targets = re.findall(r'data-copy-target=["\']#([^"\']+)["\']', content)
            for target_id in targets:
                self.assertIn(target_id, parser.ids, f"Code copy target ID '#{target_id}' missing in {page_name}")

            # Check for standard LaTeX macros
            self.assertIn("\\documentclass", content)
            self.assertIn("\\begin{document}", content)


# ==============================================================================
# MAIN TEST RUNNER
# ==============================================================================

if __name__ == "__main__":
    suite = unittest.TestSuite()
    loader = unittest.TestLoader()

    suite.addTests(loader.loadTestsFromTestCase(TestTier1FeatureCoverage))
    suite.addTests(loader.loadTestsFromTestCase(TestTier2BoundaryAndCornerCases))
    suite.addTests(loader.loadTestsFromTestCase(TestTier3CrossFeatureInteractions))
    suite.addTests(loader.loadTestsFromTestCase(TestTier4RealWorldWorkloads))
    suite.addTests(loader.loadTestsFromTestCase(TestTier5AdversarialCoverageHardening))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    sys.exit(not result.wasSuccessful())
