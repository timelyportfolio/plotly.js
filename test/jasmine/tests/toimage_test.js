// move toimage to plot_api_test.js
//  once established and confirmed

var Plotly = require('@lib/index');
var createGraphDiv = require('../assets/create_graph_div');
var destroyGraphDiv = require('../assets/destroy_graph_div');
var subplotMock = require('../../image/mocks/multiple_subplots.json');
var plot3dMock = require('../../image/mocks/gl3d_bunny.json');


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
        function isPromise(x) {
            return !!x.then || typeof x.then === 'function';
        }

        var returnValue = Plotly.plot(gd, subplotMock.data, subplotMock.layout)
               .then(Plotly.toImage);

        expect(isPromise(returnValue)).toBe(true);

        returnValue.then(done);
    });

    it('should throw error with unsupported file type', function(done) {
        // error should actually come in the svgToImg step

        Plotly.plot(gd, subplotMock.data, subplotMock.layout)
            .then(function(gd) {
                Plotly.toImage(gd, {format: 'x'}).catch(function(err) {
                    expect(err.message).toEqual('Image format is not jpeg, png or svg');
                    done();
                });
            });

    });

    it('should throw error with height and width < 1', function(done) {
        // let user know that Plotly expects pixel values
        Plotly.plot(gd, subplotMock.data, subplotMock.layout)
            .then(function(gd) {
                Plotly.toImage(gd, {height: 0.5}).catch(function(err){
                    expect(err.message).toEqual('Height and width should be pixel values.');
                    done();
                });
            });
    });

    it('should create img with proper height and width', function(done) {
        var img = document.createElement('img');

        // specify height and width
        subplotMock.layout.height = 600;
        subplotMock.layout.width = 700;

        Plotly.plot(gd, subplotMock.data, subplotMock.layout).then(function(gd) {
            return Plotly.toImage(gd);
        }).then(function(url) {
            img.src = url;
            expect(img.height).toBe(600);
            expect(img.width).toBe(700);
            // now provide height and width in opts
            return Plotly.toImage(gd, {height: 400, width: 400});
        }).then(function(url) {
            img.src = url;
            expect(img.height).toBe(400);
            expect(img.width).toBe(400);
            done();
        });
    });

    it('should create proper file type', function(done) {
        var plot = Plotly.plot(gd, subplotMock.data, subplotMock.layout);

        plot.then(function(gd) {
            return Plotly.toImage(gd, {format: 'png'});
        }).then(function(url) {
            expect(url.substr(0,15)).toBe('data:image/png;');
            // now do jpeg
            return Plotly.toImage(gd, {format: 'jpeg'});
        }).then(function(url) {
            expect(url.substr(0,16)).toBe('data:image/jpeg;');
            // now do webp
            return Plotly.toImage(gd, {format: 'webp'});
        }).then(function(url) {
            expect(url.substr(0,16)).toBe('data:image/webp;');
            // now do svg
            return Plotly.toImage(gd, {format: 'svg'});
        }).then(function(url) {
            expect(url.substr(1,3)).toBe('svg');
            done();
        });
    });
});
