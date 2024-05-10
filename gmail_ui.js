
const st = document.createElement('style')
st.innerText = `
  .box {
    background-color: hsl(221, 14%, 100%);
    border-radius: 0.75rem;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    color: #202124;
    padding: 1rem;
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 9;
  }
`

const box = document.createElement('div')
box.className = "box"

const meter = x => {
  const sp = document.createElement('span')
  sp.innerText = x + ": "
  const b = document.createElement('b')
  sp.append(b)
  return sp
}
const brk = () => document.createElement('br')
const x = q => document.querySelector(q)

const loading_bar = {
  is_loading: false,
  counter: 0,
  anim_id: 0,
  animation: () => {
    if (loading_bar.counter == 3) {
      loading_bar.counter = 0
      x('div.loading > b').innerText = "Loading"
    } else {
      loading_bar.counter++;
      x('div.loading > b').innerText += '.'
    }
  },
  html: () => {
    const l = document.createElement('div')
    l.className = "loading"
    const sp = document.createElement('b')
    sp.innerText = "Loading"
    l.append(sp, brk(), brk())
    return l
  },
  set_loading: () => {
    loading_bar.is_loading = true
    x('div.loading').style.display = ''
    loading_bar.anim_id = setInterval(loading_bar.animation, 250)
  },
  finished_loading: () => {
    loading_bar.is_loading = false
    x('div.loading').style.display = 'none'
    clearInterval(loading_bar.anim_id)
  }
}

box.append(
  loading_bar.html(),
  meter("BERT-1"), brk(), brk(), 
  meter("BERT-2"), brk(), brk(), 
  meter("Distilbert-1"), brk(), brk(), 
  meter("Distilbert-2"), brk(), brk(), 
  meter("Roberta-1"), brk(), brk(),
  meter("Roberta-2"))

document.body.append(st, box)

loading_bar.finished_loading()



const in_email = new RegExp(/\#(inbox|spam)\/[A-Za-z]+/)
const socket = new WebSocket('ws://localhost:8000');
const labels = document.querySelectorAll('div.box > span > b')
let on = 0;

socket.onmessage = event => {
  if (event.data == "[0]") {
    labels[on].textContent = "Ham"
    labels[on].style.color = "green"
  } else {
    labels[on].textContent = "Spam"
    labels[on].style.color = "red"
  }
  if (on == 5) {
    on = 0;
    loading_bar.finished_loading()
  } else on++;
};

window.onhashchange = () => {
  if(in_email.test(location.hash) && !loading_bar.is_loading) {
    //const date = new Date(document.querySelector('span.g3').getAttribute('title'))
    const subject = document.querySelector('h2.hP').innerText
    const content = document.querySelector('div.a3s.aiL').innerText
    //.replace(/(?:\r\n|\r|\n|\t)/g, ' ')
    //const sender = document.querySelector('span.gD')

    const template = `Subject: ${subject}:
${content}`
    // `"${sender.getAttribute('name')}" <${sender.getAttribute('email')}> |${date.toUTCString()}|${subject}|${content}`
    socket.send(template)
    loading_bar.set_loading()
    labels.forEach(l => l.innerText = "")
  }
}

/*
const ease = {
  linear: t => t,
  inOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // Find out more at: https://gist.github.com/gre/1650294
};

const counter = (EL) => {

  const duration = 1000; // Animate all counters equally for a better UX

  const start = parseFloat(EL.textContent); // Get start and end values
  const end = Math.random().toPrecision(3) * 100

  if (start === end) return; // If equal values, stop here.

  const range = end - start; // Get the range
  let curr = start; // Set current at start position
  
  const timeStart = Date.now();

  const loop = () => {
    let elaps = Date.now() - timeStart;
    if (elaps > duration) elaps = duration; // Stop the loop
    const norm = ease.inOutQuad(elaps / duration); // normalised value + easing
    const step = norm * range; // Calculate the value step
    curr = start + step; // Increment or Decrement current value
    EL.textContent = Math.trunc(curr * 10) / 10 + "%"; // Apply to UI as integer
    if (elaps < duration) requestAnimationFrame(loop); // Loop
  };

  requestAnimationFrame(loop); // Start the loop!
};
.loading {
    display: none
  }
*/