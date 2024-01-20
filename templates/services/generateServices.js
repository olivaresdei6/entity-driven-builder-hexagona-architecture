const fs = require('fs');
const path = require('path');
const { replacePlaceholders } = require('../helpers/replacePlaceHolders');
const { createFile } = require('../helpers/createFile');

const generateServices = (entityName, entityNameSingular, entityNameLowerSingular, routeModule, root_directory) => {
    const templates = {
        'CreateService.txt': `create${entityNameSingular}.service.ts`,
        'DeleteService.txt': `delete${entityNameSingular}.service.ts`,
        'RestoreService.txt': `restore${entityNameSingular}.service.ts`,
        'UpdateService.txt': `update${entityNameSingular}.service.ts`,
        'ExportServicesModule.txt': `${entityNameLowerSingular}Services.module.ts`,
    };
    const routeServicesDir = 'domain/services';
    const outputFilePath = path.join(root_directory, 'src/modules', routeModule, routeServicesDir);
    const routeServicesDirTemplates = path.join(root_directory, 'templates', 'services');

    let fileIndexContent = '';

    for (const [nameTemplateServiceFile, nameServiceFile] of Object.entries(templates)) {
        const templateServiceFile = path.join(routeServicesDirTemplates, nameTemplateServiceFile);
        const templateContent = fs.readFileSync(templateServiceFile, 'utf8');
        const contentFormatted = replacePlaceholders(templateContent, { entityName, entityNameSingular, entityNameLowerSingular });
        createFile(outputFilePath, nameServiceFile, contentFormatted);

        // Se agrega el export al index si no es el archivo de módulo
        if (!nameServiceFile.includes('.module')) {
            fileIndexContent += `export * from './${nameServiceFile.split('.')[0]}.service';\n`;
        }
    }

    // Se crea el index.ts
    createFile(outputFilePath, 'index.ts', fileIndexContent);
};

module.exports = { generateServices };
