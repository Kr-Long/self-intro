'use strict';
(() => {
  const canvas=document.getElementById('starfield'),ctx=canvas.getContext('2d');
  if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let width=0,height=0,stars=[],raf=0,lastFrame=0;
  function resize(){
    width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);
    let seed=23171;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    stars=Array.from({length:Math.min(210,Math.max(65,Math.round(width*height/6500)))},()=>({x:random()*width,y:random()*height,r:.5+random()*1.25,alpha:.2+random()*.58,phase:random()*Math.PI*2,speed:.15+random()*.3,gold:random()>.84}));
    draw(performance.now());
  }
  function draw(time){
    ctx.clearRect(0,0,width,height);
    for(const star of stars){const seconds=reduced.matches?0:time/1000;const y=(star.y-seconds*star.speed+height*1000)%height;const alpha=star.alpha*(.8+.2*Math.sin(seconds*.45+star.phase));ctx.fillStyle=star.gold?`rgba(227,180,102,${alpha})`:`rgba(246,236,217,${alpha})`;ctx.beginPath();ctx.arc(star.x,y,star.r,0,Math.PI*2);ctx.fill();}
  }
  function frame(time){if(time-lastFrame>40){draw(time);lastFrame=time;}raf=requestAnimationFrame(frame);}
  function animate(){cancelAnimationFrame(raf);if(!document.hidden&&!reduced.matches)raf=requestAnimationFrame(frame);else draw(performance.now());}
  addEventListener('resize',resize);document.addEventListener('visibilitychange',animate);reduced.addEventListener('change',animate);
  resize();animate();
})();
