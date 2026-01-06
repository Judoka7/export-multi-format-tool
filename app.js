const upload = document.getElementById("upload");
const igPost = document.getElementById("igPost");
const igStory = document.getElementById("igStory");
const twitter = document.getElementById("twitter");
const exportBtn = document.getElementById("exportBtn");

const sizes = {
  igPost: [1080, 1080],
  igStory: [1080, 1920],
  twitter: [1200, 675],
};

function drawImage(canvas, img, w, h) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);

  const ratio = Math.min(w / img.width, h / img.height);
  const x = (w - img.width * ratio) / 2;
  const y = (h - img.height * ratio) / 2;

  ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
}

upload.addEventListener("change", () => {
  const file = upload.files[0];
  const img = new Image();
  img.onload = () => {
    drawImage(igPost, img, ...sizes.igPost);
    drawImage(igStory, img, ...sizes.igStory);
    drawImage(twitter, img, ...sizes.twitter);
  };
  img.src = URL.createObjectURL(file);
});

exportBtn.addEventListener("click", async () => {
  const zip = new JSZip();
  zip.file("instagram.png", igPost.toDataURL().split(",")[1], { base64: true });
  zip.file("story.png", igStory.toDataURL().split(",")[1], { base64: true });
  zip.file("twitter.png", twitter.toDataURL().split(",")[1], { base64: true });

  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "quickexport.zip";
  a.click();
});
