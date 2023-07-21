const fs = require('fs');

function readJsonFromFile(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading JSON from file:', error.message);
        return null;
    }
}

function compareJsonProperties(json1, json2, ignoreProperties = []) {
    const properties1 = Object.keys(json1).filter(prop => !ignoreProperties.includes(prop)).sort();
    const properties2 = Object.keys(json2).filter(prop => !ignoreProperties.includes(prop)).sort();

    if (JSON.stringify(properties1) !== JSON.stringify(properties2)) {
        console.log('JSON properties are different.');
        return;
    }

    for (const property of properties1) {
        const value1 = json1[property];
        const value2 = json2[property];

        if (typeof value1 === 'object' && typeof value2 === 'object') {
            // Recursively compare nested objects
            compareJsonProperties(value1, value2, ignoreProperties);
        } else if (JSON.stringify(value1) !== JSON.stringify(value2)) {
            console.log(`Property '${property}' values are different:`);
            console.log('Value in JSON 1:', value1);
            console.log('Value in JSON 2:', value2);
            process.exit(1);
        }
    }
}

// Get the command-line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node scriptName.js path/to/first.json path/to/second.json [propertyToIgnore1 propertyToIgnore2 ...]');
} else {
    const filePath1 = args[0];
    const filePath2 = args[1];
    const ignoreProperties = args.slice(2);

    const json1 = readJsonFromFile(filePath1);
    const json2 = readJsonFromFile(filePath2);

    if (json1 && json2) {
        compareJsonProperties(json1, json2, ignoreProperties);
    }
}
