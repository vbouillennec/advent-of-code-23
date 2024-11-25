import fs from "fs";

const input = fs.readFileSync("./04/input.txt").toString();

const input2 = 
`Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const cardRows = input.split("\n");

let sum = 0;

let cardsAmount = {};

cardRows.forEach((cardRow, index) => {
	const cardNumber = index+1;
	if(!cardsAmount[cardNumber]) {
		cardsAmount[cardNumber] = 1;
	} else {
		cardsAmount[cardNumber]++;
	}
	const card = cardRow.split(": ");
	const numbers = card[1].split(" | ");
	const winningNumbers = numbers[0].match(/([0-9]+)/g);
	const numbersPlayed = numbers[1].match(/([0-9]+)/g);
	let winningPlayed = numbersPlayed.filter((numberPlayed) => {
		return winningNumbers.find(winningNumber => winningNumber === numberPlayed);
	});

	// console.log(cardsAmount[cardNumber]);
	for(let j = 0; j < cardsAmount[cardNumber]; j++) {
		for(let i = 1; i <= winningPlayed.length; i++) {
			if(!cardsAmount[cardNumber+i]) {
				cardsAmount[cardNumber+i] = 1;
			} else {
				cardsAmount[cardNumber+i]++;
			}
		}
		// console.log(cardsAmount);
	}
	
	sum += cardsAmount[cardNumber];
});

console.log(sum);
// console.log(sum);