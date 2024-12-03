import fs from "fs";

const input = fs.readFileSync("./07/input.txt").toString();

const lines = input.split('\n');

const cardValues = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

class Card {
	constructor(position, value) {
		this.position = position;
		this.value = value;
	}

	toString() {
		return this.value;
	}
}

class HandType {
	constructor(name, strength) {
		this.name = name;
		this.strength = strength;
	}
}

class Hand {
	constructor(id, cards, bid) {
		this.id = id;
		this.cardsString = cards;
		this.cards = cards.split('').map((value, position) => new Card(position, value));
		this.bid = parseInt(bid);
		this.type = this.checkType();
	}

	isFiveOfAKind() {
		return this.cards.find((card) => this.cards.filter(c => c.value === card.value || c.value === 'J').length === 5) !== undefined;
	}

	isFourOfAKind() {
		return this.cards.find((card) => this.cards.filter(c => c.value === card.value || c.value === 'J').length === 4) !== undefined;
	}

	isFullHouse() {
		let threeOfAKind = '';
		let pair = '';
		this.cards.forEach(card => {
			if (
				threeOfAKind === '' && 
				card.value !== 'J' && 
				this.cards.filter(c => c.value === card.value || c.value === 'J').length === 3
			) {
				threeOfAKind = card.value;
			}
			if (
				pair === '' && 
				card.value !== 'J' && 
				threeOfAKind !== card.value && 
				this.cards.filter(c => c.value === card.value).length === 2
			) {
				pair = card.value;
			}
		});
		return pair !== '' && threeOfAKind !== '';
	}

	isThreeOfAKind() {
		return this.cards.some(card => this.cards.filter(c => c.value === card.value || c.value === 'J').length === 3);
	}

	isTwoPair() {
		let firstPair = '';
		let secondPair = '';
		this.cards.forEach(card => {
			if (this.cards.filter(c => c.value === card.value || card.value === 'J').length === 2) {
				if(firstPair !== '' && firstPair !== card.value) {
					secondPair = card.value;
				} else {
					firstPair = card.value;
				}
			}
		});
		return secondPair !== '';
	}

	isOnePair() {
		return this.cards.some(card => this.cards.filter(c => c.value === card.value || c.value === 'J').length === 2);
	}

	checkType() {
		switch (true) {
			case this.isFiveOfAKind(): return new HandType('Five of a Kind', 7);
			case this.isFourOfAKind(): return new HandType('Four of a Kind', 6);
			case this.isFullHouse(): return new HandType('Full House', 5);
			case this.isThreeOfAKind(): return new HandType('Three of a Kind', 4);
			case this.isTwoPair(): return new HandType('Two Pair', 3);
			case this.isOnePair(): return new HandType('One Pair', 2);
			default: return new HandType('High Card', 1);
		}
	}

	toString() {
		return `\nHand ID: ${this.id}, ${this.cardsString}, bid: ${this.bid}, strength: ${this.type.strength}, type: ${this.type.name}`;
	}
}

function sortHandsByStrength(hands) {
	return hands.sort((a, b) => a.type.strength - b.type.strength);
}

function compareCards(a, b) {
	return cardValues.indexOf(b) - cardValues.indexOf(a);
}

function compareHands(a, b) {
	let compare = 0, i = 0;
	while(compare === 0) {
		compare = compareCards(a.cards[i].value, b.cards[i].value);
		i++;
	}
	return compare;
}

function sortHandsByCardComparison(hands) {
	return hands.sort((a, b) => compareHands(a, b));
}

function handleTie(tieHands) {
	return sortHandsByCardComparison(tieHands);
}

// rank hands by strength of by card comparison
function rankHands(hands) {
	let ignoreIndex = -1;
	const rankedHands =	[];
	sortedHands.forEach((hand, i) => {
		if(i <= ignoreIndex) {
			return;
		}	
		const strength = hand.type.strength;
		const egality = hands.filter(h => h.type.strength === strength);
		if(egality.length === 1) {
			rankedHands.push(hand);
		} 
		else if(egality.length > 1) {
			ignoreIndex = i + (egality.length - 1);
			const ranks = handleTie(egality);
			rankedHands.push(...ranks);
		}
	});
	return rankedHands;
}

/*  Main code */

// Create hands from input
const hands = lines.map((line, ind) => {
	const [cards, bid] = line.split(' ');
	return new Hand(ind, cards, bid.trim());
});

// Sort hands by strength, from lowest to highest
const sortedHands = sortHandsByStrength(hands);

const rankedHands = rankHands(sortedHands);

const totalWinnings = rankedHands.reduce((accumulator, currentValue, rank) => accumulator + currentValue.bid * (rank + 1), 0);

console.log({totalWinnings});