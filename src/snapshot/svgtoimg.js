/**
* Copyright 2012-2016, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

var EventEmitter = require('events').EventEmitter;

'use strict';

function svgToImg(opts) {
  
    var ev = opts.emitter || new EventEmitter();

    var promise = new Promise(function(resolve, reject) {

        var Image = window.Image;
        var Blob = window.Blob;

        var svg = opts.svg;
        var format = opts.format || 'png';
        var canvas = opts.canvas;

        var ctx = canvas.getContext('2d');
        var img = new Image();
        var DOMURL = window.URL || window.webkitURL;
        var svgBlob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
        var url = DOMURL.createObjectURL(svgBlob);

        canvas.height = opts.height || 150;
        canvas.width = opts.width || 300;

        img.onload = function() {
            var imgData;

            DOMURL.revokeObjectURL(url);
            ctx.drawImage(img, 0, 0);

            switch(format) {
                case 'jpeg':
                    imgData = canvas.toDataURL('image/jpeg');
                    break;
                case 'png':
                    imgData = canvas.toDataURL('image/png');
                    break;
                case 'webp':
                    imgData = canvas.toDataURL('image/webp');
                    break;
                case 'svg':
                    imgData = svg;
                    break;
                default:
                    reject(new Error('Image format is not jpeg, png or svg'));
                    // eventually remove the ev
                    //  in favor of promises
                    if(!opts.promise){
                      return ev.emit('error', 'Image format is not jpeg, png or svg');
                    }
            }
            resolve(imgData);
            // eventually remove the ev
            //  in favor of promises
            if(!opts.promise){
              ev.emit('success', imgData);
            }
        };

        img.onerror = function(err) {
            DOMURL.revokeObjectURL(url);
            reject(err);
            // eventually remove the ev
            //  in favor of promises
            if(!opts.promise){
              return ev.emit('error', err);
            }
        };

        img.src = url;
    });

    // temporary for backward compatibility
    //  move to only Promise in 2.0.0
    //  and eliminate the EventEmitter
    if(opts.promise) {
      return promise;
    }
    
    return ev;
}

module.exports = svgToImg;
