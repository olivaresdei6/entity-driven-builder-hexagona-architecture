const fs = require('fs');
const path = require('path');

// Obteniendo argumentos de la línea de comandos
const [, , outputDir, entityRoute, entityNamePlural, entityNameSingular] = process.argv;

// Funciones para reemplazar marcadores de posición
const replacePlaceholders = (template, placeholders) => {
    let content = template;
    for (const [key, value] of Object.entries(placeholders)) {
        const regex = new RegExp(`\\$${key}\\$`, 'g');
        content = content.replace(regex, value);
    }
    return content;
};

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

// Preparar variables
const ENTITY_NAME = entityNamePlural;
const ENTITY_NAME_SINGULAR = entityNameSingular;
const ENTITY_NAME_SINGULAR_LOWER = entityNameSingular.charAt(0).toLowerCase() + entityNameSingular.slice(1);
const ROUTE_ENTITY = entityRoute.replace(/\//g, '/');
const GENERIC_OPTIONS = 'src/integrations/dbManager/domain/types/find'; // Asumiendo que este es el valor correcto

const placeholders = {
    ENTITY_NAME,
    ENTITY_NAME_SINGULAR,
    ENTITY_NAME_SINGULAR_LOWER,
    ROUTE_ENTITY,
    GENERIC_OPTIONS,
};

// Plantillas y nombres de archivos para los repositorios y domain/abstract
const templates = {
    // Repositories
    'CreateRepository.txt': `create${ENTITY_NAME_SINGULAR}.repository.ts`,
    'FindByRepository.txt': `findBy${ENTITY_NAME_SINGULAR}.repository.ts`,
    'FindOneRepository.txt': `findOne${ENTITY_NAME_SINGULAR}.repository.ts`,
    'UpdateRepository.txt': `update${ENTITY_NAME_SINGULAR}.repository.ts`,
    'ExportRepositoriesModule.txt': `${ENTITY_NAME_SINGULAR_LOWER}Repositories.module.ts`,
    // Domain/Abstract
    'CreateTemplate.txt': `create${ENTITY_NAME_SINGULAR}.abstract.ts`,
    'FindByTemplate.txt': `findBy${ENTITY_NAME_SINGULAR}.abstract.ts`,
    'FindOneTemplate.txt': `findOne${ENTITY_NAME_SINGULAR}.abstract.ts`,
    'UpdateTemplate.txt': `update${ENTITY_NAME_SINGULAR}.abstract.ts`,
    // domain/services
    'CreateService.txt': `create${ENTITY_NAME_SINGULAR}.service.ts`,
    'DeleteService.txt': `delete${ENTITY_NAME_SINGULAR}.service.ts`,
    'RestoreService.txt': `restore${ENTITY_NAME_SINGULAR}.service.ts`,
    'UpdateService.txt': `update${ENTITY_NAME_SINGULAR}.service.ts`,
    'ExportServicesModule.txt': `${ENTITY_NAME_SINGULAR_LOWER}Services.module.ts`,
    // application/useCases
    'CreateUseCase.txt': `create${ENTITY_NAME_SINGULAR}.useCase.ts`,
    'DeleteUseCase.txt': `delete${ENTITY_NAME_SINGULAR}.useCase.ts`,
    'FindAllUseCase.txt': `findAll${ENTITY_NAME_SINGULAR}.useCase.ts`,
    'FindByUseCase.txt': `findById${ENTITY_NAME_SINGULAR}.useCase.ts`,
    'RestoreUseCase.txt': `restore${ENTITY_NAME_SINGULAR}.useCase.ts`,
    'UpdateUseCase.txt': `update${ENTITY_NAME_SINGULAR}.useCase.ts`,
    'ExportUseCaseModule.txt': `${ENTITY_NAME_SINGULAR_LOWER}UseCases.module.ts`,
    // application/controllers
    'CreateController.txt': `create${ENTITY_NAME_SINGULAR}.controller.ts`,
    'DeleteController.txt': `delete${ENTITY_NAME_SINGULAR}.controller.ts`,
    'FindAllController.txt': `findAll${ENTITY_NAME_SINGULAR}.controller.ts`,
    'FindByController.txt': `findBy${ENTITY_NAME_SINGULAR}.controller.ts`,
    'RestoreController.txt': `restore${ENTITY_NAME_SINGULAR}.controller.ts`,
    'UpdateController.txt': `update${ENTITY_NAME_SINGULAR}.controller.ts`,
    'ExportControllersModule.txt': `${ENTITY_NAME_SINGULAR_LOWER}Controllers.module.ts`,
};

// Leer el archivo de la entidad y extraer propiedades
const entityFilePath = path.join(
    __dirname,
    'src/integrations/dbManager/infrastructure/entities',
    ROUTE_ENTITY,
    `${entityNamePlural[0].toLowerCase()}${entityNamePlural.slice(1)}.entity.ts`,
);
const entityContent = fs.readFileSync(entityFilePath, 'utf8').split('\n');
let interfaceProperties = [];
let insideDecorator = false;

entityContent.forEach((line) => {
    line = line.trim();
    console.log('line: ', line);

    // Verificar si la línea marca el inicio o el final de un decorador
    if (line.startsWith('@') && !line.startsWith('@JoinColumn')) {
        insideDecorator = true;
    } else if (line === '' || line.startsWith('}') || line.startsWith('/') || line.startsWith('@JoinColumn')) {
        insideDecorator = false;
    }

    // Si no está dentro de un decorador, buscar patrones de propiedades
    if (!insideDecorator && line.includes(':') && !line.endsWith('[];') && !line.includes('@')) {
        let parts = line.split(':');
        let propertyName = parts[0].trim().replace('!', '');
        let propertyType = parts[1].split(';')[0].trim();

        // Agregar propiedad a la interfaz
        interfaceProperties.push(`    ${propertyName}: ${propertyType};`);
    }
});

const INTERFACE_ROUTE = path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models', `${ENTITY_NAME_SINGULAR_LOWER}.interface.ts`);
const MODEL_ROUTE = path.join(__dirname, 'src/modules', outputDir, 'domain/models', `${ENTITY_NAME_SINGULAR_LOWER}.model.ts`);

// Crear archivo de interfaz
const interfaceContent = `import { IAbstractEntity } from 'src/core/interfaces';\n\nexport interface I${ENTITY_NAME_SINGULAR} extends IAbstractEntity {\n${interfaceProperties.join(
    '\n',
)}\n}`;
const interfaceFilePath = path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models', `${ENTITY_NAME_SINGULAR_LOWER}.interface.ts`);
try {
    fs.writeFileSync(interfaceFilePath, interfaceContent);
} catch (error) {
    // Si no existe domain/interfaces/models, crearlo
    if (!fs.existsSync(path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models'))) {
        fs.mkdirSync(path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models'), { recursive: true });
    }
}
console.log(`Interfaz generada: ${interfaceFilePath}`);

// Leer el archivo de la interfaz y extraer propiedades
let interfaceContentModel;
try {
    interfaceContentModel = fs.readFileSync(INTERFACE_ROUTE, 'utf8').split('\n');
} catch (error) {
    // Si no existe domain/interfaces/models, crearlo
    if (!fs.existsSync(path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models'))) {
        fs.mkdirSync(path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models'), { recursive: true });
    }
}
let modelProperties = [];
let importStatements = new Set();

interfaceContentModel.forEach((line) => {
    const propertyPattern = /^\s+(\w+)(\??):\s+(\w+);/;
    const match = line.match(propertyPattern);

    if (match) {
        const propertyName = match[1];
        const isOptional = match[2] === '?';
        const propertyType = match[3];
        let valueType;

        switch (propertyType) {
            case 'string':
                valueType = 'TextValueVo';
                importStatements.add("import { TextValueVo } from 'src/core/valueObjects/textValue.vo';");
                break;
            case 'number':
                valueType = 'UniversalNumberVo';
                importStatements.add("import { UniversalNumberVo } from 'src/core/valueObjects/universalNumber.vo';");
                break;
            case 'Date':
                valueType = 'DateVo';
                importStatements.add("import { DateVo } from 'src/core/valueObjects/date.vo';");
                break;
            default:
                valueType = propertyType;
        }

        modelProperties.push({
            name: propertyName,
            type: valueType,
            isOptional: isOptional,
        });
    }
});

// Generar contenido del modelo
let modelContent = `/* eslint-disable @typescript-eslint/naming-convention */
${Array.from(importStatements).join('\n')}
import { BaseModelO } from 'src/core/models/baseModelOriginal';
import { I${ENTITY_NAME_SINGULAR} } from '../interfaces/models';

export class ${ENTITY_NAME_SINGULAR} extends BaseModelO {
`;

modelProperties.forEach((prop) => {
    const privateName = `_${prop.name}`;
    modelContent += `    private ${privateName}${prop.isOptional ? '?' : ''}: ${prop.type};\n`;
});

modelContent += `    constructor(${ENTITY_NAME_SINGULAR_LOWER}: I${ENTITY_NAME_SINGULAR}) {
        super(${ENTITY_NAME_SINGULAR_LOWER});
`;

modelProperties.forEach((prop) => {
    const privateName = `_${prop.name}`;
    modelContent += `        this.${prop.name} = ${ENTITY_NAME_SINGULAR_LOWER}.${prop.name};\n`;
});

modelContent += `    }\n\n`;

modelProperties.forEach((prop) => {
    const privateName = `_${prop.name}`;
    modelContent += `    get ${prop.name}(): ${prop.type === 'TextValueVo' ? 'string' : prop.type} {
        return this.${privateName} && this.${privateName}.value;
    }\n\n    set ${prop.name}(value: ${prop.type === 'TextValueVo' ? 'string' : prop.type}) {
        this.${privateName} = value && new ${prop.type}(value);
    }\n\n`;
});

modelContent += `    get get${ENTITY_NAME_SINGULAR}(): I${ENTITY_NAME_SINGULAR} {
        return {
            ...super.baseData,
`;

modelProperties.forEach((prop) => {
    modelContent += `            ${prop.name}: this.${prop.name},\n`;
});

modelContent += `        };
    }
    update(${ENTITY_NAME_SINGULAR_LOWER}: Partial<I${ENTITY_NAME_SINGULAR}>): void {
        super.update(${ENTITY_NAME_SINGULAR_LOWER});
`;

modelProperties.forEach((prop) => {
    modelContent += `        this.${prop.name} = ${ENTITY_NAME_SINGULAR_LOWER}.${prop.name};
`;
});

modelContent += `    }
}`;

// Escribir el archivo de modelo
fs.writeFileSync(MODEL_ROUTE, modelContent);
console.log(`Modelo generado: ${MODEL_ROUTE}`);

// Crear el archivo index.ts en domain/models
const indexExportsModels = [`export * from './${ENTITY_NAME_SINGULAR_LOWER}.model';`];
const indexModelsPath = path.join(__dirname, 'src/modules', outputDir, 'domain/models', 'index.ts');
fs.writeFileSync(indexModelsPath, indexExportsModels.join('\n'));
console.log(`Archivo index.ts actualizado en: ${indexModelsPath}`);

// Creación del index.ts en domain/interfaces/models
const indexExportsInterfaces = [`export * from './${ENTITY_NAME_SINGULAR_LOWER}.interface';`];
const indexPath = path.join(__dirname, 'src/modules', outputDir, 'domain/interfaces/models', 'index.ts');
fs.writeFileSync(indexPath, indexExportsInterfaces.join('\n'));

// Creación de archivos basados en plantillas y actualización de index.ts
const indexExportsRepositories = [];
const indexExportsDomainAbstract = [];
const indexExportsServices = [];
const indexExportsUseCases = [];
const indexExportsControllers = [];

for (const [templateName, outputFileName] of Object.entries(templates)) {
    // Determinar la carpeta base para la plantilla
    let baseTemplateFolder;
    let baseOutputDir;
    if (templateName.includes('Template')) {
        baseTemplateFolder = 'abstract';
        baseOutputDir = 'domain/abstract';
    } else if (templateName.includes('Service')) {
        baseTemplateFolder = 'services';
        baseOutputDir = 'domain/services';
    } else if (templateName.includes('UseCase')) {
        baseTemplateFolder = 'useCases';
        baseOutputDir = 'application/useCases';
    } else if (templateName.includes('Controller')) {
        baseTemplateFolder = 'controllers';
        baseOutputDir = 'application/controllers';
    } else {
        baseTemplateFolder = 'repositories';
        baseOutputDir = 'infrastructure/repositories';
    }

    // Leer y personalizar el contenido de la plantilla
    const templatePath = path.join(__dirname, 'templates', baseTemplateFolder, templateName);
    // generateAbstractClass
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    const customizedContent = replacePlaceholders(templateContent, placeholders);

    // Generar la ruta de salida y crear el archivo
    const outputFilePath = path.join(__dirname, 'src/modules', outputDir, baseOutputDir, outputFileName);
    const outputDirPath = path.dirname(outputFilePath);

    if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
    }

    fs.writeFileSync(outputFilePath, customizedContent);
    console.log(`Archivo generado: ${outputFilePath}`);

    // Añadir exportación al index.ts correspondiente
    const exportLine = `export * from './${outputFileName.replace('.ts', '')}';`;
    // Si es diferente de .module.ts, añadirlo a los exports
    if (!outputFileName.includes('.module.ts')) {
        if (templateName.includes('Template')) {
            indexExportsDomainAbstract.push(exportLine);
        } else if (templateName.includes('Service')) {
            indexExportsServices.push(exportLine);
        } else if (templateName.includes('UseCase')) {
            indexExportsUseCases.push(exportLine);
        } else if (templateName.includes('Controller')) {
            indexExportsControllers.push(exportLine);
        } else {
            indexExportsRepositories.push(exportLine);
        }
    }
}

// Crear o actualizar los archivos index.ts para cada categoría
const updateIndexFile = (exportsArray, directory) => {
    const indexPath = path.join(__dirname, 'src/modules', outputDir, directory, 'index.ts');
    fs.writeFileSync(indexPath, exportsArray.join('\n'));
    console.log(`Archivo index.ts actualizado en: ${indexPath}`);
};

updateIndexFile(indexExportsRepositories, 'infrastructure/repositories');
updateIndexFile(indexExportsDomainAbstract, 'domain/abstract');
updateIndexFile(indexExportsServices, 'domain/services');
updateIndexFile(indexExportsUseCases, 'application/useCases');
updateIndexFile(indexExportsControllers, 'application/controllers');

// Función para generar DTOs
const generateDTOs = (properties, dtoName) => {
    let dtoContent = `import { ApiProperty } from '@nestjs/swagger';\nimport { IsString, IsNumber, IsDate } from 'class-validator';\n\n`;
    dtoContent += `export class ${dtoName} {\n`;

    properties.forEach((prop) => {
        const { name, type } = prop;
        const decorator = type === 'string' ? 'IsString' : type === 'number' ? 'IsNumber' : type === 'Date' ? 'IsDate' : 'IsString';
        dtoContent += `    @${decorator}()\n`;
        dtoContent += `    @ApiProperty({\n        description: '',\n        example: '',\n    })\n`;
        dtoContent += `    ${name}: ${type};\n\n`;
    });

    dtoContent += `}\n`;
    return dtoContent;
};

// Función para generar el DTO de actualización
const generateUpdateDTO = (createDtoName) => {
    return (
        `import { ApiProperty, PartialType } from '@nestjs/swagger';\nimport { IsString, IsUUID } from 'class-validator';\nimport { Create${ENTITY_NAME_SINGULAR}Dto } from './';\n\n` +
        `export class Update${ENTITY_NAME_SINGULAR}Dto extends PartialType(Create${ENTITY_NAME_SINGULAR}Dto) {\n` +
        `    @IsUUID('4')\n` +
        `    @IsString()\n` +
        `    @ApiProperty({\n        description: '',\n        example: '',\n    })\n` +
        `    id: string;\n` +
        `}\n`
    );
};

// Extraer propiedades de la interfaz para generar DTOs
const interfacePropertiesForDTOs = interfaceProperties.map((line) => {
    const parts = line.trim().split(/:\s+/);
    const name = parts[0].trim();
    const type = parts[1].replace(';', '').trim();
    return { name, type };
});

// Generar DTOs
const createDtoName = `Create${ENTITY_NAME_SINGULAR}Dto`;
const updateDtoName = `Update${ENTITY_NAME_SINGULAR}Dto`;
const createDtoContent = generateDTOs(interfacePropertiesForDTOs, createDtoName);
const updateDtoContent = generateUpdateDTO(interfacePropertiesForDTOs, updateDtoName);

// Escribir archivos DTO
const createDtoPath = path.join(__dirname, 'src/modules', outputDir, 'application/dtos', `create${ENTITY_NAME_SINGULAR}.dto.ts`);
const updateDtoPath = path.join(__dirname, 'src/modules', outputDir, 'application/dtos', `update${ENTITY_NAME_SINGULAR}.dto.ts`);
// Si no existe application/dtos, crearlo
if (!fs.existsSync(path.join(__dirname, 'src/modules', outputDir, 'application/dtos'))) {
    fs.mkdirSync(path.join(__dirname, 'src/modules', outputDir, 'application/dtos'), { recursive: true });
}
fs.writeFileSync(createDtoPath, createDtoContent);
fs.writeFileSync(updateDtoPath, updateDtoContent);
console.log(`DTOs generados: ${createDtoPath}, ${updateDtoPath}`);

// Crear archivo index.ts en application/dtos
const indexExportsDTOs = [`export * from './create${ENTITY_NAME_SINGULAR}.dto';`, `export * from './update${ENTITY_NAME_SINGULAR}.dto';`];
const indexDTOsPath = path.join(__dirname, 'src/modules', outputDir, 'application/dtos', 'index.ts');
fs.writeFileSync(indexDTOsPath, indexExportsDTOs.join('\n'));
console.log(`Archivo index.ts actualizado en: ${indexDTOsPath}`);

console.log('Generación de archivos completada.');
