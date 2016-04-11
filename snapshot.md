# Plotly Snapshots

## Purpose
The purpose of this markdown document is to document exploration of how to best attach the `Plotly.Snapshot.toImage` function to the plot/`div` itself most fully discussed in [issue 83](https://github.com/plotly/plotly.js/issues/83).  Another very nice ability would be to offer resize options for the snapshot.



## Questions
Where do we attach toImage on the graph div?
    Is it _toImage?
    Do we just require /snapshot and bind to `this`?
    
Will any of the chart types require special snapshot abilities or features?
    
What is the expected use case of our new ability?

How do we piggyback on the snapshot button in the toolbar?

How do we ask for new size?

Are there reference points from other libraries that we could mimic or learn from?


## Thoughts

- `Plotly.Snapshot.clone` could be used to resize by adding this to `options` when/if we use `Plotly.plot` with our cloned `div`.  We could also dynamically show a resulting view in a modal or something similar and adjust with `Plotly.relayout`.

- `Plotly.Snapshot.clone` by default sets `staticPlot:true` in `config`.

- A very basic way to attach this assuming there is a modebar would be to do something like this.  See [codepen](http://codepen.io/timelyportfolio/pen/ZWvyYM).
```
gd._toImage = function(){
  this._fullLayout._modeBar.buttons.filter(
    function(btn){return btn[0].name==="toImage"
  })[0][0].click(this)
}
```

- `Plotly.Snapshot.clone` already has thumbnail ability by specifying [options tileClass:"thumbnail"](https://github.com/plotly/plotly.js/blob/master/src/snapshot/cloneplot.js#L76) for the specific thumbnail use case.



- Quick code to experiment from R
```
library(plotly)

ggplotly(ggplot(cars,aes(speed,dist))+geom_point())
```