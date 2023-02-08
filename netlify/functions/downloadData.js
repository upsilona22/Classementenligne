const fetch = require('isomorphic-fetch');
const Dropbox = require('dropbox').Dropbox;
let dbx = new Dropbox({accessToken: "sl.BYYK0W2DcvfCZua0Gv_bj05mRfA5RvDx9lQb3k3EW9BtiLctj_jTLoR6WCOR_IAhlwj7U8Rbsfr5zUkjmFg58_urjDUAatD7gsxGvid_hmP5RL34fDoO6ZcL716rx0JwD60-RSh9aSBJ", fetch: fetch});

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
