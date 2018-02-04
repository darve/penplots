import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import triangulate from 'delaunay-triangulate';
import p5 from 'p5';
import Vec from './Vec';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = [120, 120];
export default function createPlot (context, dimensions) {

  const [ width, height ] = dimensions;
  const lines = [];
  const rot_lines = [];
  const o = {
      lastpos: new Vec(width/2, height/2),
      brush: new Vec(width/2, height/2),
      dir: new Vec(2,2),
      rotation: 2,
      detail: 32,
      angle: 365 / 32,
      iterations: 600
  };

  function line(arr, index, x, y) {
    if (!arr[index]) arr.push([]);
    arr[index].push([x, y]); 
  }
  
  function randomise() {
      o.lastpos = new Vec(width/2, height/2),
      o.brush = new Vec(width/2, height/2),
      o.rotation = Math.random() * 2;
      o.dir = new Vec( Math.random() * 3, Math.random() * 3);
      o.detail = Math.random() * 40;
      o.angle = 360 / o.detail;
  }

  randomise();

  for ( var elephant = 0; elephant < o.iterations; elephant++ ) {

      o.rotation *= .994;
      o.dir = o.dir.rotate(o.rotation);
      o.brush.plusEq( o.dir );

      line(lines, 0, o.brush.x, o.brush.y);
      line(lines, 1, (o.brush.x * -1) + width, o.brush.y);
      line(lines, 2, o.brush.x, (o.brush.y * -1) + height);
      line(lines, 3, (o.brush.x * -1) + width, (o.brush.y * -1) + height);

      for ( var i = 0, l = o.detail; i < l; i++ ) {
          var temp = o.brush.clone();
          temp.rotateAroundPoint(new Vec(width/2, height/2), o.angle * i, false);
          line(rot_lines, 0, temp.x, temp.y);
          line(rot_lines, 1, (temp.x * -1) + width, temp.y);
          line(rot_lines, 2, temp.x, (temp.y * -1) + height);
          line(rot_lines, 3, (temp.x * -1) + width, (temp.y * -1) + height);
      }

      // for ( var i = 0, l = o.detail; i < l; i++ ) {
      //     var temp = o.brush.clone();
      //     temp.rotateAroundPoint(new Vec(width/2, height/2), (o.angle*Math.PI/180) * i, true);

      //     line(rot_lines, (i*4), temp.x, temp.y);
      //     line(rot_lines, (i*4)+1, (temp.x * -1) + width, temp.y);
      //     line(rot_lines, (i*4)+2, temp.x, (temp.y * -1) + height);
      //     line(rot_lines, (i*4)+3, (temp.x * -1) + width, (temp.y * -1) + height);
      // }

      o.lastpos.x = o.brush.x;
      o.lastpos.y = o.brush.y;

  }
  
  console.log(lines, rot_lines);

  return {
    draw,
    print,
    background: 'white'
  };

  function draw () {
    lines.concat(rot_lines).forEach(points => {
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