const fetch = require('isomorphic-fetch');
const Dropbox  = require('dropbox').Dropbox;
const dbx = new Dropbox ({ fetch:fetch, 
    accessToken: "sl.BZCJxFTO6VG7ShMLm0OGgygZm6WEtMArWzfKQrYjgi5g2BIe5AmuyaglHf1S1FTI0iZ1gDZdM5mDMSX3nieOZS-5zlXldduyljlsIAKqfzhbsk964pDCZbZP56i5_yxHLlw-cmHwchcp", 
 
});

exports.handler = async function(event, context) {
     try {
         const response = await dbx.filesDownload({path: "/leaderboard.json"});

         if (response.status !== 200) {
             return {
                 statusCode: response.status,
                 message: "Dropbox error"
             }
         }

         const data = JSON.parse(response.result.fileBinary);

         return {
             statusCode: 200,
             headers: { "content-type": "application/json" },
             body: JSON.stringify(data)
         }
     } catch(err) {
         console.log(err)
         return {
             statusCode: 502,
             message: "Error connecting to dropbox"
         }
     }
 }
