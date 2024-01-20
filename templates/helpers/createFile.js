const fs = require('fs');
const path = require('path');

const createFile = (routeFile, nameFile, content) => {
    if (!fs.existsSync(routeFile)) {
        fs.mkdirSync(routeFile, { recursive: true });
    }

    fs.writeFileSync(path.join(routeFile, nameFile), content);
    console.log(`Archivo generado: ${routeFile}`);
};

module.exports = { createFile };
