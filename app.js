'use strict';
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
  }), { threshold: .08 });
  $$('.reveal').forEach(element => reveal.observe(element));
} else $$('.reveal').forEach(element => element.classList.add('visible'));
const sections = $$('main > section');
let scrolling = false;
function updateScroll() {
  const total = document.documentElement.scrollHeight - innerHeight;
  $('.reading-progress i').style.width = `${total > 0 ? scrollY / total * 100 : 0}%`;
  let active = sections[0].id;
  for (const section of sections) if (section.getBoundingClientRect().top <= innerHeight * .45) active = section.id;
  $$('.chapter-rail a').forEach(a => { const selected = a.hash === `#${active}`; a.classList.toggle('active', selected); if (selected) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); });
  scrolling = false;
}
addEventListener('scroll', () => { if (!scrolling) { scrolling = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();

const impressionResponses = {
  '安静': '你看到了我的日常。聊到喜欢的话题，我也很有表达欲。',
  '有想法': '被你发现了。下一步，是把想法一点点做出来。',
  '真诚': '这是我最珍惜的东西。希望我们能认真认识彼此。',
  '有点可爱': '哈哈，偶尔跳脱一下，也是我的一部分。'
};
$$('[data-impression]').forEach(button => button.addEventListener('click', () => {
  $$('[data-impression]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  $('#impressionReply').textContent = impressionResponses[button.dataset.impression];
  $('#finalImpression').textContent = `你的第一印象是「${button.dataset.impression}」。期待下一次认识。`;
}));

const interests = {
  music: { category:'01 / MUSIC', title:'喜欢最摇滚的，\n也喜欢最扣人心弦的。', description:'音乐是我的大兴趣。也想练好嗓子，把喜欢唱给你听。', caption:'FEEL THE RHYTHM', symbol:null },
  thinking: { category:'02 / PHILOSOPHY & BOOKS', title:'偶尔停下所有事，\n只为认真想一想。', description:'喜欢人生哲学，喜欢引人深思的书，也享受沉思的感觉。', caption:'STAY CURIOUS', symbol:'∞' },
  history: { category:'03 / HISTORY', title:'从古今中外，\n寻找值得讨论的问题。', description:'对历史有很大的研究兴趣，也很喜欢与别人聊历史。', caption:'LOOK BACK. THINK FORWARD.', symbol:'⌛' },
  sport: { category:'04 / MOVE', title:'挥一拍，跑一程。\n让身体也动起来。', description:'喜欢羽毛球和跑步。运动，是生活里的另一种节奏。', caption:'KEEP MOVING', symbol:'↗' },
  ai: { category:'05 / AI & PLAY', title:'一边玩，\n一边创造。', description:'偶尔打瓦、玩 Minecraft。也积累了一些 AI 游戏、图片和视频的创作经验。', caption:'IMAGINE. BUILD. PLAY.', symbol:'✳' },
  explore: { category:'06 / MORE TO EXPLORE', title:'还有很多兴趣，\n等着继续认识。', description:'游泳、马术、射箭、射击、马拉松、滑雪……也期待被你的独特兴趣吸引。', caption:'THE WORLD IS STILL OPEN', symbol:'＋' }
};
$$('[data-interest]').forEach(button => button.addEventListener('click', () => {
  const item = interests[button.dataset.interest];
  $$('[data-interest]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  $('#interestCategory').textContent = item.category;
  $('#interestName').replaceChildren(...item.title.split('\n').flatMap((line,i) => i ? [document.createElement('br'), document.createTextNode(line)] : [document.createTextNode(line)]));
  $('#interestDescription').textContent = item.description;
  const art = document.createElement('div');
  if (item.symbol) { art.className = 'symbol-art'; art.textContent = item.symbol; }
  else { art.className='vinyl'; const label=document.createElement('div'); const text=document.createElement('span'); text.innerHTML='LZB<br>SIDE A'; label.append(text); art.append(label); }
  const caption = document.createElement('span'); caption.className='visual-caption'; caption.textContent=item.caption;
  $('#interestVisual').replaceChildren(art, caption);
  $('#interestDisplay').classList.remove('switching');
  void $('#interestDisplay').offsetWidth;
  $('#interestDisplay').classList.add('switching');
}));
$$('.vision-track details').forEach(detail => detail.addEventListener('toggle', () => {
  if (detail.open) $$('.vision-track details').forEach(other => { if (other !== detail) other.open = false; });
}));

let toastTimer;
function toast(message) { $('#toast').textContent=message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500); }
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const input=document.createElement('textarea'); input.value=text; input.setAttribute('readonly',''); input.style.cssText='position:fixed;left:-9999px'; document.body.append(input); input.select();
    try { return document.execCommand('copy'); } finally { input.remove(); }
  }
}
$('#copyPhone').addEventListener('click', async () => toast(await copyText('16658005991') ? '手机号已复制，期待认识你。' : '请手动复制：16658005991'));
$('#shareSite').addEventListener('click', async () => {
  if (!/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) { toast('这是本地预览。发布后即可分享公网主页。'); return; }
  const data={title:'龙智斌 · 自我介绍 V2',text:'认识一下龙智斌：喜欢思考，也喜欢真诚的朋友。',url:location.href.split('#')[0]};
  try { if (navigator.share) await navigator.share(data); else toast(await copyText(data.url) ? '主页链接已复制。' : '请复制浏览器地址分享主页。'); } catch(error) { if (error.name !== 'AbortError') toast(await copyText(data.url) ? '主页链接已复制。' : '请复制浏览器地址分享主页。'); }
});

// Independently composed, locally synthesized soundtrack; no external audio files.
let audioContext, masterGain, musicTimer, nextBeatTime, beat = 0;
let musicOn = false, musicRequest = 0;
const chords = [[50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64]];
const melody = [74,77,81,77,74,72,69,72,70,74,77,74,70,69,65,69];
const beatLength = 60 / 104;
function tone(midi,time,duration,volume,type='sine') {
  const osc=audioContext.createOscillator(), gain=audioContext.createGain();
  osc.type=type; osc.frequency.value=440*2**((midi-69)/12);
  gain.gain.setValueAtTime(.0001,time); gain.gain.exponentialRampToValueAtTime(volume,time+.025); gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
  osc.connect(gain);gain.connect(masterGain);osc.start(time);osc.stop(time+duration+.02);
}
function kick(time) {
  const osc=audioContext.createOscillator(),gain=audioContext.createGain();
  osc.frequency.setValueAtTime(110,time);osc.frequency.exponentialRampToValueAtTime(42,time+.16);
  gain.gain.setValueAtTime(.13,time);gain.gain.exponentialRampToValueAtTime(.0001,time+.22);
  osc.connect(gain);gain.connect(masterGain);osc.start(time);osc.stop(time+.24);
}
function scheduleMusic() {
  while(musicOn && nextBeatTime < audioContext.currentTime+.25) {
    const chord=chords[Math.floor(beat/8)%4], position=beat%8;
    if(position===0) chord.forEach(note=>tone(note+12,nextBeatTime,beatLength*7.7,.022,'triangle'));
    tone(chord[[0,1,2,3,2,1,3,1][position]]+12,nextBeatTime,beatLength*.9,.045,'triangle');
    if(beat%2===0) tone(melody[(beat/2)%melody.length],nextBeatTime,beatLength*1.75,.034);
    if(position%2===0) kick(nextBeatTime);
    if(position===0||position===4) tone(chord[0]-12,nextBeatTime,beatLength*1.7,.08);
    nextBeatTime+=beatLength;beat++;
  }
}
async function setMusic(on) {
  const request = ++musicRequest;
  try {
    if(on) {
      const Audio=window.AudioContext||window.webkitAudioContext;
      if(!Audio){toast('当前浏览器暂不支持音乐播放。');return;}
      if(!audioContext){audioContext=new Audio();masterGain=audioContext.createGain();masterGain.gain.value=.0001;masterGain.connect(audioContext.destination);}
      await audioContext.resume();if(request!==musicRequest)return;musicOn=true;nextBeatTime=audioContext.currentTime+.06;masterGain.gain.cancelScheduledValues(audioContext.currentTime);masterGain.gain.setTargetAtTime(.65,audioContext.currentTime,.2);scheduleMusic();clearInterval(musicTimer);musicTimer=setInterval(scheduleMusic,80);
    } else { musicOn=false;clearInterval(musicTimer);if(audioContext){masterGain.gain.cancelScheduledValues(audioContext.currentTime);masterGain.gain.setTargetAtTime(.0001,audioContext.currentTime,.1);} }
    $('#music').setAttribute('aria-pressed',String(musicOn));$('#music').classList.toggle('playing',musicOn);$('#musicLabel').textContent=musicOn?'暂停音乐':'开启音乐';$('#storyMusic').setAttribute('aria-pressed',String(musicOn));$('#storyMusic').textContent=musicOn?'音乐：开':'音乐：关';
  } catch {musicOn=false;clearInterval(musicTimer);$('#music').setAttribute('aria-pressed','false');$('#music').classList.remove('playing');$('#musicLabel').textContent='开启音乐';toast('音乐暂时无法播放，请再次点击尝试。');}
}
$('#music').addEventListener('click',()=>setMusic(!musicOn));
$('#storyMusic').addEventListener('click',()=>setMusic(!musicOn));

const story=[
  {title:'你好，我是龙智斌。',text:'大二学生 · ENTJ\n认真想，放手做，真诚交朋友。',art:'portrait'},
  {title:'安静的外表，\n很有想法的内心。',text:'爱沉思，也很有表达欲。\n遇到真诚、有自驱力的人，我愿意多聊。',art:'ENTJ'},
  {title:'我的世界，\n不止一种频率。',text:'音乐、哲学、历史，羽毛球与跑步。\n也喜欢 AI、游戏和未知的新鲜事。',art:'♫'},
  {title:'想得很远，\n先从今天开始。',text:'精进 AI 编程 · 练好嗓子\n学好英语 · 坚持健身',art:'↗'},
  {title:'未来愿景，\n有点大胆。',text:'从 AI 项目，到光电、全息与认知科技。\n再远一点：火箭、新能源、全球互联。',art:'✳'},
  {title:'我能提供的价值：\n陪伴、支持、灵感。',text:'倾听你的心事，讨论生活困惑，分享 AI 创作经验。\n龙智斌 · 16658005991',art:'↔'}
];
let storyIndex=0,storyElapsed=0,storyPaused=false,storyRAF=0,storyLast=0,storyStartedMusic=false;
const storyDuration=10000;
function renderStory() {
  const slide=story[storyIndex];$('#storyIndex').textContent=`0${storyIndex+1} / 06 · ${['你好','性格','兴趣','行动','愿景','同频'][storyIndex]}`;
  $('#storyTitle').textContent=slide.title;$('#storyText').textContent=slide.text;
  if(slide.art==='portrait'){const img=document.createElement('img');img.src='assets/portrait.jpg';img.alt='';$('.story-art').replaceChildren(img);}else $('.story-art').textContent=slide.art;
  $('#storyCount').textContent=`${storyIndex+1} / ${story.length}`;
  $('#previousStory').disabled=storyIndex===0;$('#nextStory').disabled=storyIndex===story.length-1;
  $('.story-progress i').style.width=`${(storyIndex+storyElapsed/storyDuration)/story.length*100}%`;
  $('.story-slide').classList.remove('slide-enter');void $('.story-slide').offsetWidth;$('.story-slide').classList.add('slide-enter');
}
function setPaused(paused){storyPaused=paused;$('#pauseStory').textContent=paused?'继续':'暂停';$('#pauseStory').setAttribute('aria-pressed',String(paused));}
function storyTick(now) {
  if(!$('#storyDialog').open)return;
  if(!storyPaused&&!document.hidden){storyElapsed+=Math.min(now-storyLast,100);if(storyElapsed>=storyDuration){if(storyIndex<story.length-1){storyIndex++;storyElapsed=0;renderStory();}else{storyElapsed=storyDuration;setPaused(true);$('#pauseStory').textContent='再看一次';}}}
  storyLast=now;$('.story-progress i').style.width=`${(storyIndex+storyElapsed/storyDuration)/story.length*100}%`;storyRAF=requestAnimationFrame(storyTick);
}
$('#startStory').addEventListener('click',()=>{storyIndex=0;storyElapsed=0;setPaused(reduceMotion);renderStory();$('#storyDialog').showModal();document.body.style.overflow='hidden';storyLast=performance.now();storyRAF=requestAnimationFrame(storyTick);storyStartedMusic=!musicOn;if(storyStartedMusic)setMusic(true);});
$('#closeStory').addEventListener('click',()=>$('#storyDialog').close());
$('#storyDialog').addEventListener('close',()=>{cancelAnimationFrame(storyRAF);document.body.style.overflow='';if(storyStartedMusic)setMusic(false);$('#startStory').focus();});
$('#pauseStory').addEventListener('click',()=>{if(storyElapsed>=storyDuration&&storyIndex===story.length-1){storyIndex=0;storyElapsed=0;renderStory();setPaused(false);}else setPaused(!storyPaused);});
function moveStory(direction){const target=Math.max(0,Math.min(story.length-1,storyIndex+direction));if(target!==storyIndex){storyIndex=target;storyElapsed=0;renderStory();}}
$('#previousStory').addEventListener('click',()=>moveStory(-1));$('#nextStory').addEventListener('click',()=>moveStory(1));
$('#storyDialog').addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();moveStory(1);}else if(event.key==='ArrowLeft'){event.preventDefault();moveStory(-1);}else if(event.code==='Space'){event.preventDefault();if(!event.repeat)$('#pauseStory').click();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&musicOn)setMusic(false);storyLast=performance.now();});
