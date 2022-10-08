/* TODO: 
	1. Add percentage compatibility, like ["ff00ff", 40]
	2. Verifation for percentages
	3. add compatibility for 3 character hex color, like #afa, #000
	4. Add compatibility for array hex color, like [[200,225,220], [10,255,255]]
	4. Verification of color hex input
*/

const toHex = (color) => {
	if (Math.abs(color) < 256)
		return Math.abs(color).toString(16).padStart(2, "0");
	throw new Error("Invalid Color Number: " + color);
};

const getGradient = (gradient_colors) => {
	if (gradient_colors == [])
		throw new Error("Must pass colors for gradient.");
	const original_colors = [...gradient_colors];

	gradient_colors = gradient_colors.map((color) =>
		color.startsWith("#") ? color.slice(1) : color
	);

	gradient_colors = gradient_colors.map((color) => [
		parseInt(color.substring(0, 2), 16),
		parseInt(color.substring(2, 4), 16),
		parseInt(color.substring(4, 6), 16),
	]);

	const section_length = 1 / (gradient_colors.length - 1);

	const return_func = (number, max) => {
		if (!(number >= 0 && number <= 1) && !max) {
			throw new Error(
				"Number is greater than 1 without value of max."
			);
		}

		let ratio = number >= 0 && number <= 1 ? number : number / max;
		let start_color = "";
		let end_color = "";

		for (let i = 0; i < gradient_colors.length - 1; i++)
			if (
				ratio >= section_length * i &&
				ratio <= section_length * (i + 1)
			) {
				start_color = gradient_colors[i];
				end_color = gradient_colors[i + 1];
				ratio = ratio * (gradient_colors.length - 1) - i;
				break;
			}

		const r = Math.ceil(
			end_color[0] * ratio + start_color[0] * (1 - ratio)
		);
		const g = Math.ceil(
			end_color[1] * ratio + start_color[1] * (1 - ratio)
		);
		const b = Math.ceil(
			end_color[2] * ratio + start_color[2] * (1 - ratio)
		);

		return toHex(r) + toHex(g) + toHex(b);
	};

	return_func.colors = original_colors;

	return return_func;
};

const red_green = getGradient(["00ff00", "ff0000"]);

console.log(red_green.colors);
