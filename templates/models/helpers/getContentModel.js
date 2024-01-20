const getContentModel = (modelProperties, importStatements, entityNameSingular, entityNameLowerSingular) => {
    // Generar contenido del modelo
    let modelContent = `/* eslint-disable @typescript-eslint/naming-convention */\n${Array.from(importStatements).join('\n')}\n`;
    modelContent += `import { BaseModelO } from 'src/core/models/baseModelOriginal';\n`;
    modelContent += `import { I${entityNameSingular} } from '../interfaces/models'; \n\n`;
    modelContent += `export class ${entityNameSingular} extends BaseModelO {\n`;

    modelProperties.forEach((prop) => {
        const privateName = `_${prop.name}`;
        modelContent += `    private ${privateName}${prop.isOptional ? '?' : ''}: ${prop.type};\n`;
    });

    modelContent += `    constructor(${entityNameLowerSingular}: I${entityNameSingular}) {\n        super(${entityNameLowerSingular});\n`;

    modelProperties.forEach((prop) => {
        const privateName = `_${prop.name}`;
        modelContent += `        this.${prop.name} = ${entityNameLowerSingular}.${prop.name};\n`;
    });

    modelContent += `    }\n\n`;

    modelProperties.forEach((prop) => {
        const privateName = `_${prop.name}`;
        // Get
        modelContent += `    get ${prop.name}(): ${prop.typePrimitive} {\n`;
        if (prop.isOptional) {
            modelContent += `        return this.${privateName} && this.${privateName}${prop.typePrimitive === 'boolean' ? '' : '.value'};\n`;
        } else {
            modelContent += `        return this.${privateName}${prop.typePrimitive === 'boolean' ? '' : '.value'};\n`;
        }
        modelContent += `    }\n\n`;

        // Set
        modelContent += `    set ${prop.name}(value: ${prop.typePrimitive}) {\n`;
        if (prop.isOptional) {
            modelContent += `        this.${privateName} = value ${prop.typePrimitive === 'boolean' ? '' : '&& new ' + prop.type + '(value)'};\n`;
        } else {
            modelContent += `        this.${privateName} = ${prop.typePrimitive === 'boolean' ? 'value' : 'new ' + prop.type + '(value)'};\n`;
        }
        modelContent += `    }\n\n`;
    });

    modelContent += `    get get${entityNameSingular}(): I${entityNameSingular} {\n`;
    modelContent += `        return {\n`;
    modelContent += `            ...super.baseData,\n`;

    modelProperties.forEach((prop) => {
        modelContent += `            ${prop.name}: this.${prop.name},\n`;
    });

    modelContent += `        };\n`;
    modelContent += `    }\n\n`;
    modelContent += `    update(${entityNameLowerSingular}: Partial<I${entityNameSingular}>): void {\n`;
    modelContent += `        super.update(${entityNameLowerSingular});\n`;

    modelProperties.forEach((prop) => (modelContent += `        this.${prop.name} = ${entityNameLowerSingular}.${prop.name};\n`));
    modelContent += `    };\n`;
    modelContent += `}\n`;

    return modelContent;
};

module.exports = { getContentModel };
