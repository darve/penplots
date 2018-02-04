import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';
import p5 from 'p5';

window.lad = p5;

export const orientation = Orientation.LANDSCAPE;
export const dimensions = [40, 40];

// Uncomment this for predictable randomness on each run
// setSeed(16);

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  const lines = [];
  const lads = [];

  let c_x = width/2;
  let c_y = height/2;

  for ( i = 1, l = 4; i < l; i++ ) {
      lads.push({
          pos: { x: 0, y: 0 },
          distance: 5 * i,
          sine: 1,
          inc: Math.PI / ((160/i) + i*6)
      });
  }

  function line(pos1, pos2) {
    lines.push([[pos1.x, pos1.y], [pos2.x, pos2.y]]);
  }

  for ( var elephant = 0; elephant < 160; elephant++ ) {

      for ( var i in lads ) {
          var l = lads[i];
          l.pos.x = l.distance * Math.sin(l.sine) + c_x;
          l.pos.y = l.distance * Math.cos(l.sine) + c_y;
          l.sine += l.inc;
      }

      // c_x += 0.02;
      // c_y += 0.02;

      for ( var i = 0, l = lads.length-1; i < l; i++ ) {
          line(lads[i].pos, lads[i+1].pos);
      }

  }

  return {
    draw,
    print,
    background: 'white'
  };

  function draw () {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}