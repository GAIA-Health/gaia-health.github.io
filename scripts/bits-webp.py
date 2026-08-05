#!/usr/bin/env python3
"""Trim + downscale brand-bit PNGs to website webps.

  python3 scripts/bits-webp.py <bit-id> [...]

Reads frames/bits/<id>@2x.png, trims transparent margins (keeping a little
breathing room so the drop shadow survives), resizes to 700px wide, and writes
images/screens/bit-<id>.webp via cwebp — same recipe as the existing
bit-clue/bit-correlation/bit-insight exports.
"""
import subprocess, sys, tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PAD = 24  # px kept around the alpha bbox at 2x, room for the soft shadow

for bit in sys.argv[1:]:
    src = ROOT / "frames" / "bits" / f"{bit}@2x.png"
    dst = ROOT / "images" / "screens" / f"bit-{bit}.webp"
    im = Image.open(src).convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    box = (max(0, bbox[0] - PAD), max(0, bbox[1] - PAD),
           min(im.width, bbox[2] + PAD), min(im.height, bbox[3] + PAD))
    im = im.crop(box)
    w = 700
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    with tempfile.NamedTemporaryFile(suffix=".png") as tmp:
        im.save(tmp.name)
        subprocess.run(["cwebp", "-q", "90", "-alpha_q", "100", tmp.name,
                        "-o", str(dst)], check=True, capture_output=True)
    print(f"  ✓ bit-{bit}.webp  {im.width}x{im.height}")
