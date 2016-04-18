/**
* Copyright 2012-2016, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var toImage = require('../plot_api/to_image');

/**
 * @param {object} gd figure Object
 * @param {object} opts option object
 * @param opts.format 'jpeg' | 'png' | 'webp' | 'svg'
 * @param opts.width width of snapshot in px
 * @param opts.height height of snapshot in px
 * @param opts.filename name of file excluding extension
 */
function downloadImage(gd, opts) {
    
    // check for undefined opts
    opts = opts || {};
    
    // default to png
    opts.format = opts.format || 'png';
    
    return new Promise(function(resolve,reject){
        if(gd._snapshotInProgress){
          reject('Snapshotting is unavailable in Internet Explorer. ' +
                     'Consider exporting your images using the Plotly Cloud');
        }
        
        gd._snapshotInProgress = true;
        var promise = toImage(gd, opts);
    
        var filename = opts.filename || gd.fn || 'newplot';
        filename += '.' + opts.format;

        promise.then(function(result) {
            gd._snapshotInProgress = false;
    
            var downloadLink = document.createElement('a');
            downloadLink.href = result;
            downloadLink.download = filename; // only supported by FF and Chrome
    
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            resolve();
        })
        .catch(function(err) {
            gd._snapshotInProgress = false;
            console.error(err);
            reject(err);
        });
    });
};

module.exports = downloadImage;
