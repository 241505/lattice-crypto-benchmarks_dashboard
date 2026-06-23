from kyber_py.kyber import Kyber512

pk, sk = Kyber512.keygen()
print('pk size:', len(pk))
print('sk size:', len(sk))

result = Kyber512.encaps(pk)
print('item 0 size:', len(result[0]))
print('item 1 size:', len(result[1]))