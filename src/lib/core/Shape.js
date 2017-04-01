import uniqueId from 'lodash/uniqueId';
import assign from 'lodash/assign';
import head from 'lodash/head';
import keys from 'lodash/keys';
import pick from 'lodash/pick';

function getNonEmptyCells(cells) {
  return cells
    .map((color, x) => ({ color, x }))
    .filter(({ color }) => color != null);
}

export function getShapeMeta(shape) {
  const key = head(keys(shape));
  const point = shape[key];
  return pick(point, [
    'id',
    'name',
  ]);
}

export default function Shape(name, shape) {
  const id = uniqueId(`${name}-`);
  return shape
    .map((cells, y) => (
      getNonEmptyCells(cells)
        .reduce((acc, { color, x }) => assign(acc, {
          [`${x}.${y}`]: {
            id,
            name,
            color,
          },
        }), {})
    ))
    .reduce((acc, cells) => assign(acc, cells), {});
}
