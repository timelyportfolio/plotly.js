var Plotly = require('@lib/index');

var createGraphDiv = require('../assets/create_graph_div');
var destroyGraphDiv = require('../assets/destroy_graph_div');

function failBecause(message) {
    return function() {
        expect(message).toBe(true);
        return Promise.resolve();
    };
}

describe('Test keyframe api', function() {
    'use strict';

    var plot, gd, mock;

    beforeEach(function(done) {
        mock = [{x: [1, 2, 3], y: [2, 1, 3]}, {x: [1, 2, 3], y: [6, 4, 5]}];
        gd = createGraphDiv();
        Plotly.plot(gd, mock).then(done);
    });

    afterEach(destroyGraphDiv);

    describe('the default keyframe', function() {
        it('is named "default"', function() {
            expect(Object.keys(gd._keyframes)).toEqual(['default']);
        });

        it('is selected', function() {
            expect(gd._currentKeyframe).toEqual('default');
        });

        it('has basic structure', function() {
            expect(gd._keyframes.default.layout).toEqual({});
            expect(gd._keyframes.default.traces).toBeNull();
            expect(gd._keyframes.default.baseKeyframe).toBeNull();
            expect(gd._keyframes.default.data).toEqual([]);
        });
    });

    describe('createKeyframe', function() {
        it('creates a keyframe', function(done) {
            Plotly.createKeyframe(gd, 'keyframe1').then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();

                return Plotly.Queue.undo(gd);
            }).then(function() {
                expect(gd._keyframes.keyframe1).toBeUndefined();

                return Plotly.Queue.redo(gd);
            }).then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();
            }).then(done);
        });

        it('deletes a keyframe', function(done) {
            Plotly.createKeyframe(gd, 'keyframe1').then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();

                return Plotly.deleteKeyframe(gd, 'keyframe1');
            }).then(function() {
                expect(gd._keyframes.keyframe1).toBeUndefined();

                return Plotly.Queue.undo(gd);
            }).then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();

                return Plotly.Queue.redo(gd);
            }).then(function() {
                expect(gd._keyframes.keyframe1).toBeUndefined();
            }).then(done);
        });

        it('fails to create a keyframe twice', function(done) {
            Plotly.createKeyframe(gd, 'keyframe1').then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();
                return Plotly.createKeyframe(gd, 'keyframe1');
            }).then(failBecause('create keyframe should not have succeeded')).then(done, done);
        });

        it("fails to delete a keyframe that doesn't exist", function(done) {
            Plotly.deleteKeyframe(gd, 'keyframe1').then(
                failBecause('delete should not have succeeded')
            ).then(done, done);
        });

        it('renames a keyframe', function(done) {
            Plotly.createKeyframe(gd, 'keyframe1').then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();

                return Plotly.renameKeyframe(gd, 'keyframe1', 'keyframe2');
            }).then(function() {
                expect(gd._keyframes.keyframe1).toBeUndefined();
                expect(gd._keyframes.keyframe2).not.toBeUndefined();

                return Plotly.Queue.undo(gd);
            }).then(function() {
                expect(gd._keyframes.keyframe1).not.toBeUndefined();
                expect(gd._keyframes.keyframe2).toBeUndefined();

                return Plotly.Queue.redo(gd);
            }).then(function() {
                expect(gd._keyframes.keyframe1).toBeUndefined();
                expect(gd._keyframes.keyframe2).not.toBeUndefined();
            }).then(done);
        });

        describe('modifying keyframes', function() {
            beforeEach(function(done) {
                Plotly.createKeyframe(gd, 'base', {}).then(done);
                Plotly.createKeyframe(gd, 'keyframe1').then(done);
            });

            afterEach(function(done) {
                Plotly.deleteKeyframe(gd, 'base').then(done);
                Plotly.deleteKeyframe(gd, 'keyframe1').then(done);
            });

            it('fails if keyframe not defined', function(done) {
                Plotly.modifyKeyframe(gd, 'invalidKeyframe').then(
                    failBecause('modifying non-existent keyframe should have failed')
                ).then(done, done);
            });

            it('fails if base keyframe not defined', function(done) {
                Plotly.modifyKeyframe(gd, 'keyframe1', {baseKeyframe: 'invalidKeyframe'}).then(
                    failBecause('reference to invalid keyframe should have failed')
                ).then(done, done);
            });

            it('can set baseKeyframe', function(done) {
                Plotly.modifyKeyframe(gd, 'keyframe1', {baseKeyframe: 'base'}).then(function() {
                    expect(gd._keyframes.keyframe1.baseKeyframe).toEqual('base');

                    return Plotly.Queue.undo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.baseKeyframe).toBeNull();

                    return Plotly.Queue.redo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.baseKeyframe).toEqual('base');
                }).then(done);
            });

            it('can set the layout', function(done) {
                var props = {layout: {xaxis: {range: [0, 1]}}};
                Plotly.modifyKeyframe(gd, 'keyframe1', props).then(function() {
                    expect(gd._keyframes.keyframe1.layout).toEqual(props.layout);

                    return Plotly.Queue.undo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.layout).toEqual({});

                    return Plotly.Queue.redo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.layout).toEqual(props.layout);
                }).then(done);
            });

            it('can set the trace indices', function(done) {
                var props = {traces: [0, 1]};
                Plotly.modifyKeyframe(gd, 'keyframe1', props).then(function() {
                    expect(gd._keyframes.keyframe1.traces).toEqual([0, 1]);

                    return Plotly.Queue.undo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.traces).toBeNull();

                    return Plotly.Queue.redo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.traces).toEqual([0, 1]);
                }).then(done);
            });

            it('can set the trace data', function(done) {
                var props = {data: [{x: [1, 2, 3], y: [4, 5, 6]}]};

                Plotly.modifyKeyframe(gd, 'keyframe1', props).then(function() {
                    expect(gd._keyframes.keyframe1.data).toEqual(props.data);

                    return Plotly.Queue.undo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.data).toEqual([]);

                    return Plotly.Queue.redo(gd);
                }).then(function() {
                    expect(gd._keyframes.keyframe1.data).toEqual(props.data);
                }).then(done);
            });
        });

        describe('animating to a keyframe', function() {
            beforeEach(function(done) {
                Promise.all([
                    Plotly.createKeyframe(gd, 'frame1', {data: [{y: [8, 10, 9]}], traces: [0]}),
                    Plotly.createKeyframe(gd, 'frame2', {data: [{y: [6, 4, 5]}], traces: [0]})
                ]).then(done);
            });

            afterEach(function(done) {
                Plotly.deleteKeyframe(gd, 'frame1').then(done);
                Plotly.deleteKeyframe(gd, 'frame2').then(done);
            });

            it('fails if requested keyframe does not exist', function (done) {
                Plotly.animateToKeyframe(gd, 'badKeyframeName').then(
                    failBecause('should not have accepted invalid keyframe name')
                ).then(done, done);
            });

            it('animates to a keyframe', function (done) {
                Plotly.animateToKeyframe(gd, 'frame1').then(function() {
                }).then(done);
            });
        });
    });
});
