import phraseMatches from './strings';

describe('phraseMatches', () => {
  test('check for positives', () => {
    expect(
      phraseMatches('san martin', 'General José de San Martín Memorial Day')
    ).toBe(true);

    expect(
      phraseMatches(
        'guemes',
        'Anniversary of the Passing of General Martín Miguel de Güemes'
      )
    ).toBe(true);

    expect(
      phraseMatches("Washington's Birthday", "Washington's Birthday")
    ).toBe(true);

    expect(phraseMatches('children', "Children's Day")).toBe(true);

    expect(phraseMatches('saints', 'All Saints Day')).toBe(true);

    expect(
      phraseMatches('Qingming', 'Qingming Festival (Tomb-Sweeping Day)')
    ).toBe(true);

    expect(phraseMatches('thanksgiving day', 'Thanksgiving')).toBe(true);
  });
  test('check for negatives', () => {
    expect(
      phraseMatches(
        'san martin',
        'Anniversary of the Passing of General Martín Miguel de Güemes'
      )
    ).toBe(false);

    expect(phraseMatches('children', 'All Saints Day')).toBe(false);

    expect(phraseMatches("someone's birthday", "Washington's Birthday")).toBe(
      false
    );
  });
});
