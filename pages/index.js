import Head from 'next/head'
import Header from '@components/Header'
import LeaderboardTable from '@components/LeaderboardTable'
const fetch = require('isomorphic-fetch');



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


 export async function getStaticProps(context) {
   let leaderboard = 
     await fetch("https://ephemeral-paprenjak-c345df.netlify.app/.netlify/functions/downloadData")
       .then(function(response) {
         if (response.status >= 400) {
           console.log(response);

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
