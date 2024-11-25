import fs from "fs";

const input = fs.readFileSync("./06/input.txt").toString();

const lines = input.split('\n');

const time = parseInt(lines.shift().match(new RegExp(`\\d+`, 'g')).join(''));
const distance = parseInt(lines.shift().match(new RegExp(`\\d+`, 'g')).join(''));

console.log('times:', time);
console.log('distances:', distance);

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

const race = new Race(1, time, distance);

console.log('race:', race);
