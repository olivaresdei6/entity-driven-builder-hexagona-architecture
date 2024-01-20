const fs = require('fs');
const path = require('path');
const { replacePlaceholders } = require('../helpers/replacePlaceHolders');
const { createFile } = require('../helpers/createFile');

const generateUseCases = (entityName, entityNameSingular, entityNameLowerSingular, routeModule, root_directory) => {
    const templates = {
        'CreateUseCase.txt': `create${entityNameSingular}.useCase.ts`,
        'DeleteUseCase.txt': `delete${entityNameSingular}.useCase.ts`,
        'FindAllUseCase.txt': `findAll${entityNameSingular}.useCase.ts`,
        'FindByUseCase.txt': `findBy${entityNameSingular}.useCase.ts`,
        'RestoreUseCase.txt': `restore${entityNameSingular}.useCase.ts`,
        'UpdateUseCase.txt': `update${entityNameSingular}.useCase.ts`,
        'ExportUseCaseModule.txt': `${entityNameLowerSingular}UseCases.module.ts`,
    };
    const routeUseCasesDir = 'application/useCases';
    const outputFilePath = path.join(root_directory, 'src/modules', routeModule, routeUseCasesDir);
    const routeUseCasesDirTemplates = path.join(root_directory, 'templates', 'useCases');

    let fileIndexContent = '';

    for (const [nameTemplateUseCaseFile, nameUseCaseFile] of Object.entries(templates)) {
        const templateUseCaseFile = path.join(routeUseCasesDirTemplates, nameTemplateUseCaseFile);
        const templateContent = fs.readFileSync(templateUseCaseFile, 'utf8');
        const contentFormatted = replacePlaceholders(templateContent, { entityName, entityNameSingular, entityNameLowerSingular });
        createFile(outputFilePath, nameUseCaseFile, contentFormatted);

        if (!nameUseCaseFile.includes('.module')) {
            fileIndexContent += `export * from './${nameUseCaseFile.split('.')[0]}.useCase';\n`;
        }
    }

    createFile(outputFilePath, 'index.ts', fileIndexContent);
};

module.exports = { generateUseCases };
