import _ from 'lodash';
import test from 'ava';
import jsdom from 'jsdom';
import { resetHtml, getCols, getCellColor } from './fixtures';
import getInitialState, { position } from '../../';
import { Car } from '../../__tests__/fixtures';
import render, { onGameOver } from '../';
import colors from '../../colors.json';

jsdom.env('', (err, window) => {
  if (err) {
    console.log(err);// eslint-disable-line no-console
    return;
  }

  global.window = window;

  test.beforeEach(() => {
    resetHtml();
  });

  test('should blank out all cells with an empty state', (t) => {
    render(getInitialState());

    const actual = getCols()
      .every(col => (
        _.toArray(col.children)
          .every(cell => (
            cell.getAttribute('fill') === colors.EMPTY
          ))
      ));
    const expected = true;

    t.is(actual, expected);
  });

  test('should paint objects accordingly', (t) => {
    render(position(getInitialState(), Car(), [2, 0]));

    const actual = [
      getCellColor([2, 0]),
      getCellColor([3, 0]),
    ];
    const expected = [
      'red',
      'red',
    ];

    t.deepEqual(actual, expected);
  });

  test('should not fail to render a null state', () => {
    render(getInitialState());
    render(null);
  });

  test('should call game over callback when rendering null state', (t) => {
    let calls = 0;
    onGameOver(() => {
      calls += 1;
    });
    render(getInitialState());
    render(null);

    const actual = calls;
    const expected = 1;

    t.is(actual, expected);
  });
});
