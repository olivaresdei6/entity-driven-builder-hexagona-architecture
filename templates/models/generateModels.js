const fs = require('fs');
const path = require('path');
const { createFile } = require('../helpers/createFile');
const { getPropertiesFromInterface } = require('../helpers/getPropertiesFromInterface');
const { getContentModel } = require('./helpers/getContentModel');
const { getImportsVoAndPropertiesForModel } = require('./helpers/getImportsVoAndAttributesForModel');

const generateModel = (rootDirectory, entityNameSingular, entityNameLowerSingular, routeModule) => {
    const interfaceProperties = getPropertiesFromInterface(rootDirectory, routeModule, entityNameLowerSingular);
    const { modelAttributes, importStatements } = getImportsVoAndPropertiesForModel(interfaceProperties);
    const modelContent = getContentModel(modelAttributes, importStatements, entityNameSingular, entityNameLowerSingular);
    // Escribir el archivo de modelo
    const routeModel = path.join(rootDirectory, 'src/modules', routeModule, 'domain/models');
    createFile(routeModel, `${entityNameLowerSingular}.model.ts`, modelContent);

    // Crear el archivo index.ts en domain/models
    const indexExportsModels = `export * from './${entityNameLowerSingular}.model';\n`;
    const indexModelsPath = path.join(rootDirectory, 'src/modules', routeModule, 'domain/models');
    createFile(indexModelsPath, 'index.ts', indexExportsModels);
};

module.exports = { generateModel };
