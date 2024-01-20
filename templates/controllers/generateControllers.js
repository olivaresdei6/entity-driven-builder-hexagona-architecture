const fs = require('fs');
const path = require('path');
const { replacePlaceholders } = require('../helpers/replacePlaceHolders');
const { createFile } = require('../helpers/createFile');

const generateControllers = (entityName, entityNameSingular, entityNameLowerSingular, routeEntity, routeModule, root_directory) => {
    const templates = {
        'CreateController.txt': `create${entityNameSingular}.controller.ts`,
        'DeleteController.txt': `delete${entityNameSingular}.controller.ts`,
        'FindAllController.txt': `findAll${entityNameSingular}.controller.ts`,
        'FindByController.txt': `findBy${entityNameSingular}.controller.ts`,
        'RestoreController.txt': `restore${entityNameSingular}.controller.ts`,
        'UpdateController.txt': `update${entityNameSingular}.controller.ts`,
        'ExportControllersModule.txt': `${entityNameLowerSingular}Controllers.module.ts`,
    };
    const routeControllersDir = 'application/controllers';
    const outputFilePath = path.join(root_directory, 'src/modules', routeModule, routeControllersDir);
    const routeControllersDirTemplates = path.join(root_directory, 'templates', 'controllers');

    let fileIndexContent = '';

    for (const [nameTemplateControllerFile, nameControllerFile] of Object.entries(templates)) {
        const templateControllerFile = path.join(routeControllersDirTemplates, nameTemplateControllerFile);
        const templateContent = fs.readFileSync(templateControllerFile, 'utf8');
        const contentFormatted = replacePlaceholders(templateContent, { entityName, entityNameSingular, entityNameLowerSingular, routeEntity });
        createFile(outputFilePath, nameControllerFile, contentFormatted);

        if (!nameControllerFile.includes('.module')) {
            fileIndexContent += `export * from './${nameControllerFile.split('.')[0]}.controller';\n`;
        }
    }

    createFile(outputFilePath, 'index.ts', fileIndexContent);
};

module.exports = { generateControllers };
