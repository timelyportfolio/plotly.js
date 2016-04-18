// move toimage to plot_api_test.js
//  once established and confirmed

var Plotly = require('@lib/index');
var createGraphDiv = require('../assets/create_graph_div');
var destroyGraphDiv = require('../assets/destroy_graph_div');
var subplotMock = require('../../image/mocks/multiple_subplots.json');
var annotationMock = require('../../image/mocks/annotations.json');


describe('Plotly.toImage', function() {
    'use strict';
    var gd;

    beforeEach(function() {
        gd = createGraphDiv();
    });

    afterEach(destroyGraphDiv);
    
    it('should be attached to Plotly', function() {
        expect(Plotly.toImage).toBeDefined();
    });
    
    it('should return a promise', function(done) {
        function isPromise(x){
            return !!x.then || typeof x.then === 'function';
        }
        
        var returnValue = Plotly.plot(gd, subplotMock.data, subplotMock.layout)
               .then(Plotly.toImage);
        
        expect(isPromise(returnValue)).toBe(true);
        
        returnValue.then(done);
    });
});