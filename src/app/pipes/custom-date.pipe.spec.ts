import { DateCustomPipe } from './custom-date.pipe';

describe('DateCustomPipe', () => {
  it('create an instance', () => {
    const pipe = new DateCustomPipe();
    expect(pipe).toBeTruthy();
  });
});
