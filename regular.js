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

  const pointCount = 300;
  const positions = newArray(pointCount).map(() => {
    // Margin from print edge in centimeters
    const margin = 0.1;
    // Return a random 2D point inset by this margin
    // let x = p5.prototype.randomGaussian(margin, width),
    //     y = p5.prototype.randomGaussian(margin, height);

    // if ( x < margin ) x = margin;
    // if ( y < margin ) y = margin;
    // if ( x > (width-margin) ) x = width-margin;
    // if ( y > (height-margin) ) y = height-margin;
    return [
      // x,
      // y
      // p5.prototype.randomGaussian(0, width/8) + width/2,
      // p5.prototype.randomGaussian(0, height/8) + height/2
      randomFloat(margin, width - margin),
      randomFloat(margin, height - margin)
    ];
  });
  const cells = triangulate(positions);

  const lines = cells.map(cell => {
    // Get vertices for this cell
    const triangle = cell.map(i => positions[i]);
    // Close the path
    triangle.push(triangle[0]);
    return triangle;
  });

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

    // Turn on debugging if you want to see the random points
    if (debug) {
      positions.forEach(p => {
        context.beginPath();
        context.arc(p[0], p[1], 0.2, 0, Math.PI * 2);
        context.strokeStyle = 'red';
        context.stroke();
      });
    }
  }

  function print () {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}