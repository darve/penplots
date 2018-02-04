import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';
import p5 from 'p5';

window.lad = p5;

export const orientation = Orientation.LANDSCAPE;
export const dimensions = [80, 80];

// Uncomment this for predictable randomness on each run
// setSeed(16);

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  
  const lines = [];
  const lads = [];
  let increase = 0.1;
  let y_inc = 1;

  for ( i = 1, l = 32; i < l; i++ ) {
      lads.push({
          pos: { x: i, y: 0 },
          offset: increase,
          sine: 1,
          inc: (Math.PI/60)
      });

      increase += 0.8;
  }

  lads[0].sine += lads[0].inc*2;

  	function line(pos1, pos2) {
    	lines.push([[pos1.x, pos1.y], [pos2.x, pos2.y]]);
  	}

  	for ( var elephant = 0; elephant < 95; elephant++ ) {

      	for ( var i in lads ) {
			var l = lads[i];
			
			// l.pos.x = l.offset * Math.sin(l.sine) + width/2;
			l.pos.x += 0.4;
			l.pos.y = l.offset * Math.sin(l.sine) + 3 + y_inc;
			l.sine += l.inc;

			line('old_pos' in l ? l.old_pos : l.pos, l.pos);

			l.old_pos = { x: l.pos.x, y: l.pos.y };
  		}

      // for ( var i = 0, l = lads.length-1; i < l; i++ ) {
      //     line(lads[i].pos, lads[i+1].pos);
      // }
      y_inc *= 1.05;
      

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