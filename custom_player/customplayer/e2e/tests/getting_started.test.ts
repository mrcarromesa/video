import { Selector } from "testcafe";

// fixture`Getting Started`.page`https://devexpress.github.io/testcafe/example`;
fixture`Getting Started`
  .page`http://localhost:6006/iframe.html?viewMode=story&id=progressbar-example-media--media-element`;

test("My first test", async (t) => {
  await t.wait(3000);

  const video = Selector("video", {
    timeout: 30000,
  }).addCustomDOMProperties({
    paused: (el) => (el as unknown as HTMLVideoElement).paused,
  });

  await t.expect(video.exists).ok();

  await t.expect((video as unknown as HTMLVideoElement).paused).ok();
  await t.hover("#playVideo").wait(1000).click("#playVideo");

  await t.expect((video as unknown as HTMLVideoElement).paused).notOk();
});
