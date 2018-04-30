class RNG {
	constructor(seed) {
		this.m = 0x80000000 // 2**31;
		this.a = 1103515245
		this.c = 12345

		this.state = seed ? seed : Math.floor(Math.random() * (this.m-1))
    }

    nextInt() {
      this.state = (this.a * this.state + this.c) % this.m
      return this.state
    }

    nextFloat() {
      return this.nextInt() / (this.m - 1)
    }

    nextRange(start, end) {
      const rangeSize = end - start
      const randomUnder1 = this.nextInt() / this.m
      return start + Math.floor(randomUnder1 * rangeSize)
	}
}

export default RNG
