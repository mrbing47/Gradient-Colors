const toHex = (color) => {
	if (Math.abs(color) < 256)
		return Math.abs(color).toString(16).padStart(2, "0");
	throw new Error("Invalid Color Number: " + color);
};

const isString = (value) => {
	return typeof value === "string" || value instanceof String;
};

const isArray = (ele) => {
	return Array.isArray(ele);
};

const isFloat = (value) => {
	const number = parseFloat(value);
	return !Number.isNaN(number) && number !== Math.ceil(number);
};

const isInt = (value) => {
	return Number.isInteger(value);
};

const convertStringToInt = (color) => {
	color = color.startsWith("#") ? color.slice(1) : color;

	if (color.length !== 3 && color.length !== 6)
		throw new Error(
			"Invalid Hex color, must be either 3 or 6 Hex values."
		);
	const steps = color.length / 3;
	const red = parseInt(
		color.substring(0, 1 * steps) +
			(steps === 1 ? color.substring(0, 1 * steps) : ""),
		16
	);
	const green = parseInt(
		color.substring(1 * steps, 2 * steps) +
			(steps === 1 ? color.substring(1 * steps, 2 * steps) : ""),
		16
	);
	const blue = parseInt(
		color.substring(2 * steps, 3 * steps) +
			(steps === 1 ? color.substring(2 * steps, 3 * steps) : ""),
		16
	);

	if (
		red < 0 ||
		red > 255 ||
		green < 0 ||
		green > 255 ||
		blue < 0 ||
		blue > 255
	)
		throw new Error(
			"Invalid Hex color, must be between 00 and FF."
		);

	return [
		Number.isNaN(red) ? 0 : red,
		Number.isNaN(green) ? 0 : green,
		Number.isNaN(blue) ? 0 : blue,
	];
};

const validatePercent = (prev, percent) => {
	if (percent < 0 || percent > 100)
		throw new Error(
			"Invalid percent, range must be 0-1 or 0-100, received, " +
				percent
		);
	if (percent <= prev * 100)
		throw new Error(
			"Invalid percent, must be smaller than the previous value.\nReceived value: " +
				percent +
				"\nPrevious Value: " +
				prev * 100
		);
	return percent / 100;
};

const getPercent = (section_length, prev) => {
	let curr = 0;
	if (prev >= 0 && prev <= 1)
		curr = prev + section_length > 1 ? 1 : prev + section_length;
	return curr;
};

const normaliseColors = (gradient_colors = []) => {
	if (!isArray(gradient_colors) || gradient_colors.length === 0)
		throw new Error(
			"Argument should be an array and must contain atleast 1 color."
		);

	const section_length = 1 / (gradient_colors.length - 1);
	const result = [];

	const PERCENT_INDEX = 3;

	for (let i = 0; i < gradient_colors.length; i++) {
		if (isString(gradient_colors[i])) {
			result.push([
				...convertStringToInt(gradient_colors[i]),
				getPercent(
					section_length,
					result[i - 1]?.[PERCENT_INDEX]
				),
			]);
		}
		if (isArray(gradient_colors[i])) {
			const color = gradient_colors[i];
			if (color.length > 4 || color.length < 2)
				throw new Error("Invalid format for Array, " + color);

			// console.log("array element", color);
			if (color.length === 2) {
				const hex = color[0];
				let percent = color[1];

				if (!isString(hex) || !isInt(percent))
					throw new Error(
						"Invalid format for hex and percent, " + color
					);

				result.push([
					...convertStringToInt(hex),
					validatePercent(
						result[i - 1]?.[PERCENT_INDEX],
						percent
					),
				]);
			}
			if (color.length === 3) {
				if (color.some((e) => e < 0 || e > 255))
					throw new Error(
						"Invalid Integer color, must be in range of 0-100."
					);

				result.push([
					...color,
					getPercent(
						section_length,
						result[i - 1]?.[PERCENT_INDEX]
					),
				]);
			}
			if (color.length === 4) {
				if (color.some((e) => e < 0 || e > 255))
					throw new Error(
						"Invalid Integer color, must be in range of 0-100."
					);

				result.push([
					...color.slice(0, PERCENT_INDEX),
					validatePercent(
						result[i - 1]?.[PERCENT_INDEX],
						color[PERCENT_INDEX]
					),
				]);
			}
		}
	}

	if (result[0][PERCENT_INDEX] !== 0) {
		result.unshift([...result[0].slice(0, PERCENT_INDEX), 0]);
	}
	if (result.at(-1)[PERCENT_INDEX] !== 1) {
		result.push([...result.at(-1).slice(0, -1), 1]);
	}
	return result;
};

const getGradientColor = (colors = []) => {
	const gradient_colors = normaliseColors(colors);

	const return_func = (number, max) => {
		if (!(number >= 0 && number <= 1) && !max) {
			throw new Error(
				"Number is greater than 1 without value of max."
			);
		}

		let ratio = number > 0 && number < 1 ? number : number / max;
		let start_color = "";
		let end_color = "";
		const PERCENT_INDEX = 3;

		for (let i = 0; i < gradient_colors.length - 1; i++)
			if (
				ratio >= gradient_colors[i][PERCENT_INDEX] &&
				ratio <= gradient_colors[i + 1][PERCENT_INDEX]
			) {
				start_color = gradient_colors[i].slice(0, -1);
				end_color = gradient_colors[i + 1].slice(0, -1);
				ratio =
					(ratio - gradient_colors[i][PERCENT_INDEX]) /
					(gradient_colors[i + 1][PERCENT_INDEX] -
						gradient_colors[i][PERCENT_INDEX]);
				break;
			}

		if (start_color === "" && end_color === "")
			throw new Error(
				"Unable to assign start and end colors for the gradient."
			);

		const r = Math.floor(
			end_color[0] * ratio + start_color[0] * (1 - ratio)
		);

		const g = Math.floor(
			end_color[1] * ratio + start_color[1] * (1 - ratio)
		);
		const b = Math.floor(
			end_color[2] * ratio + start_color[2] * (1 - ratio)
		);
		return "#" + toHex(r) + toHex(g) + toHex(b);
	};

	return_func.colors = gradient_colors;
	return return_func;
};

/*
-- Demo code

const rgb = getGradientColor([
	"#ff0",
	["#fff", 40],
	["#fff", 80],
	["#000", 100],
]);
console.log(rgb.colors);

const chalk = require("chalk");
const max = 100;
let txt = "";
for (let i = 0; i <= max; i++) {
	txt += chalk.hex(rgb(i, max))("*");
}
console.log(txt);

*/

module.exports = getGradientColor;
