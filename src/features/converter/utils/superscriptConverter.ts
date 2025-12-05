
const superscriptMap: Record<string, string> = {
  '⁰': '0',
  '¹': '1',
  '²': '2',
  '³': '3',
  '⁴': '4',
  '⁵': '5',
  '⁶': '6',
  '⁷': '7',
  '⁸': '8',
  '⁹': '9',
};

const SUPERSCRIPT_SEQUENCE = /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;

export type ConversionResult = {
  converted: string;
  replacements: number;
  digitsTransformed: number;
  references: string[];
};

export function convertSuperscripts(input: string): ConversionResult {
  if (!input) {
    return {
      converted: '',
      replacements: 0,
      digitsTransformed: 0,
      references: [],
    };
  }

  let replacements = 0;
  let digitsTransformed = 0;
  const references: string[] = [];

  const converted = input.replace(SUPERSCRIPT_SEQUENCE, (match) => {
    replacements += 1;
    let normalized = '';

    for (const char of match) {
      normalized += superscriptMap[char] ?? '';
    }

    digitsTransformed += match.length;
    references.push(normalized);

    return `[${normalized}]`;
  });

  return {
    converted,
    replacements,
    digitsTransformed,
    references,
  };
}
