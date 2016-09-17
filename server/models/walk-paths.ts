var pg = require('pg');
// var client = new pg.Client();
// var path = require('path');

pg.defaults.ssl = true;
var conString = process.env.DATABASE_URL;
// if (conString.search('localhost')) {
//   // don't have ssl working on local db
//   client.defaults.ssl = false;
// }
  
function handleError(err) {
  if(!err) return false;

  // if(typeof client !== 'undefined' && client){
  //   done(client);
  // }
  return true;
}

function newWalkPath(walkPath, cb){
  // return new Promise(function (resolve, reject) {
    // client.connect(conString, function(err) {
    pg.connect(conString, function(err, client, done) {      
      if(handleError(err)) throw err;
      client.query(
        'SELECT new_walk_path($1,$2,$3,$4,$5,$6)', 
        [walkPath.creatorUserId, walkPath.startLatitude, walkPath.startLongitude, walkPath.endLatitude, walkPath.endLongitude, walkPath.departureTime], 
        function(err, result) {
          if(handleError(err)) throw err;
          var success = result.rows[0].success;
          done();
          cb(null, success);
          // return resolve(success);
        }
      );
    });
  // });
}

var WalkPaths = {
  'newWalkPath': newWalkPath
};

module.exports = WalkPaths;
// export { WalkPaths }