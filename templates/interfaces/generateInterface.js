const fs = require('fs');
const path = require('path');
const { createFile } = require('../helpers/createFile');

const generateInterface = (rootDirectory, routeEntity, entityName, entityNameSingularLower, entityNameSingular, routeModule) => {
    const entityFilePath = path.join(
        rootDirectory,
        'src/integrations/dbManager/infrastructure/entities',
        routeEntity,
        `${entityName[0].toLowerCase()}${entityName.slice(1)}.entity.ts`,
    );
    const entityContent = fs.readFileSync(entityFilePath, 'utf8').split('\n');
    let interfaceProperties = [];
    let previousLine = '';

    entityContent.forEach((line, index) => {
        line = line.trim();

        // Verificar si la línea actual es un salto de línea y la anterior es una definición de propiedad
        if (line === '' && previousLine.includes(':')) {
            let parts = previousLine.split(':');
            let propertyName = parts[0].trim().replace('!', '');
            let propertyType = parts[1].split(';')[0].trim();
            // Si la propiedad es un arreglo, no se agrega la propiedad
            if (!propertyType.includes('[]')) {
                interfaceProperties.push(`    ${propertyName}: ${propertyType};`);
            }
        }

        previousLine = line;
    });

    const routeInterface = path.join(rootDirectory, 'src/modules', routeModule, 'domain/interfaces/models');
    const nameInterfaceFile = `${entityNameSingularLower}.interface.ts`;

    const interfaceContent = `import { IAbstractEntity } from 'src/core/interfaces';\n\nexport interface I${entityNameSingular} extends IAbstractEntity {\n${interfaceProperties.join(
        '\n',
    )}\n}`;
    createFile(routeInterface, nameInterfaceFile, interfaceContent);

    // Se crea el index.ts
    const contentIndex = `export * from './${entityNameSingularLower}.interface';`;
    const nameIndexFile = 'index.ts';

    createFile(routeInterface, nameIndexFile, contentIndex);
};

module.exports = {
    generateInterface,
};
