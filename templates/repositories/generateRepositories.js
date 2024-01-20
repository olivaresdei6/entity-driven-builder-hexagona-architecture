const fs = require('fs');
const path = require('path');
const { replacePlaceholders } = require('../helpers/replacePlaceHolders');
const { createFile } = require('../helpers/createFile');

const generateRepositories = (entityName, entityNameSingular, entityNameLowerSingular, routeModule, root_directory, routeEntity) => {
    const templates = {
        'CreateRepository.txt': `create${entityNameSingular}.repository.ts`,
        'FindByRepository.txt': `findBy${entityNameSingular}.repository.ts`,
        'FindOneRepository.txt': `findOne${entityNameSingular}.repository.ts`,
        'UpdateRepository.txt': `update${entityNameSingular}.repository.ts`,
        'ExportRepositoriesModule.txt': `${entityNameLowerSingular}Repositories.module.ts`,
    };
    const routeRepositoriesDir = 'infrastructure/repositories';
    const outputFilePath = path.join(root_directory, 'src/modules', routeModule, routeRepositoriesDir);
    const routeRepositoriesDirTemplates = path.join(root_directory, 'templates', 'repositories');

    let fileIndexContent = '';

    for (const [nameTemplateRepositoryFile, nameRepositoryFile] of Object.entries(templates)) {
        const templateRepositoryFile = path.join(routeRepositoriesDirTemplates, nameTemplateRepositoryFile);
        const templateContent = fs.readFileSync(templateRepositoryFile, 'utf8');
        const contentFormatted = replacePlaceholders(templateContent, { entityName, entityNameSingular, entityNameLowerSingular, routeEntity });
        createFile(outputFilePath, nameRepositoryFile, contentFormatted);

        // Se agrega el export al index si no es el archivo de módulo
        if (!nameRepositoryFile.includes('.module')) {
            fileIndexContent += `export * from './${nameRepositoryFile.split('.')[0]}.repository';\n`;
        }
    }

    // Se crea el index.ts
    createFile(outputFilePath, 'index.ts', fileIndexContent);
};

module.exports = { generateRepositories };
