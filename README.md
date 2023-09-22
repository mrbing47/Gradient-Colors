# Gradient Color Generator

This module allows you to get a gradient color based on the given colors and their percents.

The function takes two arguments, i.e., `number` and `max`, where `max` creates a range from `0 - max`, and `number` should be a value in that range.

## Usage

You need to pass an array with multiple color values and their percents (optional) to the function. These values can be sent in the following formats:

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

The color-accepting function will return another function that will need the `number` and `max` values as discussed above.
