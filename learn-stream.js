const fs = require('fs');
const path = require('path');

// Read Stream
const rs = fs.createReadStream(path.join(__dirname, 'dir', 'loremfull.txt'), { encoding: 'utf8' })
// write stream 
const ws = fs.createWriteStream(path.join(__dirname, 'dir', 'loramfull-new.txt'))

// rs.on('data', (datachunk) => {
//     ws.write(datachunk)
// })


// This is more efficient 
rs.pipe(ws)

// Stream  allowing you to write and read in rapid due to the data sended by chunk.
// So creating the copy of very large file can be accomplished in very very fast way.