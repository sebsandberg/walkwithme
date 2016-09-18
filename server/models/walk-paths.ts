var pg = require('pg');

pg.defaults.ssl = true;
var conString = process.env.DATABASE_URL || 'postgres://udttdkotrkqddu:FrX5qYug86ueaOjyx8Cdjwp3Mh@ec2-107-22-250-212.compute-1.amazonaws.com:5432/d2r64t6b95nlv0';

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
        'SELECT new_walk_path($1,$2,$3,$4,$5,$6,$7,$8,$9)',
        [walkPath.CreatorUserID,walkPath.StartLatitude,walkPath.StartLongitude,walkPath.EndLatitude,walkPath.EndLongitude,walkPath.DepartureTime,walkPath.Description,walkPath.StartAddress,walkPath.EndAddress],
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
        var nextWalkPathId = '';
        let dbWalkPath: any = {};
        let prevWalkPath: any = {};
        for (var i = 0; i < result.rows.length; i++) {
          dbWalkPath = result.rows[i];
          // console.log(JSON.stringify(dbWalkPath));

          if (isNewWalkPath) {
            if (i != 0) {
              // console.log("*****" + JSON.stringify(walkPath));
              walkPathsList.push(walkPath);
            }

            isNewWalkPath = false;
            // prevWalkPathId = '';
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
            walkPath.StartAddress = dbWalkPath.startaddress;
            walkPath.EndAddress = dbWalkPath.endaddress;
            walkPath.UsersInGroup = [];
          }

          // console.log(dbWalkPath.walkpathid);
          // console.log(prevWalkPathId);

          walkPath.UsersInGroup.push(dbWalkPath.userid);

          if (i < result.rows.length - 1) {
            nextWalkPathId = result.rows[i+1].walkpathid;
          } else {
            nextWalkPathId = '';
          }
          if (dbWalkPath.walkpathid != nextWalkPathId) {
            isNewWalkPath = true;
          }
          // console.log(isNewWalkPath);



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