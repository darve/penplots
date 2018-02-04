
/**
 * Smash targets below this line
 * -----------------------------
 */

(function(win, doc, c) {

    var cx = c.getContext('2d'),
        w = win.innerWidth,
        h = win.innerHeight,

        clicked = false,
        lastpos = new Vec(w/2, h/2),
        brush = new Vec(w/2, h/2),
        dir = new Vec(2,2),

        rotation = 2,
        rotationAmount = .99,

        col,

        detail = 32,
        angle = 365 / detail,
        // angle = 45,        

        points1 = [],
        points2 = [],
        points3 = [],
        points4 = [],

        // Some rad colours, should we need any.
        colours = [
            '#ed5565',
            '#da4453',
            '#fc6e51',
            '#e9573f',
            '#ffce54',
            '#fcbb42',
            '#a0d468',
            '#8cc152',
            '#48cfad',
            '#37bc9b',
            '#4fc1e9',
            '#3bafda',
            '#5d9cec',
            '#4a89dc',
            '#ac92ec',
            '#967adc',
            '#ec87c0',
            '#d770ad',
            '#e6e9ed',
            '#ccd1d9',
            '#aab2bd',
            '#656d78',
            '#434a54'
        ];

    cx.lineWidth = 10;
    cx.fillStyle = 0x555555;
    cx.strokeStyle = 0x555555;

    console.log(lastpos, brush);

    function randomColour() {
        return colours[Math.floor(Math.random() * colours.length)];
    }

    function dot(x,y,r, c){
        cx.translate(x, y);
        cx.strokeStyle = c;
        cx.fillStyle = c;
        cx.beginPath();
        cx.arc(0, 0, r*2, 0, 2 * Math.PI, false);
        cx.closePath();
        cx.fill();
        cx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function line(x1, y1, x2, y2, c) {
        cx.strokeStyle = c;
        cx.beginPath();
        cx.moveTo(x1, y1);
        cx.lineTo(x2, y2);
        cx.stroke();
    }

    function getControlPoints(x0,y0,x1,y1,x2,y2,t){    
        var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
        var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        var fa=t*d01/(d01+d12);
        var fb=t-fa;
        var p1x=x1+fa*(x0-x2);
        var p1y=y1+fa*(y0-y2);
        var p2x=x1-fb*(x0-x2);
        var p2y=y1-fb*(y0-y2);  
        return [p1x,p1y,p2x,p2y]
    };

    function curve(pts,t,closed){
        if ( typeof pts[0] === 'object' ) {
            var _pts = [];
            for ( var i = 0; i < pts.length; i++ ) {
                _pts.push( pts[i].pos.x );
                _pts.push( pts[i].pos.y );
            }
            pts = _pts;
        }
        cx.save();
        var cp=[];   // array of control points, as x0,y0,x1,y1,...
        var n=pts.length;
        if(closed){
            //   Append and prepend knots and control points to close the curve
            pts.push(pts[0],pts[1],pts[2],pts[3]);
            pts.unshift(pts[n-1]);
            pts.unshift(pts[n-1]);
            for(var i=0;i<n;i+=2){
                cp=cp.concat(getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
            }
            cp=cp.concat(cp[0],cp[1]);   
            for(var i=2;i<n+2;i+=2){  
                cx.beginPath();
                cx.moveTo(pts[i],pts[i+1]);
                cx.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],pts[i+2],pts[i+3]);
                cx.stroke();
                cx.closePath();
            }
        }else{  
            // Draw an open curve, not connected at the ends
            for(var i=0;i<n-4;i+=2){
                cp=cp.concat(getControlPoints(pts[i],pts[i+1],pts[i+2],pts[i+3],pts[i+4],pts[i+5],t));
            }    
            for(var i=2;i<pts.length-5;i+=2){
                cx.beginPath();
                cx.moveTo(pts[i],pts[i+1]);
                cx.bezierCurveTo(cp[2*i-2],cp[2*i-1],cp[2*i],cp[2*i+1],pts[i+2],pts[i+3]);
                cx.stroke();
                cx.closePath();
            }
            //  For open curves the first and last arcs are simple quadratics.
            cx.beginPath();
            cx.moveTo(pts[0],pts[1]);
            cx.quadraticCurveTo(cp[0],cp[1],pts[2],pts[3]);
            cx.stroke();
            cx.closePath();
            cx.beginPath();
            cx.moveTo(pts[n-2],pts[n-1]);
            cx.quadraticCurveTo(cp[2*n-10],cp[2*n-9],pts[n-4],pts[n-3]);
            cx.stroke();
            cx.closePath();
        }
        cx.restore();   
    };


    function go(ev) {
        if ( clicked === true ) {
            window.requestAnimationFrame(function() {
                cx.lineWidth = 2;
                line(lastpos.x, lastpos.y, ev.pageX, ev.pageY, col);
                line((lastpos.x * -1) + w, lastpos.y, (ev.pageX * -1) + w, ev.pageY, col);
                line(lastpos.x, (lastpos.y * -1) + h, ev.pageX, (ev.pageY * -1) + h, col);
                line((lastpos.x * -1) + w, (lastpos.y * -1) + h, (ev.pageX * -1) + w, (ev.pageY * -1) + h, col);

                for ( var i = 0, l = detail; i < l; i++ ) {
                    cx.translate(w/2, h/2);
                    cx.rotate(angle*Math.PI/180);
                    cx.translate(-w/2, -h/2);

                    line(lastpos.x, lastpos.y, ev.pageX, ev.pageY, col);
                    line((lastpos.x * -1) + w, lastpos.y, (ev.pageX * -1) + w, ev.pageY, col);
                    line(lastpos.x, (lastpos.y * -1) + h, ev.pageX, (ev.pageY * -1) + h, col);
                    line((lastpos.x * -1) + w, (lastpos.y * -1) + h, (ev.pageX * -1) + w, (ev.pageY * -1) + h, col);
                }

                cx.setTransform(1, 0, 0, 1, 0, 0);

                lastpos.x = ev.pageX;
                lastpos.y = ev.pageY;
            });
        }
    }

    function randomise() {
        rotation = Math.random() * 2;
        rotationAmount = Math.random();
        dir = new Vec( Math.random() * 3, Math.random() * 3);
        brush.x = w/2;
        brush.y = h/2;
        cx.clearRect(0, 0, w, h);
        dot(w/2, h/2, 2, col);
        lastpos.x = w/2;
        lastpos.y = h/2;

        detail = Math.random() * 40;
        angle = 365 / detail;
    }

    window.randomise = randomise;

    function render() {
        
        cx.lineWidth = 1;
        rotation *= .994;
        dir = dir.rotate(rotation);
        brush.plusEq( dir );

        var ev = { pageX: brush.x, pageY: brush.y };

        line(lastpos.x, lastpos.y, ev.pageX, ev.pageY, col);
        line((lastpos.x * -1) + w, lastpos.y, (ev.pageX * -1) + w, ev.pageY, col);
        line(lastpos.x, (lastpos.y * -1) + h, ev.pageX, (ev.pageY * -1) + h, col);
        line((lastpos.x * -1) + w, (lastpos.y * -1) + h, (ev.pageX * -1) + w, (ev.pageY * -1) + h, col);

        for ( var i = 1, l = detail; i < l; i++ ) {
            cx.translate(w/2, h/2);
            cx.rotate(angle*Math.PI/180);
            cx.translate(-w/2, -h/2);

            line(lastpos.x, lastpos.y, ev.pageX, ev.pageY, col);
            line((lastpos.x * -1) + w, lastpos.y, (ev.pageX * -1) + w, ev.pageY, col);
            line(lastpos.x, (lastpos.y * -1) + h, ev.pageX, (ev.pageY * -1) + h, col);
            line((lastpos.x * -1) + w, (lastpos.y * -1) + h, (ev.pageX * -1) + w, (ev.pageY * -1) + h, col);
        }

        cx.setTransform(1, 0, 0, 1, 0, 0);

        lastpos.x = brush.x;
        lastpos.y = brush.y;

        window.requestAnimationFrame(render);
    }

    function init() {
        c.width = w;
        c.height = h;

        col = randomColour();
        dot(w/2, h/2, 2, col);

        // $(doc).on('mousedown', 'canvas', function(ev) {
        //     lastpos = new Vec(ev.pageX, ev.pageY);
        //     clicked = true;
        // });

        // $(doc).on('touchstart', 'canvas', function(ev) {
        //     var touch =  ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];
        //     lastpos = new Vec(touch.pageX, touch.pageY);
        //     clicked = true;
        // });

        // $(doc).on('mouseup touchend', function(ev) {
        //     clicked = false;
        // });

        $(doc).on('click', '.clear', function(ev) {
            ev.preventDefault
            randomise();
            // cx.clearRect(0, 0, w, h);
            // dot(w/2, h/2, 2, col);
        });

        // $(doc).on('touchmove', function(ev) {
        //     console.log('here we go', ev);
        //     ev.preventDefault();
        //     var touch =  ev.originalEvent.touches[0] || ev.originalEvent.changedTouches[0];
        //     console.log(touch);
        //     go(touch);
        // });

        // $(doc).on('mousemove', go);

        window.requestAnimationFrame(render);
    }
    $(init);

})(window,document,document.querySelectorAll('canvas')[0]);