class Solution(object):
    def minEatingSpeed(self, piles, h):
        """
        :type piles: List[int]
        :type h: int
        :rtype: int
        """
        if len(piles) > h:
            return -1
        elif len(piles) == h:
            return max(piles)
        
        l, r = 1, max(piles)
        valided = None
        while l <= r:
            middle = l + (r - l) // 2
            if self.valid(piles, h, middle):
                if l == r:
                    return middle
                r = middle
                valided = middle
            else:
                l = middle + 1
        return valided
        
    def valid(self, piels, h, k):
        idx = 0
        while h > 0:
            h -= -(-piels[idx] // k)
            if idx < len(piels) - 1 and h > 0:
                idx += 1
            else:
                break
        if h >= 0 and idx >= len(piels) - 1:
            return True
        return False
        
    
if __name__ == '__main__':
    solution_ins = Solution()
    print('Result: ',solution_ins.minEatingSpeed([1000000000,1000000000], 3))
    # print('Result: ',solution_ins.valid([1000000000,1000000000], 3, 1000000000))
    
