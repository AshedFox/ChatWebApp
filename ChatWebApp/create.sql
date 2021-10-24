/*TODO: Change chat structure to provide different types (e.g. dialog, conversation)*/

create table if not exists files (
    id uuid primary key default uuid_generate_v4(),
    name varchar(200) not null,
    path text not null,
    content_type varchar(100) not null
);

create table if not exists users (
    id uuid primary key default uuid_generate_v4(),
    username varchar(200) unique not null,
    email varchar(320) unique not null,
    password_hash text not null,
    salt varchar not null,
    name varchar(200) not null,
    created_at timestamp not null default now(),
    image_file_id uuid references files(id)
);

create table if not exists devices (
    id uuid not null,
    user_id uuid not null references users(id),
    refresh_token uuid,
    validTo timestamp not null
);

create table if not exists chats(
    id uuid primary key default uuid_generate_v4(),
    name varchar(200) not null,
    image_file_id uuid references files(id)
);

create table if not exists chats_users(
    chat_id uuid not null references chats(id),
    user_id uuid not null references users(id),
    is_left bool not null default true
);

create table if not exists messages (
    id uuid primary key default uuid_generate_v4(),
    sender_id uuid not null references users(id),
    chat_id uuid not null references chats(id),
    content text not null default '',
    sent_at timestamp not null default now()
);

create table if not exists messages_files (
    message_id uuid not null references messages(id),
    file_id uuid not null references files(id)
);

alter table chats_users
add constraint chat_user_unique unique (chat_id, user_id);

alter table messages_files
add constraint message_file_unique unique (message_id, file_id);