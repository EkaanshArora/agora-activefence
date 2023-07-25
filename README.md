# Agora x ActiveFence
This is a simple demo of using Agora Video SDK with ActiveFence for moderation.

To enable ImageModeration in the SDK, you can call the `setImageModeration` method:
```js
  await client.join(appId, channelId, token, null);
  client.setImageModeration(true, {interval: 1000}).then(() => console.log('ImageModeration turned on!'));
```
> Make sure you call this after joining the channel.

You can keep a track of the connection status using the `image-moderation-connection-state-change` event:
```js
  client.on('image-moderation-connection-state-change', (cur, prev) => {
    console.log('AF status:', 'prev', prev, 'cur', cur)
  });
```

## How to run the sample
Make sure you have Node.js and NPM installed.
```bash
$ git clone https://github.com/EkaanshArora/agora-activefence
$ cd agora-activefence
# install pnpm
$ npm i -g pnpm
# install dependencies
$ pnpm i
$ pnpm dev
# this should start a vite server on http://localhost:5173/
