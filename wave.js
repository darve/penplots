import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';
import p5 from 'p5';

window.lad = p5;

export const orientation = Orientation.LANDSCAPE;
export const dimensions = [80, 120];

// Uncomment this for predictable randomness on each run
// setSeed(16);

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  
  const lines = [];
  const lads = [];

	  let start_x = 0;
	  let start_y = 0;

  	for ( i = 1, l = 90; i < l; i++ ) {
      	lads.push({
          	pos: { x: i, y: 0 },
          	
          	x_size: start_x,
          	x_sine: start_x,
          	x_inc: (Math.PI/120),

          	y_size: start_x,
          	y_sine: start_y,
          	y_inc: (Math.PI/120)
      	});

      	start_x += 0.2;
      	start_y += 0.1;
  	}

  	for ( var i in lads ) {
      	
		var l = lads[i];
		lines.push([]);

		for ( var elephant = 0; elephant < 240; elephant++ ) {

			// l.pos.x = l.x_size * Math.sin(l.x_sine);
			l.pos.x += 0.1;
			l.pos.y = l.y_size * Math.cos(l.y_sine) + height/2;

			if ( elephant === 0 ) lines[lines.length-1].push([l.pos.x, l.pos.y]);
			
			l.x_sine += l.x_inc;
			l.y_sine += l.y_inc;

			l.x_size += l.x_inc;
			l.y_size += l.y_inc;

			lines[lines.length-1].push([l.pos.x, l.pos.y]);

			// line('old_pos' in l ? l.old_pos : l.pos, l.pos);
			// l.old_pos = { x: l.pos.x, y: l.pos.y };

  		}
    }

    window.lines = lines;

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