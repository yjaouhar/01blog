CREATE EXTENSION IF NOT EXISTS "pgcrypto";

INSERT INTO users (
    id,
    first_name,
    last_name,
    birthday,
    gender,
    username,
    email,
    bio,
    avatar,
    activ,
    password,
    role
)
SELECT
    gen_random_uuid(),
    'Admin',
    'User',
    '2000-01-01',
    'male',
    'admin',
    'admin@local',
    'Default admin account',
    '/uploads/avatar/adminAvatar.jpg',
    true,
    '$2a$10$LkedyVkgA3G26H28dJISD.KmBEeVjv7EaVkM4s87Soq7YdNavMw4a',
    'ADMIN'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);
