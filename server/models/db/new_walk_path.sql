--DROP FUNCTION public.new_walk_path(date, text, text[], text[], text[], integer[], integer[]);

CREATE OR REPLACE FUNCTION public.new_walk_path(
    creatorUserId text,
    startLatitude text,
    startLongitude text,
    endLatitude text,
    endLongitude text,
    departureTime text,
    description text,
    startAddress text,
    endAddress text)
  RETURNS boolean AS
$BODY$
DECLARE

	walkPathId int;

BEGIN

	INSERT INTO "WalkPath" ("CreatorUserId","StartLatitude","StartLongitude","EndLatitude","EndLongitude","DepartureTime","Description","StartAddress","EndAddress")
		VALUES (creatorUserId, startLatitude, startLongitude, endLatitude, endLongitude, to_timestamp(departureTime, 'YYYY-MM-DD HH24:MI'), description, startAddress, endAddress)
		RETURNING "Id" into walkPathId;
	RAISE NOTICE 'walkPathId %', walkPathId; 

	INSERT INTO "Group" ("WalkPathId","UserId")
		VALUES (walkPathId, creatorUserId);

	RETURN TRUE;	

END;

$BODY$
  LANGUAGE plpgsql VOLATILE