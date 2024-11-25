import fs from "fs";

const input = fs.readFileSync("./05/input.txt").toString();

function extractSection(input, sectionName) {
	const section = input.match(new RegExp(`${sectionName}:([0-9\\s]+)+`, 'g'));
	if(section) {
		return section[0]
			.replace(`${sectionName}:`, '') // Retirer le nom de la section
            .trim() // Retirer les espaces superflus
            .split('\n') // Diviser en lignes
            .map(line => line.split(' ').map(Number)); // Diviser chaque ligne en nombres
    }
	return [];
}

function extractSeedRange(input) {
	const seeds = input.match(new RegExp(`seeds: ([0-9\\s]+)+`, 'g'));
	if(seeds) {
		let start;
		return seeds[0]
			.replace(`seeds:`, '') // Retirer le nom de la section
            .trim() // Retirer les espaces superflus
            .split(' ') // Diviser en lignes
            .map(Number)
			.map((number, i) => {
				if(i%2 !== 0) {
					return {'start': start, 'range': number};
				}
				start = number;
			})
			.filter((v) => v);
    }
	return [];
}

const seedRanges = extractSeedRange(input);
const seedToSoil = extractSection(input, "seed-to-soil map");
const soilToFertilizer = extractSection(input, "soil-to-fertilizer map");
const fertilizerToWater = extractSection(input, "fertilizer-to-water map");
const waterToLight = extractSection(input, "water-to-light map");
const lightToTemperature = extractSection(input, "light-to-temperature map");
const temperatureToHumidity = extractSection(input, "temperature-to-humidity map");
const humidityToLocation = extractSection(input, "humidity-to-location map");

function mapToObjects(map) {
	return map.map((line) => {
		return {'source': line[1], 'destination': line[0], 'range': line[2]};
	});
}

function sourceToDestination(source, mapObject) {
	let destination = source;
	mapObject.forEach((line) => {
		if(source >= line.source && source < line.source + line.range) {
			destination = line.destination + (source - line.source);
		}
	});
	return destination;
}

function destinationToSource(destination, mapObject) {
	let source = destination;
	mapObject.forEach((line) => {
		if(destination >= line.destination && destination < line.destination + line.range) {
			source = destination - (line.destination - line.source);
		}
	});
	return source;
}

function checkSeedExists(seed, seedRanges) {
	return seedRanges.some((seedRange) => (seed >= seedRange.start) && (seed < seedRange.start + seedRange.range));
}

const seedToSoilObject = mapToObjects(seedToSoil);
const soilToFertilizerObject = mapToObjects(soilToFertilizer);
const fertilizerToWaterObject = mapToObjects(fertilizerToWater);
const waterToLightObject = mapToObjects(waterToLight);
const lightToTemperatureObject = mapToObjects(lightToTemperature);
const temperatureToHumidityObject = mapToObjects(temperatureToHumidity);
const humidityToLocationObject = mapToObjects(humidityToLocation);

const locations = [];
const totalOfSeeds = seedRanges.reduce((acc, seedRange) => acc + seedRange.range, 0);
console.log('totalOfSeeds:', totalOfSeeds);
let location = totalOfSeeds;
let seedExists = false;
while(!seedExists && location <= totalOfSeeds + 1000) {
	let humidity = destinationToSource(location, humidityToLocationObject);
	let temperature = destinationToSource(humidity, temperatureToHumidityObject);
	let light = destinationToSource(temperature, lightToTemperatureObject);
	let water = destinationToSource(light, waterToLightObject);
	let fertilizer = destinationToSource(water, fertilizerToWaterObject);
	let soil = destinationToSource(fertilizer, soilToFertilizerObject);
	let seed = destinationToSource(soil, seedToSoilObject);
	// console.log('Seed, soil, fertilizer, water, light, temperature, humidity, location:', seed, soil, fertilizer, water, light, temperature, humidity, location);
	console.log('Location, seed:', location, seed);
	seedExists = checkSeedExists(seed, seedRanges);
	if(seedExists) {
		console.log('Seed exists:', seed);
		console.log('Location:', location);
		break;
	}
	location++;
	// break;
}

// seedRanges.forEach((seedRange, i) => {
// 	let seed = seedRange.start;
// 	let lastSeedOfRange = seedRange.start + seedRange.range - 1;
// 	while(seed <= lastSeedOfRange) {
// 		let soil = sourceToDestination(seed, seedToSoilObject);
// 		let fertilizer = sourceToDestination(soil, soilToFertilizerObject);
// 		let water = sourceToDestination(fertilizer, fertilizerToWaterObject);
// 		let light = sourceToDestination(water, waterToLightObject);
// 		let temperature = sourceToDestination(light, lightToTemperatureObject);
// 		let humidity = sourceToDestination(temperature, temperatureToHumidityObject);
// 		let location = sourceToDestination(humidity, humidityToLocationObject);
// 		// console.log('Seed, soil, fertilizer, water, light, temperature, humidity, location:', seed, soil, fertilizer, water, light, temperature, humidity, location);
		
// 		locations.push(location);
// 		seed++;
// 	}
// });

// console.log('Lowest location:', locations.sort((a, b) => a - b)[0]);