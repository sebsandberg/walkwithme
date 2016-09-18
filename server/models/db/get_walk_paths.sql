-- Function: public.get_walk_paths(text)
--
-- Sample function call:
-- SELECT * FROM get_walk_paths();

-- DROP FUNCTION public.get_walk_paths();

CREATE OR REPLACE FUNCTION public.get_walk_paths()
  RETURNS TABLE(WalkPathId integer, StartLatitude text, StartLongitude text, EndLatitude text, EndLongitude text, DepartureTime integer, user text) AS
$BODY$

SELECT  
	wp."WalkPathId",
	wp."StartLatitude",
	wp."StartLongitude",
	wp."EndLatitude",
	wp."EndLongitude",
	wp."DepartureTime",
	g."UserId"
FROM 
	"WalkPath" wp,
	"Group" g
WHERE
	wp."WalkPathId" = g."WalkPathId"
	and wp."DepartureTime" > now()
ORDER BY
	wp."DepartureTime"

$BODY$
  LANGUAGE sql STABLE STRICT