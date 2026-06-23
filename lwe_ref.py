import numpy as np
import os

class LWERef:
    """
    Toy plain-LWE KEM simulation for baseline comparison.
    NOT cryptographically secure - used for performance baseline only.
    """
    N = 256
    Q = 3329
    SIGMA = 3

    @classmethod
    def keygen(cls):
        s = np.random.randint(0, cls.Q, cls.N, dtype=np.int64)
        A = np.random.randint(0, cls.Q, (cls.N, cls.N), dtype=np.int64)
        e = np.round(np.random.normal(0, cls.SIGMA, cls.N)).astype(np.int64)
        b = (A @ s + e) % cls.Q
        pk = (A.tobytes(), b.tobytes())
        sk = s.tobytes()
        return pk, sk

    @classmethod
    def enc(cls, pk):
        A_bytes, b_bytes = pk
        A = np.frombuffer(A_bytes, dtype=np.int64).reshape(cls.N, cls.N)
        b = np.frombuffer(b_bytes, dtype=np.int64)
        r  = np.random.randint(0, 2, cls.N, dtype=np.int64)
        e1 = np.round(np.random.normal(0, cls.SIGMA, cls.N)).astype(np.int64)
        e2 = int(np.round(np.random.normal(0, cls.SIGMA)))
        u  = (A.T @ r + e1) % cls.Q
        v  = (int(b @ r) + e2) % cls.Q
        ct = (u.tobytes(), v.to_bytes(4, 'little'))
        ss = os.urandom(32)
        return ct, ss

    @classmethod
    def dec(cls, sk, ct):
        s = np.frombuffer(sk, dtype=np.int64)
        u_bytes, v_bytes = ct
        u = np.frombuffer(u_bytes, dtype=np.int64)
        v = int.from_bytes(v_bytes, 'little')
        r = (v - int(s @ u)) % cls.Q
        return r.to_bytes(4, 'little')