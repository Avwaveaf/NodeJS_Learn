// =================================================================
//                REACT PROJECT GENERATOR WITH NODE JS
// =================================================================
// execute : node learn-create-dir [project name]

// This script creates a new project directory with specified or default name,
// initializes it with essential files, and provides instructions for further setup.

// Required modules for file system operations and path handling
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

// Readable streams for boilerplate files
const readStream = fs.createReadStream(path.join(__dirname, 'dir', 'boilerplate.html'));
const rsPackage = fs.createReadStream(path.join(__dirname, 'dir', 'package.json'))

// Asynchronous function to create a new project folder and initialize files
const createFolderAndInitFile = async (dirName) => {

    // Check if the directory already exists
    if (!fs.existsSync(`./${dirName}`)) {

        // Create the main project directory
        await fs.mkdir(`./${dirName}`, (err) => {
            if (err) throw err;
            console.log(`${dirName} successfully created!`);
        });

        // Creating 'src' subfolder within the project
        await fs.mkdir(path.join(__dirname, dirName, 'src'), err => {
            if (err) throw err;
            console.log('src dir created ');
        });

        // Create 'initFile.txt' in 'src' folder
        await fsPromises.writeFile(path.join(__dirname, `${dirName}/src`, 'initFile.txt'), 'This is the initial file.');

        // Create 'index.html' in 'src' folder using boilerplate
        const htmlBoilerplate = fs.createWriteStream(path.join(__dirname, `${dirName}/src`, 'index.html'))
        await readStream.pipe(htmlBoilerplate);

        // Create 'index.css' in 'src' folder with a default style
        await fsPromises.writeFile(path.join(__dirname, `${dirName}/src`, 'index.css'), '*{box-sizing:border-box}');

        // Create 'package.json' in 'src' folder using the provided package.json
        const packageJsonCurr = fs.createWriteStream(path.join(__dirname, `${dirName}/src`, 'package.json'))
        await rsPackage.pipe(packageJsonCurr);

        // Provide completion message and instructions
        console.log("Project setup complete. Run:\n npm i [to install the dependencies]");
    }
}

// Check if the user has provided a folder name via command-line arguments
if (process.argv[2]) {
    const dirName = process.argv[2];
    createFolderAndInitFile(dirName);
} else {
    // If no folder name is provided, create a default folder with a unique name
    const defaultDirName = `new_${Date.now()}`;
    createFolderAndInitFile(defaultDirName);
}
