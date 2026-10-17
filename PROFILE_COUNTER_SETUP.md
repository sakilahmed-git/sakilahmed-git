# Self-hosted GitHub profile-view counter

This replaces the Komarev image with a Cloudflare Worker backed by Cloudflare D1.

## 1. Create a D1 database

1. Sign in at https://dash.cloudflare.com/
2. Open Workers & Pages → D1 SQL Database and create a database named `profile-views`.
3. Run the SQL in `profile-counter/schema.sql` in its SQL console.

## 2. Create the Worker

1. Open Workers & Pages → Create → Worker and name it `profile-view-counter`.
2. Paste the code from `profile-counter/src/index.js`.
3. Add a D1 database binding named `DB` and select `profile-views`.
4. Deploy and copy the public Worker URL.

## 3. Test, then update README

Open `https://YOUR-WORKER-URL/?username=sakilahmed-git&label=PROFILE+VIEWS`. It should display an SVG badge and increment the persistent counter.

Only after testing, replace the Komarev image in README.md with:

```html
<img src="https://YOUR-WORKER-URL/?username=sakilahmed-git&label=PROFILE+VIEWS" alt="Profile views"/>
```

Replace `YOUR-WORKER-URL` with the actual deployed URL. Do not use the placeholder in your README.

## Notes

The count is persisted in your D1 database and does not rely on Komarev. It counts requests reaching the endpoint, not unique people; refreshes, preview bots and image proxies may count. A public endpoint can be requested repeatedly, so it is an approximate view-request count, not analytics-grade unique visitors.
