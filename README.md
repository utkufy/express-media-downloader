
# express-media-downloader

This project is a library for Express users that allows them to download media from a given link.




## Usage


Navigate to the project directory
```bash
  cd my-project
```

Install express-media-downloader
```bash
  npm install express-media-downloader
```

You can use it in your project as follows:
  ```javascript
const express = require('express');
const path = require('path');
const MediaDownloader = require('express-media-downloader'); 
const app = express();
const port = 3000;

const staticFolderName = 'user_static';
const mediaDownloader = new MediaDownloader(staticFolderName);
const fileList = [
    { name: 'images' },
    { name: 'videos' },
    { name: 'docs' }
];
mediaDownloader.config(fileList, app, express);
mediaDownloader.downloadMedia("http://example.com/test.mp4", "videos");


app.listen(port, () => {
    console.log(` http://localhost:${port}`);
});
```
A progress bar like the one below is available during the process.
```bash
Downloading [========================================] 100%
```


That's it...Enjoy




  