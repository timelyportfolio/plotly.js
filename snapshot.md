# Plotly Snapshots

## Purpose
The purpose of this markdown document is to document exploration of how to best attach the `Plotly.Snapshot.toImage` function to the plot/`div` itself most fully discussed in [issue 83](https://github.com/plotly/plotly.js/issues/83).  Another very nice ability would be to offer resize options for the snapshot.



## Questions
Where do we attach toImage on the graph div?
    Is it _toImage?
    Do we just require /snapshot and bind to `this`?

How do we piggyback on the snapshot button in the toolbar?

How do we ask for new size?


## Thoughts
`Plotly.Snapshot.clone` already has thumbnail ability by specifying [options tileClass:"thumbnail"](https://github.com/plotly/plotly.js/blob/master/src/snapshot/cloneplot.js#L76).


`Plotly.Snapshot.clone` could be used to resize by adding this to `options` when/if we use `Plotly.plot` with our cloned `div`.

