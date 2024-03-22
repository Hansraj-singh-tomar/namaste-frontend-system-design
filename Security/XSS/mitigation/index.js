const express = require("express");

const PORT = 3010;
const app = express();

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        // the content i wanted to load is self, i wanted to load the content only from my own place/engine
        // either that is image/video any damn thing, any resource that you are looking for please load from your 
        // own source do not trust anyone else 
        // we can't use image adderess, getting from other website
        "default-src 'self';" +
        "script-src 'self' 'nonce-randomKey' 'unsafe-inline' http://unsecure.com;" // i want to inject this script in my code
    );
    next();
})

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(req.url);
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server started at http://locolhost:${PORT}`);
});

// 'unsafe-inline' -> which means i can run script which is written by me or my own script, we have to add this line inside our header
// then it will show output

// script nouces
// how we will distunguise our own script and others script
// This will execute - but we have set inside header => "script-src 'self' 'nonce-randomKey'
// <script nounce="randomKey">
//   console.log("my trusted code");
// </script>

// This won't execute
// <script>
//   console.log("my trusted code");
// </script>


// Report only mode
// report-to default;
// report-uri URL;