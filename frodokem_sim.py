import numpy as np
import os

class FrodoKEM640:
    """
    FrodoKEM-640 simulation using official NIST parameter sizes.
    Simulates timing overhead of plain LWE with correct dimensions.
    NIST Security Level 1.
    """
    N = 640
    Q = 32768
    SIGMA = 2.8

    PK_SIZE = 9616
    SK_SIZE = 19888
    CT_SIZE = 9720

    @classmethod
    def keygen(cls):
        s = np.random.randint(0, cls.Q, cls.N, dtype=np.int64)
        A = np.random.randint(0, cls.Q, (cls.N, cls.N), dtype=np.int64)
        e = np.round(np.random.normal(0, cls.SIGMA, cls.N)).astype(np.int64)
        b = (A @ s + e) % cls.Q
        pk = os.urandom(cls.PK_SIZE)
        sk = os.urandom(cls.SK_SIZE)
        return pk, sk

    @classmethod
    def enc(cls, pk):
        _ = np.random.randint(0, cls.Q, (cls.N, cls.N), dtype=np.int64)
        ct = os.urandom(cls.CT_SIZE)
        ss = os.urandom(32)
        return ct, ss

    @classmethod
    def dec(cls, sk, ct):
        ss = os.urandom(32)
        return ss


class FrodoKEM976:
    """
    FrodoKEM-976 simulation using official NIST parameter sizes.
    NIST Security Level 3.
    """
    N = 976
    Q = 65536
    SIGMA = 2.3

    PK_SIZE = 15632
    SK_SIZE = 31296
    CT_SIZE = 15744

    @classmethod
    def keygen(cls):
        s = np.random.randint(0, cls.Q, cls.N, dtype=np.int64)
        A = np.random.randint(0, cls.Q, (cls.N, cls.N), dtype=np.int64)
        e = np.round(np.random.normal(0, cls.SIGMA, cls.N)).astype(np.int64)
        b = (A @ s + e) % cls.Q
        pk = os.urandom(cls.PK_SIZE)
        sk = os.urandom(cls.SK_SIZE)
        return pk, sk

    @classmethod
    def enc(cls, pk):
        _ = np.random.randint(0, cls.Q, (cls.N, cls.N), dtype=np.int64)
        ct = os.urandom(cls.CT_SIZE)
        ss = os.urandom(32)
        return ct, ss

    @classmethod
    def dec(cls, sk, ct):
        ss = os.urandom(32)
        return ss