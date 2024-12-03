import fs from "fs";

const input = fs.readFileSync("./08/input.txt").toString();

const getNextPosition = (instruction, nextNode) => {
	if(instruction === 'L') {
		return nextNode.left;
	} else if(instruction === 'R') {
		return nextNode.right;
	}
}

const getStartPositions = (nodes) => {
	const positions = nodes.keys();
	const currentPositions = [];
	for(const position of positions) {
		if(position.endsWith('A')) currentPositions.push(position);
	}
	return currentPositions;
}

const printProgression = (steps, bestSteps) => {
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(`Step: ${steps} Number of ending Z: ${bestSteps}`);
}

const dividedInput = input.split('\r\n\r\n');
const instructions = dividedInput.at(0).split('');

const regExp = /(\w+) = \((\w+), (\w+)\)/g;
const network = dividedInput.at(1).matchAll(regExp);

const nodes = new Map();
for(const node of network) {
	nodes.set(node.at(1), {left: node.at(2), right: node.at(3)});
}

let currentPositions = getStartPositions(nodes);

let steps = 0;
let bestSteps = 0;
while(!currentPositions.every((currPos) => currPos.endsWith('Z'))) {
	for(let i = 0; i < instructions.length; i++) {
		for(let j = 0; j < currentPositions.length; j++) {
			currentPositions[j] = getNextPosition(instructions[i], nodes.get(currentPositions[j]));
		}
		// console.log({currentPositions});
		steps++;
		if(currentPositions.filter((currPos) => currPos.endsWith('Z')).length >= bestSteps){
			bestSteps++;
		};
		if(currentPositions.every((currPos) => currPos.endsWith('Z'))){
			console.log('every positions ends with Z: ', {currentPositions});
			break;
		}
		printProgression(steps, bestSteps);

	}
}

console.log({steps});
