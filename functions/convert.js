  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyD9TU5sbf2RsqZwSedc6MzjmoYXdsIa378",
    authDomain: "scorescraper.firebaseapp.com",
    databaseURL: "https://scorescraper.firebaseio.com",
    storageBucket: "scorescraper.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();

  console.log(firebase);