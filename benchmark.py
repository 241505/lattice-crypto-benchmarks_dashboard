import timeit
import statistics
import pandas as pd
import os
import numpy as np

# ── Kyber imports ─────────────────────────────────────────────
from kyber_py.kyber import Kyber512, Kyber768, Kyber1024

# ── Simulation imports ────────────────────────────────────────
from lwe_ref import LWERef
from frodokem_sim import FrodoKEM640, FrodoKEM976

TRIALS = 100

# ── Kyber Wrapper (fixes encaps return order) ─────────────────
class KyberScheme:
    def __init__(self, scheme):
        self.scheme = scheme

    def keygen(self):
        pk, sk = self.scheme.keygen()
        return pk, sk

    def enc(self, pk):
        # encaps returns (shared_secret, ciphertext)
        ss, ct = self.scheme.encaps(pk)
        return ct, ss

    def dec(self, sk, ct):
        ss = self.scheme.decaps(sk, ct)
        return ss

# ── All schemes ───────────────────────────────────────────────
SCHEMES = {
    "LWE_Ref"     : LWERef,
    "FrodoKEM640" : FrodoKEM640,
    "FrodoKEM976" : FrodoKEM976,
    "Kyber512"    : KyberScheme(Kyber512),
    "Kyber768"    : KyberScheme(Kyber768),
    "Kyber1024"   : KyberScheme(Kyber1024),
}

results = []

print("=" * 55)
print("   PQC Benchmarking Engine — Starting")
print(f"   Trials per operation: {TRIALS}")
print("=" * 55)

for name, scheme in SCHEMES.items():
    print(f"\n Running: {name} ...")

    try:
        # ── Key Generation ────────────────────────────────────
        kg_times = timeit.repeat(
            lambda s=scheme: s.keygen(),
            repeat=TRIALS, number=1
        )
        pk, sk = scheme.keygen()

        # ── Encapsulation ─────────────────────────────────────
        enc_times = timeit.repeat(
            lambda s=scheme, p=pk: s.enc(p),
            repeat=TRIALS, number=1
        )
        ct, ss = scheme.enc(pk)

        # ── Decapsulation ─────────────────────────────────────
        dec_times = timeit.repeat(
            lambda s=scheme, k=sk, c=ct: s.dec(k, c),
            repeat=TRIALS, number=1
        )

        # ── Key sizes ─────────────────────────────────────────
        if isinstance(pk, tuple):
            pk_size = sum(len(x) for x in pk)
        else:
            pk_size = len(pk)

        if isinstance(sk, tuple):
            sk_size = sum(len(x) for x in sk)
        else:
            sk_size = len(sk)

        if isinstance(ct, tuple):
            ct_size = sum(len(x) for x in ct)
        else:
            ct_size = len(ct)

        # ── Store results ─────────────────────────────────────
        row = {
            "scheme"         : name,
            "keygen_mean_ms" : round(statistics.mean(kg_times)   * 1000, 4),
            "keygen_std_ms"  : round(statistics.stdev(kg_times)  * 1000, 4),
            "enc_mean_ms"    : round(statistics.mean(enc_times)  * 1000, 4),
            "enc_std_ms"     : round(statistics.stdev(enc_times) * 1000, 4),
            "dec_mean_ms"    : round(statistics.mean(dec_times)  * 1000, 4),
            "dec_std_ms"     : round(statistics.stdev(dec_times) * 1000, 4),
            "pk_size_bytes"  : pk_size,
            "sk_size_bytes"  : sk_size,
            "ct_size_bytes"  : ct_size,
            "total_time_ms"  : round((statistics.mean(kg_times) +
                                      statistics.mean(enc_times) +
                                      statistics.mean(dec_times)) * 1000, 4),
            "total_bytes"    : pk_size + sk_size + ct_size,
        }
        results.append(row)

        print(f"   Keygen : {row['keygen_mean_ms']} ms ± {row['keygen_std_ms']}")
        print(f"   Enc    : {row['enc_mean_ms']} ms ± {row['enc_std_ms']}")
        print(f"   Dec    : {row['dec_mean_ms']} ms ± {row['dec_std_ms']}")
        print(f"   PK     : {pk_size} bytes")
        print(f"   SK     : {sk_size} bytes")
        print(f"   CT     : {ct_size} bytes")
        print(f"   Total  : {row['total_time_ms']} ms | {row['total_bytes']} bytes")

    except Exception as e:
        print(f"   ERROR: {e}")

# ── Save to CSV ───────────────────────────────────────────────
os.makedirs("data", exist_ok=True)
df = pd.DataFrame(results)
df.to_csv("data/results.csv", index=False)

print("\n" + "=" * 55)
print("   Benchmarking Complete!")
print("   Results saved to: data/results.csv")
print("=" * 55)
print("\n")
print(df.to_string(index=False))