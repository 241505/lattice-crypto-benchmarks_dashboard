# PQC Benchmark — Post-Quantum Cryptography Evaluation

## Project Overview
This benchmarking engine evaluates the performance of lattice-based
Key Encapsulation Mechanisms (KEMs) to address the deployment gap
between FrodoKEM, Kyber, and plain LWE schemes.

## Team
Final Year Undergraduate Computer Science Project
Group of 4 Students — Member 2: Benchmarking Engine

## Project Structure
pqc_benchmark/
├── benchmark.py        # Main benchmarking engine
├── lwe_ref.py          # Plain LWE reference simulation
├── frodokem_sim.py     # FrodoKEM parameter simulation
├── test_write.py       # Test file writer
├── data/
│   └── results.csv     # Benchmark output (100 trials)
├── graphs/             # Output graphs (Member 3)
├── tests/
│   └── test_benchmark.py  # Unit tests
└── README.md

## Requirements
- Python 3.13+
- Windows 10/11

## Installation
pip install kyber-py pqcrypto pandas numpy matplotlib seaborn

## How to Run

### Activate virtual environment
venv\Scripts\activate.bat

### Run benchmarks (takes 3-5 minutes)
python benchmark.py

### Run unit tests
python tests\test_benchmark.py

## Schemes Benchmarked
| Scheme      | Type        | NIST Level |
|-------------|-------------|------------|
| LWE_Ref     | Plain LWE   | Baseline   |
| FrodoKEM640 | Plain LWE   | Level 1    |
| FrodoKEM976 | Plain LWE   | Level 3    |
| Kyber512    | Module-LWE  | Level 1    |
| Kyber768    | Module-LWE  | Level 3    |
| Kyber1024   | Module-LWE  | Level 5    |

## Hardware Used
Intel Core i5, Windows 11
Background processes minimised during benchmarking.
100 repeated trials per operation per scheme.
Results: mean and standard deviation reported in milliseconds.

## Output
Results saved to data/results.csv with columns:
- scheme, keygen_mean_ms, keygen_std_ms
- enc_mean_ms, enc_std_ms
- dec_mean_ms, dec_std_ms
- pk_size_bytes, sk_size_bytes, ct_size_bytes
- total_time_ms, total_bytes