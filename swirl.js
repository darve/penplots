import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';
import p5 from 'p5';

window.lad = p5;

export const orientation = Orientation.LANDSCAPE;
export const dimensions = [20, 20];

// Uncomment this for predictable randomness on each run
// setSeed(16);

const debug = false;

export default function createPlot (context, dimensions) {
  const [ width, height ] = dimensions;
  
  const lines = [];
  const lads = [];

  	for ( i = 1, l = 45; i < l; i++ ) {
      	lads.push({
          	pos: { x: 0, y: 0 },
          	
          	x_offset: width / ( i % 2 === 0 ? 16 : 20),
          	x_sine: i,
          	x_inc: (Math.PI/320),

          	y_offset: height / ( i % 2 === 0 ? 16 : 20),
          	y_sine: i,
          	y_inc: (Math.PI/320)
      	});
  	}

  	function line(pos1, pos2) {
    	lines.push([[pos1.x, pos1.y], [pos2.x, pos2.y]]);
  	}

  	for ( var i in lads ) {
      	
		var l = lads[i];
		lines.push([]);

		for ( var elephant = 0; elephant < 200; elephant++ ) {

			l.pos.x = l.x_offset * Math.sin(l.x_sine) + width/2;
			l.pos.y = l.y_offset * Math.cos(l.y_sine) + height/2;

			if ( elephant === 0 ) lines[lines.length-1].push([l.pos.x, l.pos.y]);
			l.x_sine += l.x_inc;
			l.y_sine += l.y_inc;

			l.x_offset += l.x_inc;
			l.y_offset += l.y_inc;

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