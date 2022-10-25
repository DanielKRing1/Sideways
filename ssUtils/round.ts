function roundDown(number: number, increment: number, offset: number = 0) {
  return Math.floor((number - offset) / increment) * increment + offset;
}
