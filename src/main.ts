import AgoraRTC, {
  IAgoraRTCClient,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  UID,
} from "agora-rtc-sdk-ng";
import './style.css';

let remoteContainer = document.getElementById("remote-container")!;

function addVideoContainer(uid: UID) {
  let streamDiv = document.createElement("div");
  streamDiv.id = String(uid);
  // streamDiv.style.transform = "rotateY(180deg)";
  remoteContainer.appendChild(streamDiv);
}

function removeVideoContainer(uid: UID) {
  let remDiv = document.getElementById(String(uid));
  remDiv && remDiv.parentNode?.removeChild(remDiv);
}

document.getElementById("start")!.onclick = async function () {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
  let appId = (document.getElementById("app-id") as HTMLInputElement).value;
  let channelId = (document.getElementById("channel") as HTMLInputElement)
    .value;
  let token =
    (document.getElementById("token") as HTMLInputElement).value || null;

  const [localAudioTrack, localVideoTrack] =
    await AgoraRTC.createMicrophoneAndCameraTracks();

  initStop(client, localAudioTrack, localVideoTrack);

  localVideoTrack.play("me");

  client.on('content-inspect-connection-state-change', (prev, cur) => {
    console.log('!AF', 'prev', prev, 'cur', cur)
  });

  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === "video") {
      addVideoContainer(String(user.uid));
      user.videoTrack && user.videoTrack.play(String(user.uid));
    }
    if (mediaType === "audio") {
      user.audioTrack && user.audioTrack.play();
    }
  });

  client.on("user-unpublished", async (user, mediaType) => {
    if (mediaType === "video") {
      removeVideoContainer(user.uid);
    }
  });

  const _uid = await client.join(appId, channelId, token, null);
  console.log("uid", _uid);
  
  await client.publish([localAudioTrack, localVideoTrack]);

  client.enableContentInspect({
    interval: 2,
    inspectType: ["moderation"],
  }).then(e=>console.log('!AF on', e));
  
  // @ts-expect-error modify window
  window["AgoraRTC"] = AgoraRTC;window["client"] = client;window["localAudioTrack"] = localAudioTrack;window["localVideoTrack"] = localVideoTrack;
};

function initStop(
  client: IAgoraRTCClient,
  localAudioTrack: IMicrophoneAudioTrack,
  localVideoTrack: ILocalVideoTrack
) {
  const stopBtn = document.getElementById("stop") as HTMLInputElement;
  stopBtn.disabled = false;
  stopBtn.onclick = null;
  stopBtn.onclick = function () {
    client.unpublish();
    localVideoTrack.stop();
    localVideoTrack.close();
    localAudioTrack.stop();
    localAudioTrack.close();
    client.remoteUsers.forEach((user) => {
      if (user.hasVideo) {
        removeVideoContainer(user.uid);
      }
      client.unsubscribe(user);
    });
    client.removeAllListeners();
    stopBtn.disabled = true;
  };
}
