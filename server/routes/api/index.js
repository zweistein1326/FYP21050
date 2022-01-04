const router = require('express').Router();
const ipfsClient = require('ipfs-http-client');
const fs = require('fs');
const ipfs = ipfsClient.create({
    host: "localhost",
    port: 5001,
    protocol: "http"
});
const formidable = require('formidable');
const auth = require('../components/auth');


router.get('/', async (req, res, next) => {
    return res.json("Hello World");
})

router.post('/upload', async (req, res, next) => {
    // upload file to IPFS
    // get hash of uploaded file
    // return returned hash

    let fileObj = {};
    console.log(req.files);
    if (req.files.inputFile) {
        const file = req.files.inputFile;
        const fileName = file.name;
        const filePath = __dirname + "/img/" + fileName;

        file.mv(filePath, async (err) => {
            if (err) {
                console.log("Error: failed to download file.");
                return res.status(500).send(err);
            }
            const fileHash = await addFile(fileName, filePath);
            console.log("File Hash received -->", fileHash);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log("Error: Unable to delete file", err);
                }
            });
            fileObj = {
                file: file,
                name: fileName,
                path: filePath,
                hash: fileHash
            }
            auth.users[0].uploadedFiles.push(fileHash);
            return res.json(fileObj);
        })
    }
    // return res.json('Uploaded');
})

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const filesAdded = await ipfs.add({ path: fileName, content: file }, {
        progress: (len) => console.log("Uploading file...", len)
    });
    console.log(filesAdded);
    const fileHash = filesAdded.cid;
    console.log(fileHash);
    return fileHash;
}

router.get('/file/:hash', async (req, res, next) => {
    const { hash } = req.params;
    console.log(hash);
    const result = await getData(hash);
    // console.log(result);
    return res.json(result);
})

const getData = async (hash) => {
    const asyncitr = ipfs.cat(hash);
    let data = [];
    let count = 0;
    const file = fs.createWriteStream(__dirname + '/img/' + 'me.png');

    for await (const itr of asyncitr) {
        file.write(Buffer.from(itr));
    }
    file.end();
    // console.log(data);
    return data;
}

router.post('/login', async (req, res, next) => {
    auth.login(req.body)
        .then(user => {
            if (user) {
                return res.json(user)
            }
            return res.status(400).json({ message: 'Username or password incorrect' });
        })
        .catch(e => {
            return next(e)
        })
})


module.exports = router;