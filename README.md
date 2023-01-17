# Gradient Color Generator

This module allows you to get a gradient color based on iven colors and their percents.

The function takes two arguments, ie, `number` and `max` where `max` creates a range from `0-max` and `number` should be a value in that range.

## Usuage

You need to pass an array with multiple color values and their percents (optional) to the function. These values can be send in following formats:

```javascript
[
	"#ff00ff",
	"fff",
	["FF00FF", 10],
	["#AAA", 10],
	[255, 255, 255, 10],
	[170, 170, 170],
];
```

The function will return a function which will need the `number` and `max` values as discussed above.
