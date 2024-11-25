import fs from "fs";

const input = fs.readFileSync("./05/input.txt").toString();

const input2 = 
`seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;


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
const seeds = extractSection(input, "seeds")[0];
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

function sourceToDestination(entry, mapObject) {
	let destination = entry;
	mapObject.forEach((line) => {
		if(entry >= line.source && entry < line.source + line.range) {
			destination = line.destination + (entry - line.source);
		}
	});
	return destination;
}

const seedToSoilObject = mapToObjects(seedToSoil);
const soilToFertilizerObject = mapToObjects(soilToFertilizer);
const fertilizerToWaterObject = mapToObjects(fertilizerToWater);
const waterToLightObject = mapToObjects(waterToLight);
const lightToTemperatureObject = mapToObjects(lightToTemperature);
const temperatureToHumidityObject = mapToObjects(temperatureToHumidity);
const humidityToLocationObject = mapToObjects(humidityToLocation);

const locations = [];

seeds.forEach((seed, i) => {
	let soil = sourceToDestination(seed, seedToSoilObject);
	let fertilizer = sourceToDestination(soil, soilToFertilizerObject);
	let water = sourceToDestination(fertilizer, fertilizerToWaterObject);
	let light = sourceToDestination(water, waterToLightObject);
	let temperature = sourceToDestination(light, lightToTemperatureObject);
	let humidity = sourceToDestination(temperature, temperatureToHumidityObject);
	let location = sourceToDestination(humidity, humidityToLocationObject);
	console.log('Seed, soil, fertilizer, water, light, temperature, humidity, location:', seed, soil, fertilizer, water, light, temperature, humidity, location);
	
	locations.push(location);
});

console.log('Lowest location:', locations.sort((a, b) => a - b)[0]);