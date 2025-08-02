create type tier_enum as enum ('free', 'silver', 'gold', 'platinum');

create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamp not null,
  image_url text,
  tier tier_enum not null
);

insert into events (title, description, event_date, image_url, tier) values
-- Free Tier
('Free Intro Session', 'Learn the basics', now() + interval '1 day', 'https://source.unsplash.com/random/400x200?learning', 'free'),
('Open Networking', 'Meet new people', now() + interval '2 days', 'https://source.unsplash.com/random/400x200?networking', 'free'),

-- Silver Tier
('Silver Webinar', 'Deep dive into tools', now() + interval '3 days', 'https://source.unsplash.com/random/400x200?webinar', 'silver'),
('Silver AMA', 'Ask-Me-Anything session', now() + interval '4 days', 'https://source.unsplash.com/random/400x200?discussion', 'silver'),

-- Gold Tier
('Gold Masterclass', 'Advanced training', now() + interval '5 days', 'https://source.unsplash.com/random/400x200?masterclass', 'gold'),
('Gold Summit', 'VIP gathering', now() + interval '6 days', 'https://source.unsplash.com/random/400x200?conference', 'gold');

const tierLevel = {
  free: 1,
  silver: 2,
  gold: 3,
  platinum: 4
}
