const { generateAbstractClass } = require('./templates/abstract/generateAbstractClass');
const { generateInterface } = require('./templates/interfaces/generateInterface');
const { generateModel } = require('./templates/models/generateModels');
const { generateServices } = require('./templates/services/generateServices');
const { generateRepositories } = require('./templates/repositories/generateRepositories');
const { generateUseCases } = require('./templates/useCases/generateUseCases');
const { generateDtos } = require('./templates/dtos/generateDtos');
const { generateControllers } = require('./templates/controllers/generateControllers');

const [, , routeModule, entityRoute, entityNamePlural, entityNameSingular, createControllers = true] = process.argv;

// Preparar variables
const entityName = entityNamePlural;
const entityNameSingularLower = entityNameSingular.charAt(0).toLowerCase() + entityNameSingular.slice(1);
const routeEntity = entityRoute.replace(/\//g, '/');

generateInterface(__dirname, routeEntity, entityName, entityNameSingularLower, entityNameSingular, routeModule);
generateModel(__dirname, entityNameSingular, entityNameSingularLower, routeModule);
generateAbstractClass(entityName, entityNameSingular, entityNameSingularLower, routeModule, __dirname);
generateRepositories(entityName, entityNameSingular, entityNameSingularLower, routeModule, __dirname, routeEntity);
generateServices(entityName, entityNameSingular, entityNameSingularLower, routeModule, __dirname);
generateUseCases(entityName, entityNameSingular, entityNameSingularLower, routeModule, __dirname);
if (createControllers) {
    generateDtos(entityNameSingular, entityNameSingularLower, routeModule, __dirname);
    generateControllers(entityName, entityNameSingular, entityNameSingularLower, routeEntity, routeModule, __dirname);
}
