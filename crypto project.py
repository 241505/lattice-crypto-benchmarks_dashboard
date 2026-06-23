import sys
import os
import pathlib

# ── Path injection ─────────────────────────────────────────────────────────────
# Insert the Project directory so that:
#   - lwe_ref and frodokem_sim resolve as top-level modules
#   - kyber_py is found as a package (with its internal relative imports intact)
PROJECT_DIR = pathlib.Path(__file__).parent.resolve()
if str(PROJECT_DIR) not in sys.path:
    sys.path.insert(0, str(PROJECT_DIR))

# ── Imports ────────────────────────────────────────────────────────────────────
from lwe_ref import LWERef
from frodokem_sim import FrodoKEM640, FrodoKEM976

# Kyber lives in a sub-package; importing via its package keeps relative imports working
from kyber_py.kyber import Kyber512, Kyber768, Kyber1024

import pandas as pd

# ── CSV path (dynamic) ─────────────────────────────────────────────────────────
CSV_PATH = PROJECT_DIR / "data" / "results.csv"


# ── Tests ──────────────────────────────────────────────────────────────────────

def test_lwe_keygen():
    pk, sk = LWERef.keygen()
    assert isinstance(pk, tuple)
    assert isinstance(sk, bytes)
    print("✅ test_lwe_keygen passed")

def test_lwe_enc():
    pk, sk = LWERef.keygen()
    ct, ss = LWERef.enc(pk)
    assert isinstance(ct, tuple)
    assert len(ss) == 32
    print("✅ test_lwe_enc passed")

def test_lwe_dec():
    pk, sk = LWERef.keygen()
    ct, ss = LWERef.enc(pk)
    result = LWERef.dec(sk, ct)
    assert result is not None
    print("✅ test_lwe_dec passed")

def test_frodo640_keygen():
    pk, sk = FrodoKEM640.keygen()
    assert len(pk) == 9616
    assert len(sk) == 19888
    print("✅ test_frodo640_keygen passed")

def test_frodo640_enc():
    pk, sk = FrodoKEM640.keygen()
    ct, ss = FrodoKEM640.enc(pk)
    assert len(ct) == 9720
    assert len(ss) == 32
    print("✅ test_frodo640_enc passed")

def test_frodo976_keygen():
    pk, sk = FrodoKEM976.keygen()
    assert len(pk) == 15632
    assert len(sk) == 31296
    print("✅ test_frodo976_keygen passed")

def test_frodo976_enc():
    pk, sk = FrodoKEM976.keygen()
    ct, ss = FrodoKEM976.enc(pk)
    assert len(ct) == 15744
    assert len(ss) == 32
    print("✅ test_frodo976_enc passed")

def test_kyber512_keygen():
    pk, sk = Kyber512.keygen()
    assert len(pk) == 800
    assert len(sk) == 1632
    print("✅ test_kyber512_keygen passed")

def test_kyber512_encaps_decaps():
    pk, sk = Kyber512.keygen()
    ss, ct = Kyber512.encaps(pk)
    assert len(ct) == 768
    assert len(ss) == 32
    ss2 = Kyber512.decaps(sk, ct)
    assert ss == ss2
    print("✅ test_kyber512_encaps_decaps passed")

def test_csv_exists():
    assert CSV_PATH.exists(), f"results.csv not found at: {CSV_PATH}"
    print(f"✅ test_csv_exists passed  ({CSV_PATH})")

def test_csv_contents():
    df = pd.read_csv(CSV_PATH)
    assert len(df) == 6, f"Expected 6 rows, got {len(df)}"
    required_cols = {
        "scheme", "keygen_mean_ms", "keygen_std_ms",
        "enc_mean_ms", "enc_std_ms",
        "dec_mean_ms", "dec_std_ms",
        "pk_size_bytes", "sk_size_bytes", "ct_size_bytes",
        "total_time_ms", "total_bytes",
    }
    missing = required_cols - set(df.columns)
    assert not missing, f"Missing columns: {missing}"
    print("✅ test_csv_contents passed")


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