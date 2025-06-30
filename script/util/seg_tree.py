from typing import Callable, Generic, TypeVar


S = TypeVar("S")
class SegmentTree(Generic[S]):
    def __init__(self, n: int, op: Callable[[S, S], S], e: Callable[[], S]) -> None:
        """Initialize segment tree.
        Args:
            n (int): The length of this tree
            op: A function representing the binary operation `(a: S, b: S) -> S`
            e: A function returning the identity element `() -> S`
        """
        self._n = n
        self._op = op
        self._e = e
        # Number of leaves
        self._num_leaves = 1 << (n - 1).bit_length()
        # Segment Tree (1-indexed)
        self._tree = [e() for _ in range(2 * self._num_leaves)]
    
    def __getitem__(self, i: int) -> S:
        """Get a value of an element.
        Args:
            i (int): An index
        Return:
            `a[i]`
        """
        return self._tree[i]
    
    def __setitem__(self, i: int, x: S) -> None:
        """Set a value of an element.
        Args:
            i (int): An index to update (0-indexed)
            x: A value
        """
        i += self._num_leaves
        self._tree[i] = x
        i >>= 1
        while i > 0:
            self._tree[i] = self._op(self._tree[2 * i], self._tree[2 * i + 1])
            i >>= 1
    
    def prod(self, l: int, r: int):
        """Repeat the operation in a segment given and return the result.
        Args:
            l (int): The beginning index of a segment.
            r (int): The end index of a segment (exclusive).
        Return:
            `op(a[l], a[l+1], ..., a[r-1])`.
        """
        l += self._num_leaves
        r += self._num_leaves

        l_result = self._e()
        r_result = self._e()

        while l < r:
            if l & 1:
                l_result = self._op(l_result, self._tree[l])
                l += 1
            
            if r & 1:
                r_result = self._op(self._tree[r - 1], r_result)
            
            l >>= 1
            r >>= 1
        
        return self._op(l_result, r_result)
