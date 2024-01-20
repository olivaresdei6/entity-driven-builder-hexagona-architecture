const fs = require('fs');
const path = require('path');
const { replacePlaceholders } = require('../helpers/replacePlaceHolders');
const { createFile } = require('../helpers/createFile');

const generateAbstractClass = (entityName, entityNameSingular, entityNameLowerSingular, routeModule, root_directory) => {
    const templates = {
        'CreateTemplate.txt': `create${entityNameSingular}.abstract.ts`,
        'FindByTemplate.txt': `findBy${entityNameSingular}.abstract.ts`,
        'FindOneTemplate.txt': `findOne${entityNameSingular}.abstract.ts`,
        'UpdateTemplate.txt': `update${entityNameSingular}.abstract.ts`,
    };
    const routeAbstractDir = 'domain/abstract';
    const outputFilePath = path.join(root_directory, 'src/modules', routeModule, routeAbstractDir);
    const routeAbstractDirTemplates = path.join(root_directory, 'templates', 'abstract');

    let fileIndexContent = '';

    for (const [nameTemplateRepositoryAbstractFile, nameAbstractRepositoryFile] of Object.entries(templates)) {
        const templateRepositoryAbstractFile = path.join(routeAbstractDirTemplates, nameTemplateRepositoryAbstractFile);
        const templateContent = fs.readFileSync(templateRepositoryAbstractFile, 'utf8');
        const contentFormatted = replacePlaceholders(templateContent, { entityName, entityNameSingular, entityNameLowerSingular });
        createFile(outputFilePath, nameAbstractRepositoryFile, contentFormatted);

        // Se agrega el export al index
        fileIndexContent += `export * from './${nameAbstractRepositoryFile.split('.')[0]}.abstract';\n`;
    }

    // Se crea el index.ts
    createFile(outputFilePath, 'index.ts', fileIndexContent);
};

module.exports = {
    generateAbstractClass,
};
