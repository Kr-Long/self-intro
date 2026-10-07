'use strict';
// A gentle original 64-beat score, inspired by the reference's layered synth arrangement.
// Render once, wrap the reverb tail into the opening, then loop the buffer sample-accurately.
async function createGentleMusicLoop() {
  const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!Offline) throw new Error('Offline audio is unavailable');
  const sampleRate = 32000, beatSeconds = 60 / 84;
  const cycleFrames = Math.round(64 * beatSeconds * sampleRate), tailFrames = 5 * sampleRate;
  const ctx = new Offline(2, cycleFrames + tailFrames, sampleRate);
  const bus = ctx.createGain(); bus.gain.value = .7;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value=-20; compressor.knee.value=18; compressor.ratio.value=2;
  compressor.attack.value=.03; compressor.release.value=.35;
  bus.connect(compressor); compressor.connect(ctx.destination);
  const reverb = ctx.createConvolver(), wet = ctx.createGain(); wet.gain.value=.16;
  const impulse = ctx.createBuffer(2, sampleRate * 3, sampleRate);
  let seed = 19027;
  for(let channel=0;channel<2;channel++) {
    const data=impulse.getChannelData(channel);
    for(let i=0;i<data.length;i++){seed=(1664525*seed+1013904223)>>>0;data[i]=(seed/4294967296*2-1)*Math.exp(-i/(sampleRate*.48));}
  }
  reverb.buffer=impulse;wet.connect(reverb);reverb.connect(bus);
  const delay=ctx.createDelay(2), echo=ctx.createGain(), echoTone=ctx.createBiquadFilter();
  delay.delayTime.value=beatSeconds*.75;echo.gain.value=.13;
  echoTone.type='lowpass';echoTone.frequency.value=1700;
  delay.connect(echoTone);echoTone.connect(echo);echo.connect(bus);
  const hz = note => 440 * 2 ** ((note-69)/12);
  function voice(note,start,duration,volume,type,attack,pan=0) {
    const osc=ctx.createOscillator(), gain=ctx.createGain(), filter=ctx.createBiquadFilter(), stereo=ctx.createStereoPanner();
    osc.type=type;osc.frequency.value=hz(note);filter.type='lowpass';filter.frequency.value=type==='triangle'?2200:3000;stereo.pan.value=pan;
    gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(volume,start+attack);
    gain.gain.setTargetAtTime(.000001,start+attack,Math.max(.15,(duration-attack)/4));
    gain.gain.linearRampToValueAtTime(0,start+duration);
    osc.connect(filter);filter.connect(gain);gain.connect(stereo);stereo.connect(bus);stereo.connect(wet);
    if(type==='triangle')stereo.connect(delay);
    osc.start(start);osc.stop(start+duration+.02);
  }
  const harmony=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,59],[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,62]];
  const lead=[64,67,69,67,64,67,72,71,69,72,74,72,71,74,76,74,72,76,79,76,74,77,79,77,76,74,72,69,71,69,67,62];
  // Low -> gently brighter and higher -> settle back to the opening, once every ~46 seconds.
  for(let bar=0;bar<8;bar++) {
    const start=bar*8*beatSeconds, notes=harmony[bar];
    const energy=[.52,.62,.74,.9,1,.94,.75,.55][bar];
    notes.forEach((note,i)=>voice(note,start,8*beatSeconds+1.8,.035*energy,'sine',.8,(i-1.5)*.3));
    voice(notes[0]-12,start,7.5*beatSeconds,.045*energy,'sine',.45);
    for(let step=0;step<8;step++){
      const note=notes[[1,2,3,2,1,3,2,1][step]]+12;
      voice(note,start+step*beatSeconds,2.8*beatSeconds,.028*energy,'triangle',.055,step%2?-.25:.25);
    }
    for(let step=0;step<4;step++){
      const time=start+step*2*beatSeconds;
      voice(lead[bar*4+step],time,3*beatSeconds,.067*energy,'sine',.065,.08);
      voice(lead[bar*4+step]+12,time,2*beatSeconds,.006*energy,'sine',.12,-.12);
    }
  }
  const rendered=await ctx.startRendering(), loop=ctx.createBuffer(2,cycleFrames,sampleRate);
  for(let channel=0;channel<2;channel++) {
    const source=rendered.getChannelData(channel), target=loop.getChannelData(channel);
    target.set(source.subarray(0,cycleFrames));
    for(let i=0;i<tailFrames;i++)target[i]+=source[cycleFrames+i];
  }
  return loop;
}
