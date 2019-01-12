import { PaperSize, Orientation } from 'penplot';
import { polylinesToSVG } from 'penplot/util/svg';
import { randomFloat, setSeed } from 'penplot/util/random';
import newArray from 'new-array';
import * as Honeycomb from 'honeycomb-grid'

export const orientation = Orientation.LANDSCAPE;
export const dimensions = [30, 30];

const debug = false;

export default function createPlot (context, dimensions) {

  const [ width, height ] = dimensions;
  const lines = [];
  const lads = [];


  const Hex = Honeycomb.extendHex({ size: 1 })
  const Grid = Honeycomb.defineGrid(Hex)

  // render 10,000 hexes
  Grid.rectangle({ width: 30, height: 30 }).forEach(hex => {
    
    const point = hex.toPoint()
    const corners = hex.corners().map(corner => corner.add(point))
    const [firstCorner, ...otherCorners] = corners

    let last_pos = [firstCorner.x, firstCorner.y];

    otherCorners.map( (item, index) => {
      lines.push([
        last_pos, [otherCorners[index].x, otherCorners[index].y]
      ]);
      last_pos = [otherCorners[index].x, otherCorners[index].y];
    })
    
    lines.push([
        last_pos, [firstCorner.x, firstCorner.y]
    ]);

  });

  for ( var i = 0, l = 3; i<l; i++ ) {
    lines.map( (item, index) => {
      if ( Math.random() > 0.6 ) lines.splice(index, 1);
    });  
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