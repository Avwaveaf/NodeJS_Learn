const fsPromises = require('fs').promises;
// Ultimately we can use path module to tackle file routing on different platforms
const path = require('path');

// Node will process this asynchronously
//  so this will procecessed later on

// Instead of using this
// fs.readFile('./dir/hellso.txt', 'utf8', (err, data) => {
//  We can use This :
// fs.readFile(path.join(__dirname, 'dir', 'hello.txt'), 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// });


// This will process immediately
console.log("hello")

// write file 
// const dateNow = new Date();
// fs.writeFile(path.join(__dirname, 'dir', `new.txt`), `Date: ${dateNow.toString()} \n This is New content`, (err) => {
//     if (err) throw err;
//     console.log('opperation completed')
// })

// // Updatingfile
// fs.appendFile(path.join(__dirname, 'dir', 'new.txt'), 'this is updated content', (err) => {
//     if (err) throw err;
//     console.log('Appending compoleted')
// })

// However due to asynchronous behaviour by node js we better be using async await approach instead

const fileOperations = async () => {
    try {
        // due to asynchronous file operations we can use this safely
        // SO there is no conflict from which the code should executed first

        const data = 'This is generated with async await so it can '
        await fsPromises.writeFile(path.join(__dirname, 'dir', 'newWIthAsync.txt'), data)
        await fsPromises.appendFile(path.join(__dirname, 'dir', 'newWIthAsync.txt'), 'Avoid the callback hell')
        await fsPromises.rename(path.join(__dirname, 'dir', 'newWIthAsync.txt'), path.join(__dirname, 'dir', 'generatedWithAsync.txt'))

        const res = await fsPromises.readFile(path.join(__dirname, 'dir', 'generatedWithAsync.txt'), 'utf8')
        console.log(res);

    } catch (error) {
        console.error(error)
    }
}

fileOperations();

// catching errors
process.on("uncaughtException", (err) => {
    console.error(err);
    process.exit(1);
})