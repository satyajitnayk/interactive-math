myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;

const lowFreq = 200;
const highFreq = 600;

const ctx = myCanvas.getContext('2d');

let audioCtx = null;
let ocs = null;

myCanvas.onclick = function () {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
    // define an occilator
    ocs = audioCtx.createOscillator();
    ocs.frequency.value = 200;
    ocs.start();

    // reduce volume using gain node
    const node = audioCtx.createGain();
    node.gain.value = 0.1;

    // connect the oscilator to the node
    ocs.connect(node);
    node.connect(audioCtx.destination);
  }
};

const A = { x: 100, y: 300 };
const B = { x: 400, y: 100 };

const orange = { r: 230, g: 150, b: 0 };
const blue = { r: 0, g: 70, b: 160 };

animate();

function animate() {
  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);

  const sec = new Date().getTime() / 1000;
  // smoothing function
  const t = (Math.sin(sec * Math.PI) + 1) / 2;
  const C = vLerp(A, B, t);
  drawDot(C, '');

  drawDot(A, 'A');
  drawDot(B, 'B');

  // change background color
  const { r, g, b } = vLerp(orange, blue, t);
  myCanvas.style.backgroundColor = `rgb(${r},${g},${b})`;

  if (ocs) {
    ocs.frequency.value = lerp(lowFreq, highFreq, t);
  }

  ctx.strokeStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 40px Arial';
  ctx.setLineDash([lerp(50, 130, t), 130]);
  ctx.strokeText('click for sound', myCanvas.width / 2, 10);
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillText('click for sound', myCanvas.width / 2, 10);

  requestAnimationFrame(animate);
}
