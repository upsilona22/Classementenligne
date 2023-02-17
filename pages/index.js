import Head from 'next/head'
import Header from '@components/Header'
import LeaderboardTable from '@components/LeaderboardTable'
const fetch = require('isomorphic-fetch');

function Index({ data, error }) {
  return (
    <>
      {error && <p>{error}</p>}
      <pre>
        <code>{JSON.stringify(data, null, 4)}</code>
      </pre>
    </>
  );
}

export default function Home({leaderboard, totals, time}) {
  return (
    <div className="container">
      <Head>
        <title>Classement démolitions</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="Bienvenue sur le classement des démolitions francophones!" />
        <p className="description">
          Rejoignez le classement en effectuant la demande sur le discord <a href="https://discord.gg/HVuU3QEC">
            https://discord.gg/HVuU3QEC</a>
        </p>
        <p>
          Collectivement les {totals.players.toLocaleString()} joueurs ont démolis {totals.demos.toLocaleString()} joueurs, 
          amenant à un total de {totals.exterms.toLocaleString()} exterminations
        </p>
        <p>
          Nombre de victimes atteint en {time.days} jours, {time.hours} heures, {time.minutes} minutes, 
          et {time.seconds} secondes
        </p>
        
      </main>
      <LeaderboardTable leaderboard={leaderboard}/>
    </div>
  )
}

export async function getStaticProps() {
  let data = [];
  let error = "";
  try {
    const res = await fetch(
      "https://www.dropbox.com/s/lxvr2j4r51bi5xx/leaderboard.json?dl=0",
      {
        method: "GET",
        headers: {
          // update with your user-agent
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36", 
          Accept: "application/json; charset=UTF-8",
        },
      }
    );

    data = await res.json();
  } catch (e) {
    error = e.toString();
  }

  return {
    props: {
      data,
      error,
    },
  };
}

export default Index;
  

  let totalDemos = 0;
  let totalExterms = 0;
  let totalPlayers = 0;
  for (let player in leaderboard) {
    let playerData = leaderboard[player];
    let playerDemos = parseInt(playerData["Demolitions"]);
    totalDemos += playerDemos;
    let playerExterms = parseInt(playerData["Exterminations"]);
    totalExterms += playerExterms;
    totalPlayers ++;
  }

  let days = Math.floor(3 * totalDemos / 60 / 60 / 24);
  let hours = Math.floor(3 * totalDemos / 60 / 60) - (days * 24);
  let minutes = Math.floor(3 * totalDemos / 60) - (days * 24 * 60) - (hours * 60);
  let seconds = (3 * totalDemos) - (days * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60);

  let time = {
    days, hours, minutes, seconds
  }

  let totals = {
    players: totalPlayers,
    demos: totalDemos,
    exterms: totalExterms,
  }

  return {
    props: {
      leaderboard,
      totals,
      time
    },
    // Next.js re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 60, // In seconds
  };
}
