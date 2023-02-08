const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let dbx = new Dropbox({accessToken: "sl.BYe6ezkhiutjw7QXMR7Lv2mNuqm5-2f_-9v4ayUP3lzrA25z5Fo2YUnWjN0vqmIByLPA0hapW_OGWDh-k6Jbs_oE5HnflZaD0G4sgcEwDraQpV2_w4Mf0HbsmEFU3ySa9Nf575J_iX2s", fetch: fetch});

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
