import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const lines = input.split('\n');

const times = lines.shift().match(new RegExp(`\\d+`, 'g')).map(Number);
const distances = lines.shift().match(new RegExp(`\\d+`, 'g')).map(Number);

console.log('times:', times);
console.log('distances:', distances);

class Race {
	constructor(number, time, distanceRecord) {
		this.number = number;
		this.time = time;
		this.distanceRecord = distanceRecord;
		this.waysToWin = this.waysToWin();
	}

	testSpeed(speed) {
		const remainingTime = this.time - speed;
		const distance = speed * remainingTime;
		return distance;
	}

	testEachSpeeds() {
		let distances = [];
		for(let speed = 1; speed < this.time; speed++) {
			distances.push(this.testSpeed(speed));
		}
		return distances;
	}

	waysToWin() {
		const distances = this.testEachSpeeds();
		const waysToWin = distances.filter(distance => distance > this.distanceRecord).length;
		this.waysToWin = waysToWin;
		return waysToWin;
	}
}

let races = [];

times.forEach((time, i) => {
	const distance = distances[i];
	races.push(new Race(i+1, time, distance));
});

const res = races.reduce((prev, curr) => (typeof prev === 'object') ? prev.waysToWin * curr.waysToWin :  prev * curr.waysToWin);

console.log('res:', res);
