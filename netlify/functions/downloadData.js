const fetch = require('isomorphic-fetch');
const Dropbox  = require('dropbox').Dropbox;
const dbx = new Dropbox ({ fetch:fetch, 
    accessToken: "sl.BZBrN2NF536u74pzo3_HLwoyO4rwnJNVWGU5TJ0dn75hdj_P2MK9dcqgnDfI0iqDnl4ExmJg4Xsy8NVNIf4VhxHmQEm884wpsvH03ceQ7pVleTzMCrQwkiuzj40V4bS7ntfqEG1g5oQT", 
    clientId: ["6q53aq0206qd2de"],
    clientSecret: 'chbvq8t7rj2ijun',
    refreshToken: 'F-csXUU3j2IAAAAAAAAAAV-sJC8LtkSeI64riSUcwn5uQt5tmIQhUEg4RQfrNLMX'
});

const redirectUri = `http://${hostname}:${port}/auth`;

app.get('/', (req, res) => {
  dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', true)
    .then((authUrl) => {
      res.writeHead(302, { Location: authUrl });
      res.end();
    });
});

app.get('/auth', (req, res) => { // eslint-disable-line no-unused-vars
  const { code } = req.query;
  console.log(`code:${code}`);

  dbx.auth.getAccessTokenFromCode(redirectUri, code)
    .then((token) => {
      console.log(`Token Result:${JSON.stringify(token)}`);
      dbx.auth.setRefreshToken(token.result.refresh_token);
      dbx.usersGetCurrentAccount()
        .then((response) => {
          console.log('response', response);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(port);

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
