const functions = require('firebase-functions');
const cors      = require('cors')({origin:true});
const cheerio   = require('cheerio');
const getUrls   = require('get-urls');
const fetch     = require('node-fetch');
const puppeteer = require('puppeteer');
const fs = require('fs');

// Array of objects showing results;
var matchUpdates=[];
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// http://localhost:5000/scorescraper/us-central1/helloWorld

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});



// Cloud function that 
exports.convertToCsv = functions.https.onRequest((request, response) => {
    response.send("ahh shiit");
    
    fetch('https://api.footystats.org/league-matches?key=test85g57&league_id=2012')
    .then(res => res.json())
    .then(json => {

      let data = JSON.stringify(json, null, 2);
      fs.writeFile("2019.json",data, (err) => {
        if (err) throw err;
        console.log('Data written to file');
      })
    });

  });



exports.scoreScrape= functions.https.onRequest((request, response) => {
  const website ="http://www.soccer-rating.com/England/";

  //getMetaTags(website);
  const ans = runHeadless(website,response); 
  console.log("answer is ", ans);
});


// getMetaTag function variable
// Input: (text) --> text with  url


// wait for the fetch to occur, once occured.
const getMetaTags = async text =>{
  try{


    const res = await fetch(text);
    const html = await res.text();
    console.log(html);
  }
  catch (error) {
    console.log("The  error is ",text);
    console.log(error);
  }
}


// Run a headless server to get the needed data
const runHeadless = async (url,response) => {
    const browser = await puppeteer.launch(
        {
          headless:false,
          defaultViewport: {
            width: 1600,
            height: 900
        }  
      });  // invisible launch of puppeteer

    const page = await browser.newPage();

    page.goto(url, {waitUntil: 'networkidle0'});

    // all the teams are stored in ltable id 
    
    await page.waitForSelector('#ltable > tbody > tr > td.tdt > a', {
      visible: true,
    });

    // Execute code in the DOM
    const data = await page.evaluate( () => {
      const trs = document.querySelectorAll('#ltable > tbody > tr > td.tdt > a');

      // getting selectors gets me empty list of all trs
      
      // fill that tr with the data inside, and return that -> this way data is sent only when filled up.
      const links = Array.from(trs).map(s=>s.href);
      return links;
    }).catch(err => {return err});

    //console.log("current data", data);
    console.log("Starting data scraping...");
    // go to the first page

    for(var x = 0;x<20;x++){
      await page.goto(data[x]);


      await page.waitForSelector('table.bigtable > tbody > tr> td', {
        visible: true,
      });


      const content = await page.evaluate( () => {
        const matchList = document.querySelectorAll('body > div.wrap > div:nth-child(7) > table.bigtable > tbody > tr:nth-child(n+2) > td:nth-child(3)'+ // selecting from n+2 to make sure only matchs in
        ',body > div.wrap > div:nth-child(7) > table.bigtable > tbody > tr:nth-child(n+2) > td:nth-child(11)'+
        ',body > div.wrap > div:nth-child(7) > table.bigtable > tbody > tr:nth-child(n+2) > td:nth-child(8)'
        );   

        const teamDom = document.querySelectorAll('body > div.wrap > div:nth-child(7) > table.bigtable > tbody > tr:nth-child(1) > td:nth-child(3) > font > b');   
        const team = teamDom[0].textContent;

        // getting selectors gets me empty list of all trs
        // fill that tr with the data inside, and return that -> this way data is sent only when filled up.
        const names = Array.from(matchList).map(m=>(""+m.textContent));



        return [names,team];
      }).catch(err => {return err});
      var results = refineData(content[0],content[1]);
      createJson(results,content[1]);
  }
  response.send("Finished");
}

// Refines the data and creates and object for each match day, with each match being an object with away,home, scores of away/home, result.
function refineData(arr,teamName){
  matchScore=[];
  matchName=[];
  matchType=[];
  for (var i=0;i<arr.length;i=i+3){
    //console.log(arr[i]);
    matchName.push(arr[i]);
  }

  for (var i=2;i<arr.length;i=i+3){
    //console.log(arr[i]);
    matchScore.push(arr[i]);
  }

  for (var i=1;i<arr.length;i=i+3){
    //console.log(arr[i]);
    matchType.push(arr[i]);
  }

  // Figure out if home or away match.
  var matches={};
  for (var i=0;i<matchName.length;i=i+1){
    matches[i]= awaySplitResult(matchName[i],matchScore[i],teamName,matchType[i]);
  }

  console.log(teamName);
  return matches;
}

// Helper function, takes a fixture, using the - split to figure out the away team, takes score and home team to see if win/loss/draw,
function awaySplitResult(fixture,score,team,matchType){
  var teams       =  fixture.split(" - ");
  var homeTeam    = teams[0];
  var awayTeam    = teams[1];
  var Result      = score.split(":");
  var homeResult  = parseInt(Result[0]);
  var awayResult  = parseInt(Result[1]);

  var outcome = "";
  if(homeResult==awayResult){
    outcome="Draw";
  }
  
  else if(homeTeam == team){
    if(homeResult>awayResult){
      outcome="Win";
    }
    else{
      outcome="Loss"
    } 
  }

  else if(awayTeam == team){
    if(homeResult<awayResult){
      outcome="Win";
    }
    else{
      outcome="Loss"
    } 
  }

  //console.log(homeTeam,awayTeam,homeResult,awayResult,outcome,matchId);
  var match = {
    HomeTeam:homeTeam,
    AwayTeam:awayTeam,
    HomeScore:homeResult,
    AwayScore:awayResult,
    Result:outcome,
    match:matchType
  }

  return match;
}

// Gets the matches object and creates a json for it
function createJson(matches_obj,team){
  let data = JSON.stringify(matches_obj, null, 2);

  var filename= "./Match Day Results/"+team+".json";
  fs.writeFile(filename, data, (err) => {
      if (err) throw err;
      console.log('Data written to file');
  });
}


function readData(file,folder){
  var team = file;
  file=folder+""+file;
  let rawdata = fs.readFileSync(file);


  let data = JSON.parse(rawdata);

  // --- [ Function maping top iterate through all UK1 PL matches]--------// 
  // --  [ get last 29 games]
  console.log("-------------------Current File-------------",file);

  epl_match={}
  var match_no = 1
  Object.keys(data).forEach(match=>{
    if(data[match].match=="UK1" && match_no<=29){
      console.log(data[match]);
      epl_match[match_no]=data[match];
      match_no++;
    }
  }
  );

  var new_folder = "Premier League 2019/"+team;
  createJson(epl_match,new_folder);
}