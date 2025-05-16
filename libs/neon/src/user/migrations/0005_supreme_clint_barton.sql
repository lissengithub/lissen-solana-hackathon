-- Custom SQL migration file, put you code below! --
TRUNCATE TABLE "recommendations_action_points" --> statement-breakpoint

TRUNCATE TABLE "recommendations_thresholds" --> statement-breakpoint

-- Create recommendations thresholds data --
INSERT INTO "recommendations_thresholds" ("name", "value")
VALUES ('album', -8),
    ('artist', -5),
    ('playlist', -10),
    ('song', -1),
    ('genre', -5);
--> statement-breakpoint
-- Create recommendations action points data --
INSERT INTO "recommendations_action_points" ("name", "album", "song", "playlist", "artist")
VALUES (
        'like',
        '{"album": 5,"artist": 2}',
        '{"album": 2,"artist": 1,"genre": 1,"song": 5}',
        '{"playlist": 5}',
        NULL
    ),
    (
        'mute',
        '{"album": -10,"artist": -2,"genre": -2}',
        '{"album": -4,"artist": -2,"genre": -2,"song": -10}',
        '{"genre": -2,"playlist": -10}',
        '{"artist": -10}'
    ),
    (
        'skip',
        NULL,
        '{"album": -1,"artist": -1,"genre": -1,"song": -2}',
        NULL,
        NULL
    ),
    (
        'unlike',
        '{"album": -5,"artist": -2}',
        '{"album": -2,"artist": -1,"genre": -1,"song": -5}',
        '{"playlist": -5}',
        NULL
    );-- Custom SQL migration file, put you code below! --