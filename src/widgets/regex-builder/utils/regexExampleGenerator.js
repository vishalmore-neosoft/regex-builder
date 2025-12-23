const RANDOM = {
  digit: () => String(Math.floor(Math.random() * 10)),
  lower: () => String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  upper: () => String.fromCharCode(65 + Math.floor(Math.random() * 26)),
  alphaNum: () =>
    Math.random() < 0.5
      ? String.fromCharCode(65 + Math.floor(Math.random() * 26))
      : String(Math.floor(Math.random() * 10)),
  space: () => ' '
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const sanitizeRegex = (r) =>
  r.replace(/^\/|\/$/g, '').replace(/^\^|\$$/g, '');

const readQuantifier = (r) => {
  if (r.startsWith('{')) {
    const m = r.match(/^\{(\d+)(?:,(\d+))?\}/);
    if (!m) return null;
    return {
      min: Number(m[1]),
      max: Number(m[2] ?? m[1]),
      len: m[0].length
    };
  }

  if (r[0] === '+') return { min: 1, max: 5, len: 1 };
  if (r[0] === '*') return { min: 0, max: 5, len: 1 };
  if (r[0] === '?') return { min: 0, max: 1, len: 1 };

  return null;
};

const applyRepeat = (gen, min, max) => {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return Array.from({ length: count }, gen).join('');
};

const charClassGenerator = (cls) => {
  const gens = [];

  if (cls.includes('0-9')) gens.push(RANDOM.digit);
  if (cls.includes('a-z')) gens.push(RANDOM.lower);
  if (cls.includes('A-Z')) gens.push(RANDOM.upper);

  cls.replace(/[^a-zA-Z0-9\-]/g, '')
    .split('')
    .forEach((c) => {
      if (!['a', 'z', 'A', 'Z', '0', '9', '-'].includes(c)) {
        gens.push(() => c);
      }
    });

  return pick(gens)();
};

export const generateExampleFromRegex = (regex) => {
  let r = sanitizeRegex(regex);
  let out = '';

  while (r.length) {
    // Character class [A-Z]
    if (r.startsWith('[')) {
      const end = r.indexOf(']');
      const cls = r.slice(1, end);
      r = r.slice(end + 1);

      const q = readQuantifier(r);
      if (q) {
        out += applyRepeat(() => charClassGenerator(cls), q.min, q.max);
        r = r.slice(q.len);
      } else {
        out += charClassGenerator(cls);
      }
      continue;
    }

    // Escaped tokens
    if (r.startsWith('\\')) {
      const token = r[1];
      r = r.slice(2);

      let gen;
      if (token === 'd') gen = RANDOM.digit;
      else if (token === 'w') gen = RANDOM.alphaNum;
      else if (token === 's') gen = RANDOM.space;
      else gen = () => token;

      const q = readQuantifier(r);
      if (q) {
        out += applyRepeat(gen, q.min, q.max);
        r = r.slice(q.len);
      } else {
        out += gen();
      }
      continue;
    }

    // Literal character
    out += r[0];
    r = r.slice(1);
  }

  return out;
};

export const generateRegexExamples = (regex, count = 25) =>
  Array.from({ length: count }, () => generateExampleFromRegex(regex));
