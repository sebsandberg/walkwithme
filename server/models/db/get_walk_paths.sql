-- Function: public.get_walk_paths()

-- DROP FUNCTION public.get_walk_paths();

CREATE OR REPLACE FUNCTION public.get_walk_paths()
  RETURNS TABLE(walkpathid integer, startlatitude text, startlongitude text, endlatitude text, endlongitude text, departuretime timestamp with time zone, description text, userid text) AS
$BODY$

SELECT  
	wp."Id",
	wp."StartLatitude",
	wp."StartLongitude",
	wp."EndLatitude",
	wp."EndLongitude",
	wp."DepartureTime",
	wp."Description",
	g."UserId"
FROM 
	"WalkPath" wp,
	"Group" g
WHERE
	wp."Id" = g."WalkPathId"
	and wp."DepartureTime" > now()
ORDER BY
	wp."DepartureTime"

$BODY$
  LANGUAGE sql STABLE STRICT
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_walk_paths()
  OWNER TO udttdkotrkqddu;
