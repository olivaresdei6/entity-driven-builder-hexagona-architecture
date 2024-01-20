const fs = require('fs');

const getImportsVoAndAttributesForModel = (interfaceProperties) => {
    let modelAttributes = [];
    let importStatements = new Set();

    interfaceProperties.forEach((line) => {
        let valueType;

        switch (line.typePrimitive) {
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
                valueType = line.typePrimitive;
        }

        modelAttributes.push({
            ...line,
            type: valueType,
        });
    });

    return { modelAttributes, importStatements };
};

module.exports = { getImportsVoAndPropertiesForModel: getImportsVoAndAttributesForModel };
