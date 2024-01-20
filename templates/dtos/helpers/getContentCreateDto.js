const getContentCreateDto = (propertiesInterface, entityNameSingular) => {
    let dtoContent = `import { ApiProperty } from '@nestjs/swagger';\n`;
    dtoContent += `import { IsString, IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';\n\n`;
    dtoContent += `export class Create${entityNameSingular}Dto {\n`;

    propertiesInterface.forEach((prop) => {
        const { name, typePrimitive, isOptional } = prop;
        // const decorator = type === 'string' ? 'IsString' : type === 'number' ? 'IsNumber' : type === 'Date' ? 'IsDate' : 'IsString';
        let decorator;
        switch (typePrimitive) {
            case 'string':
                decorator = 'IsString';
                break;
            case 'number':
                decorator = 'IsNumber';
                break;
            case 'Date':
                decorator = 'IsDate';
                break;
            case 'boolean':
                decorator = 'IsBoolean';
                break;
            default:
                decorator = 'IsString';
        }
        dtoContent += `    @${decorator}()\n`;
        if (isOptional) {
            dtoContent += `    @IsOptional()\n`;
            dtoContent += `    @ApiProperty({\n        description: '',\n        example: '',\n        required: false,\n    })\n`;
            dtoContent += `    ${name}?: ${typePrimitive};\n\n`;
        } else {
            dtoContent += `    @ApiProperty({\n        description: '',\n        example: '',\n    })\n`;
            dtoContent += `    ${name}: ${typePrimitive};\n\n`;
        }
    });

    dtoContent += `}\n`;
    return dtoContent;
};

module.exports = { getContentCreateDto };
