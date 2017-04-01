import pickBy from 'lodash/pickBy';
import omitBy from 'lodash/omitBy';
import keys from 'lodash/keys';
import has from 'lodash/has';
import identity from 'lodash/identity';
import { getShapeMeta } from './Shape';
import position, { getShapeNewPosition } from './position';

function removeShape(state, id) {
  return omitBy(state, point => point.id === id);
}

function getCollidingPoints(state, currentShape, [futureX, futureY]) {
  const futureShape = getShapeNewPosition(currentShape, [futureX, futureY]);

  return keys(futureShape)
    .map((coords) => {
      if (has(state, coords)) {
        return state[coords];
      }

      return null;
    })
    .filter(identity);
}

export default function move(state, shape, [incrementX, incrementY], callback = identity) {
  const { id } = getShapeMeta(shape);
  const currentShape = pickBy(state, point => point.id === id);
  const stateWithoutShape = removeShape(state, id);
  const collidingPoints = getCollidingPoints(
    stateWithoutShape,
    currentShape,
    [incrementX, incrementY],
  );

  if (collidingPoints.length) {
    return callback(state, collidingPoints);
  }

  return position(stateWithoutShape, currentShape, [incrementX, incrementY]);
}
