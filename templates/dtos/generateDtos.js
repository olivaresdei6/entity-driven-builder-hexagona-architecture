const path = require('path');
const { createFile } = require('../helpers/createFile');
const { getPropertiesFromInterface } = require('../helpers/getPropertiesFromInterface');
const { getContentCreateDto } = require('./helpers/getContentCreateDto');
const { getContentUpdateDto } = require('./helpers/getContentUpdateDto');

const generateDtos = (entityNameSingular, entityNameLowerSingular, routeModule, rootDirectory) => {
    const interfaceProperties = getPropertiesFromInterface(rootDirectory, routeModule, entityNameLowerSingular);
    const contentCreateDto = getContentCreateDto(interfaceProperties, entityNameSingular);
    const contentUpdateDto = getContentUpdateDto(entityNameSingular);

    const routeDtos = path.join(rootDirectory, 'src/modules', routeModule, 'application/dtos');
    createFile(routeDtos, `create${entityNameSingular}.dto.ts`, contentCreateDto);
    createFile(routeDtos, `update${entityNameSingular}.dto.ts`, contentUpdateDto);

    // Crear el archivo index.ts en application/dtos
    const indexExportsModels = `export * from './create${entityNameSingular}.dto';\nexport * from './update${entityNameSingular}.dto';\n`;
    const indexModelsPath = path.join(rootDirectory, 'src/modules', routeModule, 'application/dtos');
    createFile(indexModelsPath, 'index.ts', indexExportsModels);
};

module.exports = { generateDtos };
