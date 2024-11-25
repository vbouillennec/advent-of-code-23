import fs from "fs";

const input = fs.readFileSync("./03/input.txt").toString();

const input2 = 
`467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

let engineRows = input.split("\n");
let array2D = engineRows.map((row) => row.split(""));

let numRegex = new RegExp("[0-9]+", "g");

let rowNumbers = engineRows.map((row, index) => {
	return [...row.matchAll(numRegex)].map((match) => {
		return {pos: match.index, num: match[0]};
	});
});

let addition = 0;
let gearsFinded = [];

rowNumbers.forEach((row, rowIndex) => {
	row.forEach((number) => {
		number.num.split('').forEach((digit, i) => {
			checkAround(rowIndex, number.pos+i, number.num);
		});
	});
});

addGearedNumbers(gearsFinded);

function addGearedNumbers(gearsFinded) {
	let addedGears = {};
	gearsFinded.forEach((gear) => {
		gearsFinded.find((gear2) => {
			if (
				gear.pos === gear2.pos 
				&& gear.num !== gear2.num 
			) {
				addedGears[gear.pos] = [...(addedGears[gear.pos] || []), gear2.num];
			}
		});
	});
	console.log(addedGears);

	Object.keys(addedGears).forEach((key) => {
		let gear = addedGears[key];
		if(gear.length > 1) {
			addition += +gear[0] * +gear[1];
		}
	});
}

function checkAround(row, col, number) {
	checkGear(row+1, col, number);
	checkGear(row-1, col, number);
	checkGear(row, col+1, number);
	checkGear(row, col-1, number);
	checkGear(row+1, col+1, number);
	checkGear(row+1, col-1, number);
	checkGear(row-1, col+1, number);
	checkGear(row-1, col-1, number);
}

function checkGear(row, col, number) {
	if(array2D[row] && array2D[row][col] && array2D[row][col] === '*')
	{
		if(!gearsFinded.find((gear) => gear.pos === `${row},${col}` && gear.num === number)) {
			gearsFinded.push({pos: `${row},${col}`, num: number});
		}
	};
}
console.log('\nsum: ' + addition);
