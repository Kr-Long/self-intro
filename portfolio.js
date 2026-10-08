'use strict';
(() => {
  const video=document.getElementById('portfolioVideo'),start=document.getElementById('loadPortfolioVideo'),status=document.getElementById('videoLoading');
  let videoLoadPromise,videoUrl;
  async function loadVideo(){
    if(!videoLoadPromise)videoLoadPromise=(async()=>{
      start.disabled=true;status.textContent='正在加载作品…';
      const parts=await Promise.all(Array.from({length:6},async(_,i)=>{const response=await fetch(`assets/portfolio/video/part-${i}.bin`);if(!response.ok)throw Error('Video download failed');return response.arrayBuffer();}));
      videoUrl=URL.createObjectURL(new Blob(parts,{type:'video/mp4'}));video.src=videoUrl;
      await new Promise((resolve,reject)=>{video.addEventListener('loadedmetadata',resolve,{once:true});video.addEventListener('error',reject,{once:true});});
      start.hidden=true;status.textContent='';return video;
    })().catch(error=>{videoLoadPromise=null;start.disabled=false;status.textContent='加载暂未完成，请点击重试。';throw error;});
    return videoLoadPromise;
  }
  async function playVideo(fullscreen=false){
    try{await loadVideo();await video.play();if(fullscreen){if(video.requestFullscreen)await video.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();}}
    catch{start.disabled=false;}
  }
  start.addEventListener('click',()=>playVideo());document.getElementById('expandPortfolioVideo').addEventListener('click',()=>playVideo(true));
  video.addEventListener('play',()=>{if(typeof setMusic==='function'&&musicOn)setMusic(false);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  const cards=[...document.querySelectorAll('[data-gallery]')],dialog=document.getElementById('galleryDialog'),image=document.getElementById('galleryImage');
  let selected=0,opener,previousOverflow='';
  function showImage(index){selected=(index+cards.length)%cards.length;const source=cards[selected].querySelector('img');image.src=source.src;image.alt=source.alt;document.getElementById('galleryTitle').textContent=cards[selected].querySelector('strong').textContent;document.getElementById('galleryCount').textContent=`${selected+1} / ${cards.length}`;}
  cards.forEach((card,index)=>card.addEventListener('click',()=>{opener=card;showImage(index);previousOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';}));
  document.getElementById('closeGallery').addEventListener('click',()=>dialog.close());document.getElementById('previousImage').addEventListener('click',()=>showImage(selected-1));document.getElementById('nextImage').addEventListener('click',()=>showImage(selected+1));
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showImage(selected+1);}else if(event.key==='ArrowLeft'){event.preventDefault();showImage(selected-1);}});
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;opener?.focus({preventScroll:true});});
})();
