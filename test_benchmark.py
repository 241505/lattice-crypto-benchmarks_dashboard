"""
test_benchmark.py
Run from the Project/ directory:  python test_benchmark.py
Fixes:
  - sys.path injection so kyber_py loads as a package (preserving relative imports)
  - Dynamic data/results.csv discovery
"""

import sys
import os

# ── PATH SETUP ─────────────────────────────────────────────────────────────────
# This file lives in Project/.  We need:
#   1. Project/ on sys.path  → lets Python find lwe_ref, frodokem_sim as top-level
#   2. The *parent* of kyber_py (also Project/) on sys.path → lets kyber_py load
#      as a package so its internal "from .polynomials import …" relative imports work.

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
if PROJECT_DIR not in sys.path:
    sys.path.insert(0, PROJECT_DIR)

# ── IMPORTS ────────────────────────────────────────────────────────────────────
from lwe_ref      import LWERef
from frodokem_sim import FrodoKEM640, FrodoKEM976
from kyber_py.kyber import Kyber512   # now resolves via package context

import pandas as pd

# ── HELPERS ────────────────────────────────────────────────────────────────────
def results_csv_path():
    """Return the absolute path to data/results.csv regardless of cwd."""
    return os.path.join(PROJECT_DIR, "data", "results.csv")

# ══════════════════════════════════════════════════════════════════════════════
# LWE_Ref tests
# ══════════════════════════════════════════════════════════════════════════════

def test_lwe_keygen():
    pk, sk = LWERef.keygen()
    assert isinstance(pk, tuple),  f"pk should be tuple, got {type(pk)}"
    assert isinstance(sk, bytes),  f"sk should be bytes, got {type(sk)}"
    print("✅ test_lwe_keygen passed")

def test_lwe_enc():
    pk, sk = LWERef.keygen()
    ct, ss = LWERef.enc(pk)
    assert isinstance(ct, tuple), f"ct should be tuple, got {type(ct)}"
    assert len(ss) == 32,         f"shared secret should be 32 bytes, got {len(ss)}"
    print("✅ test_lwe_enc passed")

def test_lwe_dec():
    pk, sk = LWERef.keygen()
    ct, ss = LWERef.enc(pk)
    result = LWERef.dec(sk, ct)
    assert result is not None, "LWERef.dec returned None"
    print("✅ test_lwe_dec passed")

# ══════════════════════════════════════════════════════════════════════════════
# FrodoKEM tests
# ══════════════════════════════════════════════════════════════════════════════

def test_frodo640_keygen():
    pk, sk = FrodoKEM640.keygen()
    assert len(pk) == 9616,  f"FrodoKEM640 pk size: expected 9616, got {len(pk)}"
    assert len(sk) == 19888, f"FrodoKEM640 sk size: expected 19888, got {len(sk)}"
    print("✅ test_frodo640_keygen passed")

def test_frodo640_enc():
    pk, sk = FrodoKEM640.keygen()
    ct, ss = FrodoKEM640.enc(pk)
    assert len(ct) == 9720, f"FrodoKEM640 ct size: expected 9720, got {len(ct)}"
    assert len(ss) == 32,   f"FrodoKEM640 ss size: expected 32, got {len(ss)}"
    print("✅ test_frodo640_enc passed")

def test_frodo976_keygen():
    pk, sk = FrodoKEM976.keygen()
    assert len(pk) == 15632, f"FrodoKEM976 pk size: expected 15632, got {len(pk)}"
    assert len(sk) == 31296, f"FrodoKEM976 sk size: expected 31296, got {len(sk)}"
    print("✅ test_frodo976_keygen passed")

def test_frodo976_enc():
    pk, sk = FrodoKEM976.keygen()
    ct, ss = FrodoKEM976.enc(pk)
    assert len(ct) == 15744, f"FrodoKEM976 ct size: expected 15744, got {len(ct)}"
    assert len(ss) == 32,    f"FrodoKEM976 ss size: expected 32, got {len(ss)}"
    print("✅ test_frodo976_enc passed")

# ══════════════════════════════════════════════════════════════════════════════
# Kyber512 tests
# ══════════════════════════════════════════════════════════════════════════════

def test_kyber512_keygen():
    pk, sk = Kyber512.keygen()
    assert len(pk) == 800,  f"Kyber512 pk size: expected 800, got {len(pk)}"
    assert len(sk) == 1632, f"Kyber512 sk size: expected 1632, got {len(sk)}"
    print("✅ test_kyber512_keygen passed")

def test_kyber512_encaps_decaps():
    pk, sk = Kyber512.keygen()
    ss, ct = Kyber512.encaps(pk)          # encaps returns (ss, ct)
    assert len(ct) == 768, f"Kyber512 ct size: expected 768, got {len(ct)}"
    assert len(ss) == 32,  f"Kyber512 ss size: expected 32, got {len(ss)}"
    ss2 = Kyber512.decaps(sk, ct)
    assert ss == ss2, "Kyber512 decaps: shared secrets do not match"
    print("✅ test_kyber512_encaps_decaps passed")

# ══════════════════════════════════════════════════════════════════════════════
# CSV tests
# ══════════════════════════════════════════════════════════════════════════════

def test_csv_exists():
    path = results_csv_path()
    assert os.path.isfile(path), f"results.csv not found at: {path}"
    print(f"✅ test_csv_exists passed  ({path})")

def test_csv_contents():
    path = results_csv_path()
    df = pd.read_csv(path)
    assert len(df) == 6, f"Expected 6 rows in results.csv, got {len(df)}"

    required_cols = [
        "scheme", "keygen_mean_ms", "keygen_std_ms",
        "enc_mean_ms", "enc_std_ms",
        "dec_mean_ms", "dec_std_ms",
        "pk_size_bytes", "sk_size_bytes", "ct_size_bytes",
        "total_time_ms", "total_bytes",
    ]
    for col in required_cols:
        assert col in df.columns, f"Missing column in results.csv: {col}"

    print("✅ test_csv_contents passed  (6 rows, all required columns present)")

# ══════════════════════════════════════════════════════════════════════════════
# RUNNER
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n=============================================")
    print("Running Unit Tests")
    print("=============================================\n")

    test_lwe_keygen()
    test_lwe_enc()
    test_lwe_dec()
    test_frodo640_keygen()
    test_frodo640_enc()
    test_frodo976_keygen()
    test_frodo976_enc()
    test_kyber512_keygen()
    test_kyber512_encaps_decaps()
    test_csv_exists()
    test_csv_contents()

    print("\n=============================================")
    print("All Tests Passed! ✅")
    print("=============================================\n")