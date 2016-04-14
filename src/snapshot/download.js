/**
* Copyright 2012-2016, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/


'use strict';

var Plotly = require('../plotly');
var Lib = require('../lib');

/**
 * @param {object} gd figure Object
 * @param {object} opts option object
 * @param opts.format 'jpeg' | 'png' | 'webp' | 'svg'
 */
function downloadImage(gd, opts) {
    
    var Snapshot = Plotly.Snapshot;
    var Lib = Plotly.Lib;
  
    // check for undefined opts
    opts = opts || {};
    
    // default to png
    opts.format = opts.format || 'png';
    
    if(Lib.isIE()) {
        Lib.notifier('Snapshotting is unavailable in Internet Explorer. ' +
                     'Consider exporting your images using the Plotly Cloud', 'long');
        return;
    }

    if(gd._snapshotInProgress) {
        Lib.notifier('Snapshotting is still in progress - please hold', 'long');
        return;
    }

    gd._snapshotInProgress = true;
    Lib.notifier('Taking snapshot - this may take a few seconds', 'long');

    var promise = Snapshot.toImage(gd, opts);

    var filename = gd.fn || 'newplot';
    filename += '.' + opts.format;

    promise.then(function(result) {
        gd._snapshotInProgress = false;

        var downloadLink = document.createElement('a');
        downloadLink.href = result;
        downloadLink.download = filename; // only supported by FF and Chrome

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    })
    .catch(function(err) {
        gd._snapshotInProgress = false;

        Lib.notifier('Sorry there was a problem downloading your ' + format, 'long');
        console.error(err);
    });
};

module.exports = downloadImage;
