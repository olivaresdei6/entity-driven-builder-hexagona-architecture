const getContentUpdateDto = (entityNameSingular) => {
    let dtoContent = '';
    dtoContent += `import { ApiProperty, PartialType } from '@nestjs/swagger';\n`;
    dtoContent += `import { IsString, IsUUID } from 'class-validator';\n`;
    dtoContent += `import { Create${entityNameSingular}Dto } from './';\n\n`;
    dtoContent += `export class Update${entityNameSingular}Dto extends PartialType(Create${entityNameSingular}Dto) {\n`;
    dtoContent += `    @IsUUID('4', { message: 'Id is not a valid UUID' })\n`;
    dtoContent += `    @IsString()\n`;
    dtoContent += `    @ApiProperty({\n        description: '',\n        example: '',\n    })\n`;
    dtoContent += `    id: string;\n`;
    dtoContent += `}\n`;
    return dtoContent;
};

module.exports = { getContentUpdateDto };
