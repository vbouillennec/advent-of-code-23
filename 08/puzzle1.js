import fs from "fs";

const input = fs.readFileSync("./08/input.txt").toString();

const getNextPosition = (instruction, nextNode) => {
	if(instruction === 'L') {
		return nextNode.left;
	} else if(instruction === 'R') {
		return nextNode.right;
	}
}

const dividedInput = input.split('\r\n\r\n');
const instructions = dividedInput.at(0).split('');
const regExp = /(\w+) = \((\w+), (\w+)\)/g;
const network = dividedInput.at(1).matchAll(regExp);

const nodes = new Map();
for(const node of network) {
	nodes.set(node.at(1), {left: node.at(2), right: node.at(3)});
}

let currentPosition = 'AAA';
let steps = 0;
while(currentPosition !== 'ZZZ') {
	for(let i = 0; i < instructions.length; i++) {
		currentPosition = getNextPosition(instructions[i], nodes.get(currentPosition));
		steps++;
	}
}

console.log({steps});


