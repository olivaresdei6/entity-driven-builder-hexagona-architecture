
# Entity-Driven Builder for Hexagonal Architecture

## Description

This repository contains an automated software module generator, designed to create entity-based code structures, following the principles of the hexagonal architecture. It facilitates the creation of modules organised in `application`, `infrastructure`, and `domain` layers.

## Uso

To generate a new module based on an entity, execute the following command:

```
node generate.js [plural_entity_name] [entity_path] [SingularEntityName] 
```

### Parameters

- plural_entity_name`: Plural name of the entity for which the module will be generated.
- Entity_path`: Path where the generated module will be placed.
- SingularEntityName`: Singular name of the entity.

### Example

```
node generate.js vehicles vehicles/vehicles Vehicles Vehicle
```

## Structure of Generated Directories

After executing the command, the following directories and files will be created within the specified path:

```
entity-driven-builder-hexagona-architecture
├── [entity_path]
│   ├── domain
│   │   ├── interfaces
│   │   │   └── models
│   │   ├── models
│   │   ├── abstract
│   │   └── services
│   ├── infrastructure
│   │   └── repositories
│   └── application
│       ├── useCases
│       ├── dtos
│       └── controllers
```

Each section (domain, infrastructure, application) follows the principles of the hexagonal architecture, ensuring a clear separation of responsibilities.

## Files Generated

The `generate.js` script uses templates located in the `templates` folder to generate the following files:

- Interfaces and domain models
- Abstract classes for the domain
- Repositories and services
- Use cases, DTOs and drivers for the application layer

## Contributions

Contributions are welcome. If you wish to contribute to the project, please follow these steps:

1. Perform a fork of the repository.
2. Create a new branch for your changes.
3. Implement your changes or improvements.
4. Make a pull request for review.
