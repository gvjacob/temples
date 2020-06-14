import { String } from 'runtypes';
import { Optional, Mapping, Paths, Base, Context, Prompt, Temple } from '.';

describe('types', () => {
  const testGuard = (type, input, pass = true) => {
    expect(type.guard(input)).toBe(pass);
  };

  describe('Optional', () => {
    it('true for correct type', () => {
      testGuard(Optional(String), '');
    });

    it('true for undefined', () => {
      testGuard(Optional(String));
    });

    it('false for wrong type', () => {
      testGuard(Optional(String), 0, false);
    });
  });

  describe('Mapping', () => {
    it('true for String -> String', () => {
      testGuard(Mapping, { hello: 'temples' });
    });

    it('false for String -> Any', () => {
      testGuard(Mapping, { hello: 0 }, false);
    });
  });

  describe('Base', () => {
    it('true for String', () => {
      testGuard(Base, '');
    });

    it('true for { template, output }', () => {
      const input = {
        template: '',
        output: '',
      };

      testGuard(Base, input);
    });

    it('true for { template }', () => {
      const input = {
        template: '',
      };

      testGuard(Base, input);
    });

    it('true for { output }', () => {
      const input = {
        output: '',
      };

      testGuard(Base, input);
    });

    it('true for {}', () => {
      const input = {};
      testGuard(Base, input);
    });

    it('false for Any', () => {
      const input = null;
      testGuard(Base, input, false);
    });
  });

  describe('Prompt', () => {
    it('true for array of strings', () => {
      testGuard(Prompt, ['']);
    });

    it('true for array of { key: string, doc: string }', () => {
      testGuard(Prompt, [{ key: '', doc: '' }]);
    });

    it('true for array of string or { key: string, doc: string }', () => {
      testGuard(Prompt, ['', { key: '', doc: '' }]);
    });

    it('false if prompt object is not complete', () => {
      testGuard(Prompt, [{ key: '' }], false);
      testGuard(Prompt, [{ doc: '' }], false);
      testGuard(Prompt, [{}], false);
    });
  });

  describe('Context', () => {
    it('true for { base, default }', () => {
      testGuard(Context, { base: '', default: {} });
    });

    it('true for { base }', () => {
      testGuard(Context, { base: '' });
    });

    it('true for { default }', () => {
      testGuard(Context, { default: {} });
    });

    it('false for Any', () => {
      const input = null;
      testGuard(Context, input, false);
    });
  });

  describe('Temple', () => {
    it('true for { output }', () => {
      testGuard(Temple, { output: '' });
    });

    it('false for { }', () => {
      testGuard(Temple, {}, false);
    });
  });
});
