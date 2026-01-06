const upload = document.getElementById("upload");
const exportBtn = document.getElementById("exportBtn");

const canvases = {
  igPost: document.getElementById("igPost"),
  igStory: document.getElementById("igStory"),
  twitter: document.getElementById("twitter"),
  youtube: document.getElementById("youtube"),
};

const checkboxes = {
  igPost: document.getElementById("cbIgPost"),
  igStory: document.getElementById("cbIgStory"),
  twitter: document.getElementById("cbTwitter"),
  youtube: document.getElementById("cbYoutube"),
};

const sizes = {
  igPost: [1080, 1080],
  igStory: [1080, 1920],
  twitter: [1200, 675],
  youtube: [1280, 720],
};

function drawImage(canvas, img, w, h) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);

  const ratio = Math.min(w / img.width, h / img.height);
  const x = (w - img.width * ratio) / 2;
  const y = (h - img.height * ratio) / 2;

  ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
}

upload.addEventListener("change", () => {
  const file = upload.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    for (let key in canvases) {
      drawImage(canvases[key], img, ...sizes[key]);
    }
  };
  img.src = URL.createObjectURL(file);
});

exportBtn.addEventListener("click", async () => {
  const zip = new JSZip();

  for (let key in canvases) {
    if (checkboxes[key].checked) {
      const canvas = canvases[key];
      zip.file(`${key}.png`, canvas.toDataURL().split(",")[1], { base64: true });
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(content);
  a.download = "quickexport.zip";
  a.click();
});
