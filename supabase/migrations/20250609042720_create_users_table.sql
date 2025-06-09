CREATE TABLE users(
    user_name text PRIMARY KEY,
    rating smallint NOT NULL,
    num_contests smallint NOT NULL,
    last_access timestamp without time zone DEFAULT (now() at time zone 'utc')
)