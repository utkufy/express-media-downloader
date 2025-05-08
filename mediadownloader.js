const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { createWriteStream } = require('fs');
const ProgressBar = require('progress');

class MediaDownloader {
    constructor(staticFolderName) {
        this.staticFolderName = staticFolderName; 
    }

    async config(fileList, app, express) {
        const parentDirPath = path.join(process.cwd(), this.staticFolderName);  // process.cwd() kullanılıyor
        
        if (!fs.existsSync(parentDirPath)) {
            fs.mkdirSync(parentDirPath, { recursive: true });
            console.log(`Parent directory created: ${parentDirPath}`);
        }

        fileList.forEach(element => {
            const folderPath = path.join(parentDirPath, element.name); 
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log(`Folder created: ${folderPath}`);
            }

            app.use(`/${this.staticFolderName}/${element.name}`, express.static(folderPath));
        });
    }
    
    async downloadMedia(fileUrl, folderName) {
        try {
            const staticFolderPath = path.join(process.cwd(), this.staticFolderName); 
            const availableFolders = fs.readdirSync(staticFolderPath).filter(item => fs.statSync(path.join(staticFolderPath, item)).isDirectory());

            if (!availableFolders.includes(folderName)) {
                throw new Error(`This folder is not allowed: ${folderName}`);
            }

            const folderPath = path.join(staticFolderPath, folderName);
            const fileName = path.basename(fileUrl);
            const filePath = path.join(folderPath, fileName);

            if (fs.existsSync(filePath)) {
                console.log(`File already exists: ${filePath}`);
                return;
            }

            const response = await axios({
                method: 'get',
                url: fileUrl,
                responseType: 'stream'
            });

            const totalLength = response.headers['content-length'];

            const progressBar = new ProgressBar('Downloading [:bar] :percent', {
                width: 40,
                total: parseInt(totalLength)
            });

            const writer = createWriteStream(filePath);
            
            response.data.on('data', (chunk) => {
                progressBar.tick(chunk.length); 
            });

            response.data.pipe(writer);

            writer.on('finish', () => {
                console.log(`File downloaded: ${filePath}`);
            });

            writer.on('error', (err) => {
                console.error(`File could not be downloaded: ${err.message}`);
            });
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }
}

module.exports = MediaDownloader;
