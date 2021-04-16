import { Library } from '../src';

describe('Testing Library', () => {
  it('Should sum function sum two given numbers', () => {
    const library = new Library();
    expect(library.sum(2, 3)).toEqual(5);
  });
});
