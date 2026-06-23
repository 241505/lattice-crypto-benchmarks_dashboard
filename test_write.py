content = """import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pandas as pd
from lwe_ref import LWERef
from frodokem_sim import FrodoKEM640, FrodoKEM976
from kyber_py.kyber import Kyber512

def test_lwe_keygen():
    pk, sk = LWERef.keygen()
    assert isinstance(pk, tuple)
    assert isinstance(sk, bytes)
    print("OK test_lwe_keygen passed")

def test_frodo640_keygen():
    pk, sk = FrodoKEM640.keygen()
    assert len(pk) == 9616
    assert len(sk) == 19888
    print("OK test_frodo640_keygen passed")

def test_frodo976_keygen():
    pk, sk = FrodoKEM976.keygen()
    assert len(pk) == 15632
    assert len(sk) == 31296
    print("OK test_frodo976_keygen passed")

def test_kyber512():
    pk, sk = Kyber512.keygen()
    assert len(pk) == 800
    ss, ct = Kyber512.encaps(pk)
    ss2 = Kyber512.decaps(sk, ct)
    assert ss == ss2
    print("OK test_kyber512 passed")

def test_csv():
    path = os.path.join(os.path.dirname(__file__), '..', 'data', 'results.csv')
    assert os.path.exists(path)
    df = pd.read_csv(path)
    assert len(df) == 6
    print("OK test_csv passed")

if __name__ == "__main__":
    print("Running tests...")
    test_lwe_keygen()
    test_frodo640_keygen()
    test_frodo976_keygen()
    test_kyber512()
    test_csv()
    print("All tests passed!")
"""

with open('tests/test_benchmark.py', 'w') as f:
    f.write(content)
print("File written successfully!")