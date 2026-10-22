// mulberry32: เล็ก เร็ว และให้ลำดับเดิมทุกครั้งเมื่อ seed เท่ากัน (แทน Math.random ที่ตั้ง seed ไม่ได้)
export function makeRng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
  };
}

export function mixSeed(seed, i) {
  return (Math.imul(seed >>> 0, 1000003) + Math.imul(i + 1, 2654435761)) >>> 0;
}
