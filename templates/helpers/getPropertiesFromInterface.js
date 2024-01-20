const fs = require('fs');
const path = require('path');

const getPropertiesFromInterface = (rootDirectory, routeModule, entityNameLowerSingular) => {
    let interfaceProperties = [];

    const routeInterface = path.join(
        rootDirectory,
        'src/modules',
        routeModule,
        'domain/interfaces/models',
        `${entityNameLowerSingular}.interface.ts`,
    );
    const interfaceContent = fs.readFileSync(routeInterface, 'utf8').split('\n');
    interfaceContent.forEach((line) => {
        const propertyPattern = /^\s+(\w+)(\??):\s+(\w+);/;
        const match = line.match(propertyPattern);

        if (match) {
            const propertyName = match[1];
            const isOptional = match[2] === '?';
            const propertyType = match[3];

            interfaceProperties.push({
                name: propertyName,
                typePrimitive: propertyType,
                isOptional: isOptional,
            });
        }
    });

    return interfaceProperties;
};

module.exports = { getPropertiesFromInterface };
