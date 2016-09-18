var pg = require('pg');

pg.defaults.ssl = true;
var conString = process.env.DATABASE_URL;
  
function handleError(err) {
  if(!err) return false;
  return true;
}

function newWalkPath(walkPath, cb){

    // convert departure time to UTC since db is in UTC time
    // console.log("orig - " + walkPath.departureTime);
    // var departureTime = new Date(walkPath.departureTime).toISOString();
    // console.log("new - " + departureTime);

    pg.connect(conString, function(err, client, done) {      
      if(handleError(err)) throw err;
      client.query(
        'SELECT new_walk_path($1,$2,$3,$4,$5,$6,$7)', 
        [walkPath.creatorUserID, walkPath.startLatitude, walkPath.startLongitude, walkPath.endLatitude, walkPath.endLongitude, walkPath.departureTime, walkPath.description], 
        function(err, result) {
          if(handleError(err)) throw err;
          var success = result.rows[0].success;
          done();
          cb(null, success);
        }
      );
    });
}

function getWalkPaths(cb){
    
    pg.connect(conString, function(err, client, done) {      
      if(handleError(err)) throw err;
      
      client.query('SELECT * FROM get_walk_paths()', function(err, result) {
        if(handleError(err)) throw err;

        var walkPathsList = [];
        var isNewWalkPath = true;
        let walkPath: any = {};
        var usersList = [];
        var prevWalkPathId = '';
        let dbWalkPath: any = {};
        for (var i = 0; i < result.rows.length; i++) {
          dbWalkPath = result.rows[i];
          // console.log(JSON.stringify(dbWalkPath));
          walkPath = {};
          walkPath.WalkPathId = dbWalkPath.walkpathid;
          walkPath.StartLatitude = dbWalkPath.startlatitude;
          walkPath.StartLongitude = dbWalkPath.startlongitude;
          walkPath.EndLatitude = dbWalkPath.endlatitude;
          walkPath.EndLongitude = dbWalkPath.endlongitude;
          // console.log(dbWalkPath.departuretime);
          // console.log((new Date(dbWalkPath.departuretime)).toString());
          // walkPath.DepartureTime = new Date(dbWalkPath.departuretime).Parse();
          walkPath.DepartureTime = dbWalkPath.departuretime;
          walkPath.Description = dbWalkPath.description;
          walkPath.UsersInGroup = [dbWalkPath.userid];
          if (isNewWalkPath) {
            if (i != 0) {
              // console.log("*****" + JSON.stringify(walkPath));
              walkPathsList.push(prevWalkPath);
            }
            
            isNewWalkPath = false;
            // prevWalkPathId = '';
          }
          // console.log(dbWalkPath.walkpathid);
          // console.log(prevWalkPathId);
          if (i != 0 && dbWalkPath.walkpathid != prevWalkPathId) {
            isNewWalkPath = true;
          } else if (i != 0) {
            walkPath.UsersInGroup.push(dbWalkPath.userid);
          }
          // console.log(isNewWalkPath);
          prevWalkPathId = dbWalkPath.walkpathid;
          prevWalkPath = walkPath;
        }
        if (result.rows.length > 0) {
          walkPathsList.push(walkPath);
        }

        done();
        cb(null, walkPathsList);
      });

      
    });

    // convert departure time from UTC since db is in UTC time
    // var departureTime = walkPath.departureTime.fromISOString();;

}

var WalkPaths = {
  'newWalkPath': newWalkPath,
  'getWalkPaths': getWalkPaths
};

module.exports = WalkPaths;
// export { WalkPaths }