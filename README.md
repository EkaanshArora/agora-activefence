# Agora Content Inspect Moderation Showcase for Web

This GitHub project showcases the content inspect moderation features available with Agora and their partner ActiveFence. It demonstrates how to enable and use the Agora Content Inspector to moderate content in real-time during Agora video calls.

> This feature is not yet live, so the full configuration may not yet be available.

## Prerequisites

Before getting started, ensure that you have the following:

- An Agora developer account. If you don't have one, you can create an account at the [Agora Developer Console](https://console.agora.io).
- Node/NPM LTS
- Basic knowledge of JavaScript and Web Development.

## Installation

To run the project locally, follow these steps:

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
```
### Optional: Set up Kicking Server
   1. Head to [agora-activefence-kicker](https://github.com/AgoraIO-Community/agora-activefence-kicker) and use the one-click deployment for the server
   2. Add the deployment link + `/kick/` to the webhook URL for the desired event in the ActiveFence dashboard.

## Usage

Focusing on only the content moderation portions, this example app completes the following steps:

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

To Catch Banning Events you can utilise the `connection-state-change` event:

```ts
client.on("connection-state-change", (cur, prev, reason) => {
		console.log("connection:", "prev", prev, "cur", cur, "reason:", reason);
		if (reason === ConnectionDisconnectedReason.UID_BANNED) {
			if (confirm("You are kicked from this channel, reload?")) {
				window.location.reload();
			}
		}
	});
```

> This will only happen if you have applied the `Kicking Server` steps above, or created your own kicking server that communicates with ActiveFence.

## Contributing

Contributions to this project are welcome. If you find any issues or have suggestions for improvements, please feel free to open a GitHub issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
