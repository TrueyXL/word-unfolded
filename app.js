/* Word Unfolded: Bible plan, study and exam app. Vanilla JS, no build step. */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const app=$("#app");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const BOOKS=window.BOOKS, BY={}; BOOKS.forEach((b,i)=>{b.i=i;BY[b.n]=b});
const SUM=window.SUMMARIES||{}, EX=window.EXAMS||{}, ESS=window.ESSAYS||{}, SECT=window.SECTIONS||[], GL=window.GLOSSARY||[];
const todayStr=(d=new Date())=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const parseDay=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const daysBetween=(a,b)=>Math.round((parseDay(b)-parseDay(a))/864e5);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const key=(b,c)=>b+"|"+c;

/* ---------- icons ---------- */
const I={
 today:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/><circle cx="12" cy="12" r="4"/></svg>',
 bible:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2.5Z"/><path d="M19 17v4H6.5"/><path d="M11.5 7v6M9 9.5h5"/></svg>',
 study:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 9 10-5 10 5-10 5Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/><path d="M22 9v6"/></svg>',
 notes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
 me:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
 next:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
 gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
 logo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.6-5-2-8-1.5v14c3-.5 6-.1 8 1.5 2-1.6 5-2 8-1.5v-14C17 4 14 4.4 12 6Z"/><path d="M12 6v14"/></svg>',
 flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 9.5a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5s.5 2 2 2.5C10 7 12 2 12 2Z"/></svg>'
};

/* ---------- storage / auth ---------- */
const LS={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const FB=window.FIREBASE_CONFIG&&window.FIREBASE_CONFIG.apiKey?window.FIREBASE_CONFIG:null;
let user=null;        // {id,name,mode:'local'|'cloud',email}
let S=null;           // state
let fbDoc=null, saveTimer=null;

function defaultState(name){return{v:1,name,created:todayStr(),plan:null,read:{},days:{},hl:{},journal:{},prefs:{size:19,purple:true,version:"webbe",theme:document.documentElement.dataset.theme||"sage"},exams:{},cards:{},lastRead:null}}
function save(){
  if(!user)return;
  LS.set("wu:state:"+user.id,S);
  if(user.mode==="cloud"&&fbDoc){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{fbDoc.set({state:JSON.stringify(S),updated:Date.now()}).catch(e=>console.warn("sync",e))},1200)}
}
async function sha(s){
  try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
  catch(e){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return "x"+h}
}
function startSession(u,state){
  user=u;S=Object.assign(defaultState(u.name),state||LS.get("wu:state:"+u.id,null)||{});
  S.prefs=Object.assign(defaultState().prefs,S.prefs||{});
  applyPrefs();LS.set("wu:active",{id:u.id,name:u.name,mode:u.mode});save();
  if(!location.hash||location.hash==="#/login")location.hash=S.plan?"#/today":"#/setup";else route();
}
function logout(){
  LS.del("wu:active");user=null;S=null;
  if(FB&&window.firebase&&firebase.auth)firebase.auth().signOut().catch(()=>{});
  location.hash="#/login";
}

/* ---------- prefs ---------- */
const THEMES=[
 {id:"sage",name:"Sage",c:["#F5F1EA","#4F7A63","#D39A52"]},
 {id:"blush",name:"Blush",c:["#FBF3F1","#B9506E","#D98E6A"]},
 {id:"ocean",name:"Ocean",c:["#EEF3F6","#2C6A96","#D9A441"]},
 {id:"clay",name:"Clay",c:["#F6EFE8","#B5643C","#5E7F6E"]},
 {id:"midnight",name:"Midnight",c:["#12141A","#7FB89A","#E3B567"]},
 {id:"dusk",name:"Dusk",c:["#16131C","#E58FA8","#E8B27A"]}];
function applyPrefs(){
  const t=S?S.prefs.theme:LS.get("wu:theme",null)||"sage";
  document.documentElement.dataset.theme=t;try{localStorage.setItem("wu:theme",t)}catch(e){}
  if(S)document.documentElement.style.setProperty("--read-size",S.prefs.size+"px");
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
}

/* ---------- toast / sheet ---------- */
let toastT;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("on"),2200)}
function openSheet(html){$("#sheet").innerHTML=html;$("#sheet").classList.add("on");$("#sheetBg").classList.add("on")}
function closeSheet(){$("#sheet").classList.remove("on");$("#sheetBg").classList.remove("on")}
$("#sheetBg").onclick=closeSheet;

/* ---------- plan ---------- */
const ALL=[];BOOKS.forEach(b=>{for(let c=1;c<=b.ch;c++)ALL.push(key(b.n,c))});
function orderList(order){
  if(order==="mixed"){ // OT and NT side by side, each finishing at the same time
    const ot=ALL.filter(k=>BY[k.split("|")[0]].t==="OT"), nt=ALL.filter(k=>BY[k.split("|")[0]].t==="NT"), out=[];let i=0,j=0;
    while(i<ot.length||j<nt.length){ if(j>=nt.length||(i<ot.length&&i/ot.length<=j/nt.length))out.push(ot[i++]);else out.push(nt[j++]) }
    return out;
  }
  if(order==="ntfirst"){ // NT + major prophets first, then the rest
    const pri=k=>{const b=BY[k.split("|")[0]];return b.t==="NT"?0:b.g==="Major Prophet"?1:2};
    return ALL.slice().sort((a,b)=>pri(a)-pri(b)||ALL.indexOf(a)-ALL.indexOf(b));
  }
  return ALL;
}
function todaysReading(){
  const t=todayStr();
  if(!S.plan)return [];
  if(S.days[t])return S.days[t];
  const list=orderList(S.plan.order).filter(k=>!S.read[k]);
  const left=Math.max(1,daysBetween(t,S.plan.end)+1);
  const n=Math.min(list.length,Math.ceil(list.length/left));
  S.days[t]=list.slice(0,n);
  // keep only the last 60 days of daily lists
  const ks=Object.keys(S.days).sort();while(ks.length>60)delete S.days[ks.shift()];
  save();return S.days[t];
}
function streak(){
  const days=new Set(Object.values(S.read));let n=0,d=new Date();
  if(!days.has(todayStr(d)))d.setDate(d.getDate()-1);
  while(days.has(todayStr(d))){n++;d.setDate(d.getDate()-1)}
  return n;
}
function markRead(k,on){if(on)S.read[k]=todayStr();else delete S.read[k];save()}
const readCount=b=>{let n=0;for(let c=1;c<=b.ch;c++)if(S.read[key(b.n,c)])n++;return n};

/* ---------- Bible text ---------- */
const VERSIONS=[{id:"webbe",name:"WEB",full:"World English Bible",inapp:true},{id:"kjv",name:"KJV",full:"King James Version",inapp:true},
 {id:"NIV",name:"NIV"},{id:"ESV",name:"ESV"},{id:"NLT",name:"NLT"},{id:"AMPC",name:"AMPC"},{id:"NKJV",name:"NKJV"}];
const bgUrl=(b,c,v)=>`https://www.biblegateway.com/passage/?search=${encodeURIComponent(b+" "+c)}&version=${v}`;
const memCache={};
async function fetchChapter(b,c,tr){
  const ck=`wu:txt:${tr}:${b}:${c}`;
  if(memCache[ck])return memCache[ck];
  const cached=LS.get(ck,null);if(cached){memCache[ck]=cached;return cached}
  const url=`https://bible-api.com/${encodeURIComponent(b+" "+c)}?translation=${tr}`;
  for(let attempt=0;attempt<3;attempt++){
    const r=await fetch(url);
    if(r.status===429){await new Promise(z=>setTimeout(z,2500*(attempt+1)));continue}
    if(!r.ok)throw new Error("HTTP "+r.status);
    const j=await r.json();
    const vs=(j.verses||[]).map(v=>({v:v.verse,t:v.text.replace(/\s*\n\s*/g," ").replace(/\s+/g," ").trim()}));
    memCache[ck]=vs;
    // small LRU cache of chapters in localStorage
    const idx=LS.get("wu:txtidx",[]).filter(x=>x!==ck);idx.push(ck);
    while(idx.length>80)LS.del(idx.shift());
    LS.set(ck,vs);LS.set("wu:txtidx",idx);
    return vs;
  }
  throw new Error("Busy, try again in a few seconds");
}

/* --- God's speech detection (OT). Heuristic and documented in About. --- */
const DIV="(?:the )?(?:LORD|Lord GOD|Lord LORD|Lord Yahweh|Yahweh|God|Lord|Almighty|Most High|Holy One of Israel|Holy One|LORD of Armies|LORD of Hosts|LORD God)";
const INTRO_RE=new RegExp("(?:\\b"+DIV+"(?:’s| himself)?(?: voice| word)?[^.!?“”]{0,45}\\b(?:said|says|saith|spoke|speaks|spake|answered|called|commanded|declares|declared|swore|saying|replied|asked|has spoken|hath spoken|came)\\b[^“”]{0,60}$)|(?:\\b(?:thus says|thus said|thus saith|says the LORD|declares the LORD|says the Lord)\\b[^“”]{0,70}$)","i");
const INNER_RE=/\b(says the (?:LORD|Lord)|says the Lord GOD|the Lord GOD says|Lord GOD says|the LORD says|the LORD of Armies says|says Yahweh|Yahweh says|declares the LORD|says your God|says the Holy One|I am the LORD|I am Yahweh|I, the LORD|I, Yahweh|thus says the LORD|saith the LORD)\b/;
const VERSE_RE=/\b(says the (?:LORD|Lord)|the LORD says|says the Lord GOD|says Yahweh|declares the LORD|saith the LORD|thus saith the LORD|Thus says the LORD|the LORD of Armies says)\b/;
const TO_GOD_RE=/\b(?:said|prayed|cried|called|answered|replied)\s+(?:to|unto)\s+(?:the )?(?:LORD|God|Yahweh)\b/i;
function godSegments(vs){
  // returns per verse an array of [text, isGod]
  let full="",starts=[];vs.forEach(v=>{starts.push(full.length);full+=v.t+" "});
  const spans=[];let open=-1,seen=false,sq=0,deep=0;
  for(let i=0;i<full.length;i++){
    const ch=full[i];
    if(ch==="“"){if(open<0){open=i;sq=0;deep=0}else if(sq>0)deep++;seen=true}
    else if(ch==="‘"){if(open>=0)sq++}
    else if(ch==="’"){if(sq>0&&!/[A-Za-z]/.test(full[i+1]||""))sq--}
    else if(ch==="”"){
      if(open<0&&!seen)open=0;
      if(open>=0){if(deep>0)deep--;else{spans.push([open,i+1]);open=-1;sq=0}}
      seen=true}
  }
  if(open>=0)spans.push([open,full.length]);
  const marks=new Uint8Array(full.length);
  let lastEnd=0,lastThird=null;const hist=[];
  for(const [s,e] of spans){
    const before=full.slice(Math.max(lastEnd,s-200),s), tail=before.slice(-90);
    const inner=full.slice(s,e);
    let who;
    const sent=before.split(/[.!?;][”’]?\s|[”’]\s/).pop();
    const NOTNAME="(?:Then|So|And|But|Now|Moreover|Again|Therefore|He|She|They|I|We|When|To|Also|Yet|Behold|If|Thus|The|This|That|In|On|At|After|As|For|Afterward|Furthermore|Hear|Listen|Unto)";
    const PRON=/\b(?:he|He)\s+(?:said|says|answered|replied|called|cried|spoke|asked)\b|\bsaid he\b/;
    if(INTRO_RE.test(sent)&&!TO_GOD_RE.test(sent))who="god";
    else if(/\bI\s+(?:\w+\s+){0,2}(?:said|answered|replied|cried|say|prayed)\b|\bsaid I\b|\bwe\s+(?:said|answered|say)\b/i.test(sent))who="self";
    else if(PRON.test(sent)){
      const gap=lastEnd>0?full.slice(lastEnd,s).trim().length:999, last=hist[hist.length-1], prev=hist[hist.length-2];
      const fallback=lastThird||(/\b(?:LORD|God|Lord GOD)\b/.test(full.slice(Math.max(0,s-400),s))?"god":"other");
      if(/\b(?:moreover|again|also|furthermore)\b/i.test(sent)||/\b(?:to|unto)\s[^,“”]{1,30}\b(?:he|He)\s+said/i.test(sent))who=fallback;
      else if(gap<30&&last){ // back-and-forth dialogue: speakers alternate
        if(last==="self")who=fallback;
        else who=(prev&&prev!==last&&prev!=="self")?prev:(last==="god"?"other":"god");
      } else who=fallback;
    }
    else if(new RegExp("\\b(?!"+NOTNAME+"\\b)[A-Z][a-z]+\\b[^“”]*\\b(?:said|says|answered|replied|cried|called|spoke|asked|prayed|commanded|swore)\\b").test(sent))who="other";
    else if(lastEnd>0&&hist.length&&(full.slice(lastEnd,s).trim().length<4||/^[\s,]*(?:says|declares|saith)\s+(?:the |your |our )?(?:LORD|Lord|Yahweh|God|Holy One)[^“”]{0,40}$/.test(full.slice(lastEnd,s))))who=hist[hist.length-1]==="self"?"other":hist[hist.length-1];
    else if(s===0)who=lastThird||"unknown";
    else who="other";
    if(INNER_RE.test(inner))who="god";
    if(/^[\s,]*(?:says|said|declares|saith)\s+(?:the |your |our )?(?:LORD|Lord|Yahweh|God|Holy One)\b/.test(full.slice(e,e+40)))who="god";
    if(who==="god")marks.fill(1,s,e);
    else{ // a prophet relaying God's words: “The LORD… says: ‘…’”
      const re=/\b(?:LORD|Lord GOD|God of Israel|God of Armies|LORD of Armies)\b[^‘“”.]{0,60}\bsays?:?\s*‘/g;let m;
      while((m=re.exec(inner))){marks.fill(1,s+m.index+m[0].length-1,e)}
    }
    if(who==="god"||who==="other")lastThird=who;
    hist.push(who==="unknown"?"other":who);
    lastEnd=e;
  }
  const kjvStyle=spans.length===0;
  return vs.map((v,i)=>{
    const a=starts[i],b=a+v.t.length;let segs=[],cur="",curG=null;
    let anyG=false;for(let k=a;k<b;k++)if(marks[k]){anyG=true;break}
    if(!anyG&&VERSE_RE.test(v.t))return [[v.t,true]];
    if(kjvStyle&&i>0&&/\b(?:LORD|God)\b[^.]*\b(?:saying|said),?\s*$/.test(vs[i-1].t)&&!TO_GOD_RE.test(vs[i-1].t))return [[v.t,true]];
    for(let k=a;k<b;k++){const g=!!marks[k];if(curG===null)curG=g;if(g!==curG){segs.push([cur,curG]);cur="";curG=g}cur+=full[k]}
    if(cur)segs.push([cur,curG]);return segs;
  });
}

/* --- word bank --- */
const COMMON=new Set(["Faith","Holy","Glory","Law","Spirit","Salvation","Grace","Mercy","Gospel","Wisdom","Disciple","Saints","Amen","Behold","Righteousness","Messiah","Gentiles","Jerusalem","Judah","David","Moses","Abraham","Temple","Sin offering","Woe","Altar","Scroll"]);
function wordBank(vs){
  const raw=vs.map(v=>v.t).join(" "), text=" "+raw.toLowerCase()+" ";
  const found=[];
  for(const g of GL){
    let hit=false;
    if(g.w==="LORD (Yahweh)"&&/\bLORD\b/.test(raw))hit=true;
    else for(const f of g.f){const re=new RegExp("(^|[^a-z’'])"+f.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"([^a-z]|$)");if(re.test(text)){hit=true;break}}
    if(hit)found.push(g);
  }
  found.sort((a,b)=>(COMMON.has(a.w)?1:0)-(COMMON.has(b.w)?1:0));
  return found.slice(0,14);
}

/* ---------- study helpers ---------- */
const sectionFor=(b,c)=>SECT.find(s=>s.b===b&&c>=s.s&&c<=s.e);
function groupsFor(b){
  const bk=BY[b];const own=SECT.filter(s=>s.b===b);if(own.length)return own;
  const g=[];for(let s=1;s<=bk.ch;s+=5)g.push({b,s,e:Math.min(bk.ch,s+4),title:`Chapters ${s}–${Math.min(bk.ch,s+4)}`});return g;
}
function chapterMatchQs(b,from,to,n){
  const sum=SUM[b];if(!sum)return [];
  const bk=BY[b];const chs=[];for(let c=from;c<=to;c++)chs.push(c);
  return shuffle(chs).slice(0,n).map(c=>{
    let pool=[];for(let d=1;d<=bk.ch;d++)if(d!==c)pool.push(d);
    pool=pool.sort((x,y)=>Math.abs(x-c)-Math.abs(y-c)).slice(0,8);
    const opts=shuffle([c,...shuffle(pool).slice(0,Math.min(3,pool.length))]);
    return {c,q:`Which chapter of ${b} is this? “${sum[c-1]}”`,o:opts.map(x=>`${b} ${x}`),a:opts.indexOf(c),r:`${b} ${c}.`};
  });
}
function buildQuiz(b,from,to,maxBank){
  const bank=(EX[b]||[]).filter(q=>q.c>=from&&q.c<=to);
  const picked=shuffle(bank).slice(0,maxBank);
  const extra=chapterMatchQs(b,from,to,Math.max(2,Math.min(5,Math.ceil((to-from+1)/2))));
  return shuffle([...picked,...extra]).map(q=>{ // shuffle options too
    const idx=shuffle(q.o.map((_,i)=>i));return {...q,o:idx.map(i=>q.o[i]),a:idx.indexOf(q.a)};
  });
}

/* ---------- layout ---------- */
function nav(active){
  const t=[["today","Today",I.today],["bible","Bible",I.bible],["study","Study",I.study],["notes","Notes",I.notes],["me","Me",I.me]];
  return `<nav class="nav"><div class="nav-in">${t.map(([id,l,ic])=>`<a href="#/${id}" class="${active===id?"on":""}">${ic}<span>${l}</span></a>`).join("")}</div></nav>`;
}
function top(title,sub,backHref,right=""){
  return `<div class="topbar">${backHref?`<a class="iconbtn" href="${backHref}" aria-label="Back">${I.back}</a>`:""}<div class="grow">${sub?`<div class="eyebrow">${esc(sub)}</div>`:""}<h1 style="font-size:26px">${esc(title)}</h1></div>${right}</div>`;
}
function render(html,active){app.innerHTML=`<div class="fade-in">${html}</div>${active?nav(active):""}`;window.scrollTo(0,0)}

/* ---------- AUTH VIEW ---------- */
function viewLogin(){
  const profiles=LS.get("wu:profiles",[]);
  app.innerHTML=`<div class="auth fade-in">
    <div class="brand"><div class="logo">${I.logo}</div><div><b style="font-size:18px">Word Unfolded</b><div class="muted small">Read it. Understand it. Live it.</div></div></div>
    <h1 class="hero-title">Read the <em>whole</em> Bible, and actually understand it.</h1>
    <p class="muted">A reading plan on your timeline, context for every book, a word bank for every chapter, God's words in purple, highlights, notes, flashcards and exams.</p>
    <div id="authBox" class="stack" style="margin-top:18px"></div>
    <p class="muted small" style="margin-top:22px">${FB?"Your account syncs your progress across devices.":"Profiles are saved on this device. Use Backup in the Me tab to move to a new phone."}</p>
  </div>`;
  const box=$("#authBox");
  const showList=()=>{
    box.innerHTML=(FB?`<button class="btn block" id="gBtn">Continue with Google</button>
      <div class="divider">or with email</div>
      <input id="em" type="email" placeholder="Email" autocomplete="email"><input id="pw" type="password" placeholder="Password (6+ characters)" autocomplete="current-password">
      <div class="grid2"><button class="btn ghost" id="inBtn">Sign in</button><button class="btn line" id="upBtn">Create account</button></div>
      <input id="nm" placeholder="Your first name (for new accounts)" style="margin-top:4px">`
      :(profiles.length?`<div class="eyebrow">Choose your profile</div>`+profiles.map(p=>`<button class="profile" data-id="${esc(p.id)}"><span class="avatar">${esc(p.name[0]||"?").toUpperCase()}</span><span style="flex:1"><b>${esc(p.name)}</b><br><span class="muted small">Enter your PIN</span></span>${I.next}</button>`).join("")+`<div class="divider">or</div>`:"")+
      `<button class="btn block" id="newBtn">${profiles.length?"Add a new profile":"Get started"}</button>`);
    if(FB)wireFirebase();
    else{
      $$(".profile",box).forEach(b=>b.onclick=()=>askPin(profiles.find(p=>p.id===b.dataset.id)));
      $("#newBtn").onclick=newProfile;
    }
  };
  const pinInputs=()=>`<div class="pin">${[0,1,2,3].map(i=>`<input inputmode="numeric" maxlength="1" pattern="[0-9]" data-i="${i}" aria-label="PIN digit ${i+1}">`).join("")}</div>`;
  const wirePin=(cb)=>{const ins=$$(".pin input",box);ins[0].focus();ins.forEach((inp,i)=>{inp.oninput=()=>{inp.value=inp.value.replace(/\D/g,"").slice(-1);if(inp.value&&i<3)ins[i+1].focus();const v=ins.map(x=>x.value).join("");if(v.length===4)cb(v)};inp.onkeydown=e=>{if(e.key==="Backspace"&&!inp.value&&i>0)ins[i-1].focus()}})};
  function askPin(p){
    box.innerHTML=`<div class="card"><div class="row"><span class="avatar">${esc(p.name[0]).toUpperCase()}</span><div><b>Welcome back, ${esc(p.name)}</b><div class="muted small">Enter your 4-digit PIN</div></div></div>${pinInputs()}<div id="err" class="small" style="color:var(--danger);text-align:center"></div></div><button class="btn ghost block" id="bk">Back</button>`;
    $("#bk").onclick=showList;
    wirePin(async v=>{if(await sha(p.id+v)===p.pin)startSession({id:p.id,name:p.name,mode:"local"});else{$("#err").textContent="That PIN doesn't match. Try again.";$$(".pin input",box).forEach(x=>x.value="");$$(".pin input",box)[0].focus()}});
  }
  function newProfile(){
    box.innerHTML=`<div class="card stack"><label class="small muted" for="nm">Your first name</label><input id="nm" placeholder="e.g. Grace" maxlength="30" autocomplete="given-name"><div class="small muted">Create a 4-digit PIN</div>${pinInputs()}<div id="err" class="small" style="color:var(--danger)"></div></div><button class="btn ghost block" id="bk">Back</button>`;
    $("#bk").onclick=showList;$("#nm").focus();
    wirePin(async v=>{const name=$("#nm").value.trim();if(!name){$("#err").textContent="Add your name first.";$("#nm").focus();$$(".pin input",box).forEach(x=>x.value="");return}
      const id="p"+Date.now().toString(36);profiles.push({id,name,pin:await sha(id+v)});LS.set("wu:profiles",profiles);startSession({id,name,mode:"local"},defaultState(name))});
  }
  function wireFirebase(){
    const err=m=>toast(m.replace("Firebase: ","").replace(/\(auth.*\)\.?/,"").trim()||"Sign-in failed");
    $("#gBtn").onclick=()=>firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e=>err(e.message));
    $("#inBtn").onclick=()=>firebase.auth().signInWithEmailAndPassword($("#em").value.trim(),$("#pw").value).catch(e=>err(e.message));
    $("#upBtn").onclick=()=>{const n=$("#nm").value.trim();if(!n)return toast("Add your first name below");
      firebase.auth().createUserWithEmailAndPassword($("#em").value.trim(),$("#pw").value).then(c=>c.user.updateProfile({displayName:n})).catch(e=>err(e.message))};
  }
  showList();
}
let fbReady=null;
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function initFirebase(){
  if(!FB)return Promise.resolve();
  if(fbReady)return fbReady;
  const v="10.12.2",base=`https://www.gstatic.com/firebasejs/${v}/`;
  fbReady=loadScript(base+"firebase-app-compat.js").then(()=>Promise.all([loadScript(base+"firebase-auth-compat.js"),loadScript(base+"firebase-firestore-compat.js")])).then(()=>{
    firebase.initializeApp(FB);
    firebase.auth().onAuthStateChanged(async u=>{
      if(!u){if(user&&user.mode==="cloud"){user=null;S=null}if(location.hash!=="#/login")location.hash="#/login";else route();return}
      fbDoc=firebase.firestore().collection("users").doc(u.uid);
      let remote=null;try{const d=await fbDoc.get();if(d.exists&&d.data().state)remote=JSON.parse(d.data().state)}catch(e){console.warn(e)}
      const name=u.displayName||(u.email||"Friend").split("@")[0];
      const local=LS.get("wu:state:"+u.uid,null);
      startSession({id:u.uid,name,mode:"cloud",email:u.email},remote||local||defaultState(name));
    });
  });
  return fbReady;
}

/* ---------- SETUP ---------- */
function viewSetup(){
  const t=todayStr(),y=new Date().getFullYear();
  const p=S.plan||{start:t,end:`${y}-12-31`,order:"canonical"};
  const presets=[[`${y}-12-31`,`By Dec 31, ${y}`],[`${y+1}-12-31`,`By Dec 31, ${y+1}`],[todayStr(new Date(Date.now()+364*864e5)),"One year from today"],[todayStr(new Date(Date.now()+89*864e5)),"90-day challenge"]];
  render(`${top(S.plan?"Edit your plan":"Your reading plan","Hi "+S.name,S.plan?"#/me":"")}
  <div class="card stack"><h3>When do you want to finish?</h3><div class="chips wrap" id="pre">${presets.map(([d,l])=>`<button class="chip ${d===p.end?"on":""}" data-d="${d}">${l}</button>`).join("")}</div>
  <label class="small muted">Or choose a date</label><input type="date" id="end" value="${p.end}" min="${t}"><div id="pace" class="explain"></div></div>
  <div class="card stack"><h3>Reading order</h3>
   ${[["canonical","Genesis → Revelation","Straight through, in Bible order."],["mixed","Old + New together","Some OT and some NT every day, finishing both together."],["ntfirst","New Testament & Prophets first","Start with the NT and Major Prophets (where the exams are), then the rest."]].map(([v,a,b])=>`<label class="row" style="padding:8px 0;align-items:flex-start"><input type="radio" name="ord" value="${v}" ${p.order===v?"checked":""} style="width:auto;margin-top:4px"><span><b>${a}</b><br><span class="muted small">${b}</span></span></label>`).join("")}
  </div>
  <div class="card stack"><h3>Pick your palette</h3>${themePicker()}</div>
  <button class="btn block" id="go">${S.plan?"Save plan":"Start reading"}</button>
  <p class="muted small" style="text-align:center">Chapters you have already marked as read stay read.</p>`);
  const pace=()=>{const e=$("#end").value;const left=ALL.filter(k=>!S.read[k]).length;const d=Math.max(1,daysBetween(t,e)+1);const n=Math.ceil(left/d);
    $("#pace").innerHTML=`<b>${n} chapter${n>1?"s":""} a day</b> for ${d} days (${left} chapters left). ${n>=20?"That's an intense sprint, around 1.5–2 hours a day. You can change the date anytime.":n>=6?"About 30–45 minutes a day.":"About 10–20 minutes a day."}`};
  pace();$("#end").onchange=()=>{$$("#pre .chip").forEach(c=>c.classList.toggle("on",c.dataset.d===$("#end").value));pace()};
  $$("#pre .chip").forEach(c=>c.onclick=()=>{$("#end").value=c.dataset.d;$$("#pre .chip").forEach(x=>x.classList.toggle("on",x===c));pace()});
  wireThemes();
  $("#go").onclick=()=>{const end=$("#end").value;if(!end||end<t)return toast("Choose a date in the future");
    S.plan={start:S.plan?S.plan.start:t,end,order:($("input[name=ord]:checked")||{}).value||"canonical"};delete S.days[t];save();location.hash="#/today"};
}
function themePicker(){return `<div class="themes">${THEMES.map(t=>`<button class="theme ${S.prefs.theme===t.id?"on":""}" data-t="${t.id}"><div class="dots">${t.c.map(c=>`<i style="background:${c};border:1px solid rgba(0,0,0,.08)"></i>`).join("")}</div><b class="small">${t.name}</b></button>`).join("")}</div>`}
function wireThemes(){$$(".theme").forEach(b=>b.onclick=()=>{S.prefs.theme=b.dataset.t;save();applyPrefs();$$(".theme").forEach(x=>x.classList.toggle("on",x===b))})}

/* ---------- TODAY ---------- */
const MEMORY=["Joshua 1:9","Psalm 119:105","Proverbs 3:5-6","Isaiah 40:31","Isaiah 41:10","Isaiah 53:5","Jeremiah 29:11","Jeremiah 31:33","Lamentations 3:22-23","Ezekiel 36:26","Daniel 3:17-18","Micah 6:8","Matthew 6:33","Matthew 11:28","John 1:14","John 3:16","John 14:6","Acts 1:8","Romans 5:8","Romans 8:28","Romans 12:2","1 Corinthians 13:13","2 Corinthians 5:17","2 Corinthians 12:9","Galatians 2:20","Galatians 5:22-23","Ephesians 2:8-10","Philippians 4:6-7","Colossians 3:23","2 Timothy 3:16-17","Hebrews 4:12","Hebrews 11:6","Hebrews 12:1-2","James 1:22","1 Peter 2:9","1 Peter 5:7","1 John 1:9","1 John 4:19","Revelation 21:4"];
function weekNo(){const d=new Date(),s=new Date(d.getFullYear(),0,1);return Math.floor((d-s)/(7*864e5))}
function viewToday(){
  const list=todaysReading();const done=list.filter(k=>S.read[k]).length;
  const total=Object.keys(S.read).length,pct=Math.round(total/1189*100);
  const left=1189-total,daysLeft=Math.max(0,daysBetween(todayStr(),S.plan.end));
  const h=new Date().getHours(),greet=h<12?"Good morning":h<18?"Good afternoon":"Good evening";
  const mem=MEMORY[weekNo()%MEMORY.length];
  const last=S.lastRead;
  render(`${top(`${greet}, ${S.name}`,new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"}))}
  <div class="card accent"><div class="row" style="gap:16px"><div class="ring" style="--p:${list.length?Math.round(done/list.length*100):100}"><span>${done}/${list.length}</span></div>
   <div class="grow"><div class="small" style="opacity:.85;font-weight:700">TODAY'S READING</div><div style="font-family:var(--f-display);font-size:22px;line-height:1.2">${list.length?(done===list.length?"Done for today 🎉":rangeLabel(list)):"You've finished the Bible! 🎉"}</div>
   <div class="row small" style="margin-top:6px;opacity:.9;font-weight:700"><span class="row" style="gap:4px"><span style="width:16px;height:16px;display:inline-block">${I.flame}</span>${streak()}-day streak</span><span>· ${pct}% of the Bible</span></div></div></div>
   <div class="bar" style="margin-top:14px"><i style="width:${pct}%"></i></div></div>
  <div class="card" id="rl">${list.map((k,ix)=>{const [b,c]=k.split("|");return `<div class="reading ${ix>=8?"more":""}"><button class="check ${S.read[k]?"on":""}" data-k="${esc(k)}" aria-label="Mark ${esc(b)} ${c} read">${I.check}</button><a class="name" href="#/read/${encodeURIComponent(b)}/${c}">${esc(b)} ${c}</a>${sectionFor(b,+c)&&sectionFor(b,+c).s===+c?'<span class="tag god">Context</span>':""}${EX[b]?'<span class="tag">Quiz</span>':""}<span class="muted">${I.next.replace('<svg','<svg width="18" height="18"')}</span></div>`}).join("")||'<div class="empty">Nothing left. Well done, good and faithful servant.</div>'}${list.length>8?`<button class="btn sm ghost block" id="rlMore" style="margin-top:8px">Show all ${list.length} chapters</button>`:""}</div>
  ${last?`<a class="card row" href="#/read/${encodeURIComponent(last.b)}/${last.c}" style="text-decoration:none;color:inherit"><div class="grow"><div class="eyebrow">Continue</div><b>${esc(last.b)} ${last.c}</b></div>${I.next}</a>`:""}
  <div class="grid2">
   <div class="card"><div class="eyebrow">Left</div><div class="stat">${left}</div><div class="muted small">chapters · ${daysLeft} days</div></div>
   <div class="card"><div class="eyebrow">Notes</div><div class="stat">${Object.values(S.hl).filter(h=>h.note).length+Object.keys(S.journal).length}</div><div class="muted small">highlights & journals</div></div>
  </div>
  <div class="card soft"><div class="eyebrow">Memory verse of the week</div><div id="mem" class="scripture" style="font-size:18px;margin:8px 0">${esc(mem)}…</div><b class="small">${esc(mem)}</b>
   <div class="row" style="margin-top:10px"><a class="btn sm ghost" href="#/memory">Practice it</a></div></div>
  <a class="card row" href="#/study" style="text-decoration:none;color:inherit"><div class="grow"><div class="eyebrow">Study</div><b>Exams, mini tests & flashcards</b><div class="muted small">Major Prophets + New Testament</div></div>${I.next}</a>`,"today");
  let showAll=window.__wuShowAll||false;if(showAll)$("#rl").classList.add("showall");
  const more=$("#rlMore");if(more){if(showAll)more.remove();else more.onclick=()=>{window.__wuShowAll=true;$("#rl").classList.add("showall");more.remove()}}
  $$(".check").forEach(b=>b.onclick=()=>{const k=b.dataset.k;markRead(k,!S.read[k]);const y=scrollY;viewToday();scrollTo(0,y)});
  loadMemory(mem,$("#mem"));
}
function rangeLabel(list){
  const parts=[];let cur=null;
  for(const k of list){const [b,c]=k.split("|");if(cur&&cur.b===b&&+c===cur.e+1)cur.e=+c;else{cur={b,s:+c,e:+c};parts.push(cur)}}
  return parts.map(p=>p.s===p.e?`${p.b} ${p.s}`:`${p.b} ${p.s}–${p.e}`).join(", ");
}
async function loadMemory(ref,el){
  try{const ck="wu:mem:"+ref;let t=LS.get(ck,null);if(!t){const r=await fetch(`https://bible-api.com/${encodeURIComponent(ref)}?translation=webbe`);const j=await r.json();t=j.text.replace(/\s+/g," ").trim();LS.set(ck,t)}if(el)el.textContent=t;return t}catch(e){if(el)el.textContent=ref;return ref}
}

/* ---------- MEMORY PRACTICE ---------- */
async function viewMemory(){
  const ref=MEMORY[weekNo()%MEMORY.length];
  render(`${top("Memory verse","Hide words, recall them","#/today")}<div class="card"><b>${esc(ref)}</b><div id="mv" class="scripture" style="margin-top:10px">Loading…</div></div>
  <div class="row wrap"><button class="btn" id="hide">Hide more words</button><button class="btn ghost" id="reset">Show all</button></div>
  <p class="muted small">Tap a hidden word to peek. Keep hiding words until you can say it all from memory.</p>`,"today");
  const t=await loadMemory(ref);const words=t.split(" ");let hidden=new Set();
  const draw=()=>{$("#mv").innerHTML=words.map((w,i)=>hidden.has(i)?`<span data-i="${i}" style="background:var(--surface-2);color:transparent;border-radius:6px;cursor:pointer">${esc(w)}</span>`:esc(w)).join(" ");$$("#mv span").forEach(s=>s.onclick=()=>{s.style.color="var(--accent)"})};
  draw();$("#hide").onclick=()=>{const vis=words.map((_,i)=>i).filter(i=>!hidden.has(i));shuffle(vis).slice(0,Math.max(1,Math.ceil(words.length/5))).forEach(i=>hidden.add(i));draw()};
  $("#reset").onclick=()=>{hidden=new Set();draw()};
}

/* ---------- BIBLE ---------- */
let bibleFilter="OT";
function viewBible(){
  const groups=bibleFilter==="OT"?["Law","History","Wisdom","Major Prophet","Minor Prophet"]:["Gospel","History","Pauline Epistle","Pastoral Epistle","General Epistle","Prophecy"];
  render(`${top("The Bible","66 books · 1,189 chapters")}
  <div class="chips" style="margin-bottom:14px">${["OT","NT"].map(t=>`<button class="chip ${bibleFilter===t?"on":""}" data-t="${t}">${t==="OT"?"Old Testament":"New Testament"}</button>`).join("")}<a class="chip" href="#/timeline">Prophets timeline</a></div>
  ${groups.map(g=>{const bs=BOOKS.filter(b=>b.t===bibleFilter&&b.g===g);if(!bs.length)return "";return `<h3 style="margin:18px 0 10px">${g==="Major Prophet"?"Major Prophets":g==="Minor Prophet"?"Minor Prophets":g==="Law"?"The Law (Torah)":g.endsWith("Epistle")?g.replace("Epistle","Letters"):g==="Gospel"?"Gospels":g}</h3><div class="books">${bs.map(b=>{const r=readCount(b);return `<a class="book" href="#/book/${encodeURIComponent(b.n)}"><b>${esc(b.n)}</b><span class="muted small">${b.ch} ch${EX[b.n]?' · <span style="color:var(--accent);font-weight:700">Exam</span>':""}</span><div class="bar"><i style="width:${r/b.ch*100}%"></i></div></a>`}).join("")}</div>`}).join("")}`,"bible");
  $$(".chip[data-t]").forEach(c=>c.onclick=()=>{bibleFilter=c.dataset.t;viewBible()});
}
function contextCard(b){
  return `<div class="card ctx"><div class="row between"><div class="eyebrow">Before you read</div><span class="tag gold">${esc(b.g)}</span></div>
  <h2 style="margin-top:6px">${esc(b.theme)}</h2><p style="margin:8px 0 0">${esc(b.why)}</p>
  <dl><dt>Author</dt><dd>${esc(b.au)}</dd><dt>Written to</dt><dd>${esc(b.aud)}</dd><dt>When</dt><dd>${esc(b.dt)}</dd><dt>Where</dt><dd>${esc(b.geo)}</dd><dt>Key verse</dt><dd>${esc(b.key)}</dd></dl></div>`;
}
function viewBook(name){
  const b=BY[name];if(!b)return viewBible();
  const groups=groupsFor(name);const hasEx=!!EX[name];
  render(`${top(b.n,b.t==="OT"?"Old Testament":"New Testament","#/bible")}
  ${contextCard(b)}
  <div class="row wrap" style="margin-bottom:14px">${hasEx?`<a class="btn" href="#/exam/${encodeURIComponent(name)}">Take the ${esc(name)} exam</a>`:""}<a class="btn ghost" href="#/cards/${encodeURIComponent(name)}">Flashcards</a></div>
  <h3 style="margin:6px 0 10px">Chapters <span class="muted small">(${readCount(b)}/${b.ch} read)</span></h3>
  <div class="chgrid" style="margin-bottom:18px">${Array.from({length:b.ch},(_,i)=>`<a href="#/read/${encodeURIComponent(name)}/${i+1}" class="${S.read[key(name,i+1)]?"read":""}">${i+1}</a>`).join("")}</div>
  ${(SUM[name])?`<h3 style="margin:6px 0 10px">${SECT.some(s=>s.b===name)?"Sections: context & mini tests":"Mini tests"}</h3>${groups.map(g=>`<a class="card row" style="text-decoration:none;color:inherit" href="#/mini/${encodeURIComponent(name)}/${g.s}-${g.e}"><div class="grow"><div class="eyebrow">Ch ${g.s}${g.e!==g.s?"–"+g.e:""}</div><b>${esc(g.title)}</b>${g.ctx?`<div class="muted small" style="margin-top:4px">${esc(g.ctx.slice(0,120))}…</div>`:""}</div>${I.next}</a>`).join("")}`:""}`,"bible");
}

/* ---------- READER ---------- */
let readerVs=null,selV=null;
async function viewRead(b,c){
  const bk=BY[b];c=+c;if(!bk||c<1||c>bk.ch)return viewBible();
  S.lastRead={b,c};save();
  const sec=sectionFor(b,c);const summary=SUM[b]&&SUM[b][c-1];const k=key(b,c);
  const ver=S.prefs.version, inapp=VERSIONS.find(v=>v.id===ver&&v.inapp)?ver:"webbe";
  const isOT=bk.t==="OT";
  render(`<div class="reader-head"><div class="topbar" style="padding-bottom:6px"><a class="iconbtn" href="#/book/${encodeURIComponent(b)}" aria-label="Back">${I.back}</a><div class="grow"><div class="eyebrow">${esc(bk.g)}</div><h1 style="font-size:24px">${esc(b)} ${c}</h1></div>
   <button class="iconbtn" id="aa" aria-label="Text settings" style="font-weight:800;font-family:var(--f-display)">Aa</button></div>
   <div class="versions">${VERSIONS.map(v=>v.inapp?`<button class="chip ${inapp===v.id?"on":""}" data-v="${v.id}">${v.name}</button>`:`<a class="chip" target="_blank" rel="noopener" href="${bgUrl(b,c,v.id)}">${v.name} ↗</a>`).join("")}</div></div>
  ${c===1?contextCard(bk):`<details class="card soft"><summary class="row between"><span>About ${esc(b)}: who, when, where</span><span class="muted">+</span></summary><div style="margin-top:10px">${contextCard(bk)}</div></details>`}
  ${sec?`<${sec.s===c?"div":"details"} class="card" style="border-left:4px solid var(--god)">${sec.s===c?"":`<summary class="row between"><span><span class="tag god">Context</span> ${esc(sec.title)}</span><span class="muted">+</span></summary>`}
    ${sec.s===c?`<div class="eyebrow" style="color:var(--god)">What's going on · Chapters ${sec.s}–${sec.e}</div><h2 style="margin:6px 0 8px">${esc(sec.title)}</h2>`:"<div style='height:8px'></div>"}
    <p style="margin:0 0 10px">${esc(sec.ctx)}</p><div class="row wrap">${sec.themes.map(t=>`<span class="tag god">${esc(t)}</span>`).join("")}</div>
    <h3 style="margin:14px 0 6px">Bible-college study questions</h3>${sec.qs.map(q=>`<details style="margin-top:8px"><summary><b>${esc(q.q)}</b></summary><div class="explain"><b>Prep notes:</b> ${esc(q.prep)}</div></details>`).join("")}
  </${sec.s===c?"div":"details"}>`:""}
  <div class="card"><div class="row between"><h3>Word bank</h3><span class="muted small">words you may not know</span></div><div id="wb" class="wordbank" style="margin-top:10px"><div class="muted small">Loading…</div></div></div>
  <div class="card">${isOT?`<div class="legend muted" style="margin-bottom:10px"><i></i> Purple = God speaking ${S.prefs.purple?"":"(turned off)"}</div>`:""}
   <div id="txt" class="scripture ${S.prefs.purple?"":"nopurple"}"><div class="muted">Loading ${esc(b)} ${c}…</div></div>
   <div class="muted small" style="margin-top:14px">${inapp==="webbe"?"World English Bible (public domain).":"King James Version (public domain)."} Tap any verse to highlight it or add a note. For NIV, ESV, NLT, AMPC and NKJV, tap a version button above.</div></div>
  ${summary?`<div class="card soft"><div class="eyebrow">Chapter in one line</div><p style="margin:6px 0 0">${esc(summary)}</p></div>`:""}
  <div class="card stack"><div class="row between"><h3>Journal (SOAP)</h3><span class="muted small">auto-saves</span></div>
   ${[["s","Scripture","Which verse stood out?"],["o","Observation","What does it say and mean in context?"],["a","Application","How will I live this out today?"],["p","Prayer","Talk to God about it."]].map(([f,l,ph])=>`<label class="small" style="font-weight:700">${l}</label><textarea data-j="${f}" placeholder="${ph}">${esc((S.journal[k]||{})[f]||"")}</textarea>`).join("")}</div>
  ${(EX[b]||SUM[b])?`<a class="card row" style="text-decoration:none;color:inherit" href="#/mini/${encodeURIComponent(b)}/${c}-${c}"><div class="grow"><div class="eyebrow">Check yourself</div><b>Quick quiz on ${esc(b)} ${c}</b></div>${I.next}</a>`:""}
  <div class="row" style="gap:10px;margin:16px 0">
   ${c>1||bk.i>0?`<a class="btn ghost" href="${prevHref(bk,c)}">${I.back.replace('<svg','<svg width="18" height="18"')}</a>`:""}
   <button class="btn block" id="done" style="flex:1">${S.read[k]?"✓ Read. Next chapter":"Mark as read & continue"}</button></div>`,"bible");
  $$(".versions .chip[data-v]").forEach(x=>x.onclick=()=>{S.prefs.version=x.dataset.v;save();viewRead(b,c)});
  $("#aa").onclick=textSettings;
  $$("textarea[data-j]").forEach(t=>t.oninput=()=>{const j=S.journal[k]||{};j[t.dataset.j]=t.value;j.t=Date.now();if(!j.s&&!j.o&&!j.a&&!j.p)delete S.journal[k];else S.journal[k]=j;save()});
  $("#done").onclick=()=>{markRead(k,true);toast("Marked "+b+" "+c+" as read");location.hash=nextHref(bk,c)};
  try{
    const vs=await fetchChapter(b,c,inapp);readerVs={b,c,vs};
    const segs=isOT?godSegments(vs):vs.map(v=>[[v.t,false]]);
    drawText(b,c,vs,segs);
    const wb=wordBank(vs);
    const wbEl=$("#wb");wbEl.innerHTML=wb.length?wb.map(g=>`<div class="word"><b>${esc(g.w)}</b>: ${esc(g.d)}</div>`).join(""):'<div class="muted small">No tricky words detected in this chapter.</div>';
    if(wb.length>6){wbEl.classList.add("clip");wbEl.insertAdjacentHTML("afterend",`<button class="btn sm ghost" id="wbMore" style="margin-top:10px">Show all ${wb.length} words</button>`);$("#wbMore").onclick=e=>{wbEl.classList.remove("clip");e.target.remove()}}
    prefetch(bk,c,inapp);
  }catch(e){
    $("#txt").innerHTML=`<div class="empty">Couldn't load the text (${esc(e.message)}). Check your connection, or open it in <a target="_blank" rel="noopener" href="${bgUrl(b,c,"NIV")}">NIV on BibleGateway ↗</a>.<br><br><button class="btn sm" id="retry">Try again</button></div>`;
    $("#wb").innerHTML='<div class="muted small">The word bank appears once the text loads.</div>';
    $("#retry").onclick=()=>viewRead(b,c);
  }
}
function drawText(b,c,vs,segs){
  const el=$("#txt");if(!el)return;
  el.innerHTML=vs.map((v,i)=>{const h=S.hl[`${b}|${c}|${v.v}`];
    return `<span class="v ${h&&h.c?"hl-"+h.c:""}" data-v="${v.v}"><sup>${v.v}</sup>${segs[i].map(([t,g])=>g?`<span class="god">${esc(t)}</span>`:esc(t)).join("")}${h&&h.note?'<span class="note-dot">✎</span>':""}</span> `}).join("");
  $$(".v",el).forEach(s=>s.onclick=()=>verseSheet(b,c,+s.dataset.v));
}
function verseSheet(b,c,v){
  const hk=`${b}|${c}|${v}`,h=S.hl[hk]||{};const vt=(readerVs&&readerVs.vs.find(x=>x.v===v)||{}).t||"";
  $$(".v").forEach(x=>x.classList.toggle("sel",+x.dataset.v===v));
  openSheet(`<div class="row between"><b>${esc(b)} ${c}:${v}</b><button class="btn sm ghost" id="shx">Close</button></div>
   <p class="scripture" style="font-size:17px;margin:10px 0">${esc(vt)}</p>
   <div class="small muted" style="margin-bottom:8px">Highlight</div>
   <div class="swatches">${["y","g","b","p","o"].map(x=>`<button class="sw ${h.c===x?"on":""}" data-c="${x}" style="background:var(--hl-${x})" aria-label="Highlight color ${x}"></button>`).join("")}<button class="sw" data-c="" aria-label="Remove highlight" style="background:var(--surface);display:grid;place-items:center;font-weight:800">×</button></div>
   <div class="small muted" style="margin:14px 0 8px">Note</div><textarea id="nt" placeholder="What is God showing you here?">${esc(h.note||"")}</textarea>
   <div class="row" style="margin-top:12px"><button class="btn" id="svn">Save note</button><button class="btn ghost" id="cpy">Copy verse</button></div>`);
  const put=(patch)=>{const cur=Object.assign({},S.hl[hk]||{},patch,{t:Date.now(),text:vt});if(!cur.c&&!cur.note)delete S.hl[hk];else S.hl[hk]=cur;save();const vs=readerVs.vs;drawText(b,c,vs,BY[b].t==="OT"?godSegments(vs):vs.map(x=>[[x.t,false]]))};
  $$(".sw").forEach(x=>x.onclick=()=>{put({c:x.dataset.c});$$(".sw").forEach(y=>y.classList.toggle("on",y===x&&x.dataset.c))});
  $("#svn").onclick=()=>{put({note:$("#nt").value.trim()});closeSheet();toast("Note saved")};
  $("#cpy").onclick=()=>{navigator.clipboard&&navigator.clipboard.writeText(`“${vt}” (${b} ${c}:${v})`).then(()=>toast("Copied"))};
  $("#shx").onclick=()=>{closeSheet();$$(".v").forEach(x=>x.classList.remove("sel"))};
}
function textSettings(){
  openSheet(`<div class="row between"><b>Reading settings</b><button class="btn sm ghost" id="shx">Done</button></div>
  <div class="small muted" style="margin:14px 0 6px">Text size</div><input type="range" min="15" max="28" value="${S.prefs.size}" id="sz" style="padding:0">
  <label class="row" style="margin-top:16px"><input type="checkbox" id="pp" ${S.prefs.purple?"checked":""} style="width:auto"> <span>Show God's words in <b style="color:var(--god)">purple</b> (Old Testament)</span></label>
  <div class="small muted" style="margin:16px 0 8px">Palette</div>${themePicker()}`);
  $("#sz").oninput=e=>{S.prefs.size=+e.target.value;applyPrefs();save()};
  $("#pp").onchange=e=>{S.prefs.purple=e.target.checked;save();const t=$("#txt");if(t)t.classList.toggle("nopurple",!S.prefs.purple)};
  wireThemes();$("#shx").onclick=closeSheet;
}
function nextHref(bk,c){if(c<bk.ch)return `#/read/${encodeURIComponent(bk.n)}/${c+1}`;const n=BOOKS[bk.i+1];return n?`#/read/${encodeURIComponent(n.n)}/1`:"#/today"}
function prevHref(bk,c){if(c>1)return `#/read/${encodeURIComponent(bk.n)}/${c-1}`;const p=BOOKS[bk.i-1];return `#/read/${encodeURIComponent(p.n)}/${p.ch}`}
function prefetch(bk,c,tr){ // gently prefetch the rest of today's reading
  const list=todaysReading().filter(k=>!LS.get(`wu:txt:${tr}:${k.replace("|",":")}`,null));
  let i=0;const step=()=>{if(i>=Math.min(list.length,6))return;const [b,ch]=list[i++].split("|");fetchChapter(b,+ch,tr).catch(()=>{}).finally(()=>setTimeout(step,2500))};setTimeout(step,2000);
}

/* ---------- STUDY ---------- */
function viewStudy(){
  const mp=BOOKS.filter(b=>b.g==="Major Prophet"),nt=BOOKS.filter(b=>b.t==="NT");
  const best=n=>S.exams[n]?`<span class="tag ${S.exams[n].best>=80?"":"gold"}">${S.exams[n].best}%</span>`:"";
  render(`${top("Study","Exams · mini tests · flashcards")}
  <div class="card accent"><div class="eyebrow" style="color:inherit;opacity:.8">How to study</div><p style="margin:6px 0 0">Read a section, take its <b>mini test</b>, drill the <b>flashcards</b>, then sit the full <b>exam</b>. Aim for 80%+. Bible-college essay questions are at the end of each exam.</p></div>
  <h3 style="margin:16px 0 10px">Major Prophets</h3><div class="books">${mp.map(b=>`<a class="book" href="#/exam/${encodeURIComponent(b.n)}"><b>${esc(b.n)}</b><span class="muted small">${(EX[b.n]||[]).length} questions</span>${best(b.n)}</a>`).join("")}</div>
  <h3 style="margin:22px 0 10px">New Testament</h3><div class="books">${nt.map(b=>`<a class="book" href="#/exam/${encodeURIComponent(b.n)}"><b>${esc(b.n)}</b><span class="muted small">${(EX[b.n]||[]).length} questions</span>${best(b.n)}</a>`).join("")}</div>
  <h3 style="margin:22px 0 10px">Flashcards</h3>
  <div class="grid2"><a class="card" href="#/cards/__words" style="text-decoration:none;color:inherit"><b>Bible word bank</b><div class="muted small">${GL.length} terms, people & places</div></a><a class="card" href="#/timeline" style="text-decoration:none;color:inherit"><b>Prophets timeline</b><div class="muted small">Kings, prophets & empires</div></a></div>
  <p class="muted small">Every book with an exam also has chapter flashcards. Open the book and tap Flashcards.</p>`,"study");
}
function viewExam(b){
  const bk=BY[b];if(!bk||!EX[b])return viewStudy();
  const qs=buildQuiz(b,1,bk.ch,20);
  quizRunner({title:`${b} exam`,sub:`${qs.length} questions · ${bk.ch} chapters`,back:`#/book/${encodeURIComponent(b)}`,qs,onDone:pct=>{const e=S.exams[b]||{best:0,n:0};e.n++;e.last=pct;e.best=Math.max(e.best,pct);S.exams[b]=e;save()},
    essays:(ESS[b]||[]).concat(SECT.filter(s=>s.b===b).flatMap(s=>s.qs).slice(0,6))});
}
function viewMini(b,range){
  const bk=BY[b];if(!bk)return viewStudy();const [s,e]=range.split("-").map(Number);
  const sec=SECT.find(x=>x.b===b&&x.s===s&&x.e===e);
  const qs=buildQuiz(b,s,e,10);
  if(!qs.length){render(`${top(`${b} ${s}${e!==s?"–"+e:""}`,"Mini test",`#/book/${encodeURIComponent(b)}`)}<div class="empty">No questions for this passage yet. Try the flashcards.</div>`,"study");return}
  quizRunner({title:`${b} ${s}${e!==s?"–"+e:""}`,sub:sec?sec.title:"Mini test",back:s===e?`#/read/${encodeURIComponent(b)}/${s}`:`#/book/${encodeURIComponent(b)}`,qs,intro:sec?`<div class="card" style="border-left:4px solid var(--god)"><div class="eyebrow" style="color:var(--god)">Context</div><p style="margin:6px 0 0">${esc(sec.ctx)}</p></div>`:"",essays:sec?sec.qs:[]});
}
function quizRunner({title,sub,back,qs,onDone,essays=[],intro=""}){
  let i=0,score=0;const wrong=[];
  const step=()=>{
    if(i>=qs.length)return finish();
    const q=qs[i];
    render(`${top(title,sub,back)}${i===0?intro:""}<div class="row between small muted" style="margin-bottom:8px"><span>Question ${i+1} of ${qs.length}</span><span>Score ${score}</span></div><div class="bar" style="margin-bottom:14px"><i style="width:${i/qs.length*100}%"></i></div>
    <div class="card"><h2 style="font-size:20px">${esc(q.q)}</h2><div id="opts">${q.o.map((o,j)=>`<button class="opt" data-j="${j}">${esc(o)}</button>`).join("")}</div><div id="ex"></div></div>`,"study");
    $$(".opt").forEach(btn=>btn.onclick=()=>{
      const j=+btn.dataset.j,ok=j===q.a;if(ok)score++;else wrong.push(q);
      $$(".opt").forEach((x,k)=>{x.disabled=true;if(k===q.a)x.classList.add("right");else if(k===j)x.classList.add("wrong")});
      $("#ex").innerHTML=`<div class="explain"><b>${ok?"Correct!":"Not quite."}</b> ${esc(q.r||"")}</div><button class="btn block" id="nx" style="margin-top:12px">${i+1<qs.length?"Next":"See results"}</button>`;
      $("#nx").onclick=()=>{i++;step()};
    });
  };
  const finish=()=>{
    const pct=Math.round(score/qs.length*100);if(onDone)onDone(pct);
    render(`${top(title,"Results",back)}<div class="card accent" style="text-align:center"><div class="stat" style="font-size:54px">${pct}%</div><div>${score} of ${qs.length} correct</div><div style="margin-top:6px;font-weight:700">${pct>=90?"Excellent, you know this well!":pct>=70?"Solid. Review the misses below.":"Keep going: reread the passage and try again."}</div></div>
    ${wrong.length?`<h3 style="margin:16px 0 8px">Review</h3>${wrong.map(q=>`<div class="card"><b>${esc(q.q)}</b><div class="explain"><b>Answer:</b> ${esc(q.o[q.a])}<br>${esc(q.r||"")}</div></div>`).join("")}`:""}
    ${essays.length?`<h3 style="margin:16px 0 8px">Bible-college essay questions</h3><p class="muted small">Write your answer in a notebook or the Notes tab, then compare it with the prep notes.</p>${essays.map(e=>`<details class="card"><summary>${esc(e.q)}</summary><div class="explain"><b>A strong answer covers:</b> ${esc(e.prep)}</div></details>`).join("")}`:""}
    <div class="row"><button class="btn" id="again">Try again</button><a class="btn ghost" href="${back}">Done</a></div>`,"study");
    $("#again").onclick=()=>{qs.forEach(q=>{const idx=shuffle(q.o.map((_,k)=>k));q.o=idx.map(k=>q.o[k]);q.a=idx.indexOf(q.a)});qs=shuffle(qs);i=0;score=0;wrong.length=0;step()};
  };
  step();
}

/* ---------- FLASHCARDS ---------- */
function viewCards(b){
  let deck=[],title,back;
  if(b==="__words"){title="Bible word bank";back="#/study";deck=GL.map(g=>({id:"w:"+g.w,f:g.w,bk:g.d}))}
  else{const bk=BY[b];if(!bk)return viewStudy();title=b+" flashcards";back=`#/book/${encodeURIComponent(b)}`;
    (SUM[b]||[]).forEach((s,i)=>deck.push({id:`s:${b}:${i+1}`,f:`${b} ${i+1}`,sub:"What happens in this chapter?",bk:s}));
    (EX[b]||[]).forEach((q,i)=>deck.push({id:`q:${b}:${i}`,f:q.q,sub:`Chapter ${q.c}`,bk:q.o[q.a]+(q.r?" · "+q.r:"")}));
    if(!deck.length){const words=GL.filter(g=>g.f.some(f=>(b+" "+bk.why+" "+bk.geo+" "+bk.aud).toLowerCase().includes(f)));deck=words.map(g=>({id:"w:"+g.w,f:g.w,bk:g.d}));
      deck.unshift({id:`ctx:${b}:1`,f:`${b}: who wrote it and to whom?`,bk:`${bk.au}. Written to ${bk.aud}.`},{id:`ctx:${b}:2`,f:`${b}: when and where?`,bk:`${bk.dt}. ${bk.geo}.`},{id:`ctx:${b}:3`,f:`${b}: big idea?`,bk:`${bk.theme}. ${bk.why}`});}
  }
  let mode="due";
  const box=id=>S.cards[id]||0;
  const run=()=>{
    let cards=deck.slice();
    if(mode==="due")cards=cards.filter(c=>box(c.id)<3);
    cards=shuffle(cards).sort((a,b)=>box(a.id)-box(b.id));
    const mastered=deck.filter(c=>box(c.id)>=3).length;
    let i=0;
    const draw=()=>{
      if(!cards.length||i>=cards.length){render(`${top(title,`${mastered}/${deck.length} mastered`,back)}<div class="card accent" style="text-align:center"><div class="stat">${deck.filter(c=>box(c.id)>=3).length}/${deck.length}</div><div>cards mastered</div></div><div class="row"><button class="btn" id="m1">Study all again</button><button class="btn ghost" id="m2">Reset progress</button></div>`,"study");
        $("#m1").onclick=()=>{mode="all";run()};$("#m2").onclick=()=>{deck.forEach(c=>delete S.cards[c.id]);save();mode="due";run()};return}
      const c=cards[i];
      render(`${top(title,`Card ${i+1} of ${cards.length} · ${deck.filter(c=>box(c.id)>=3).length}/${deck.length} mastered`,back)}
      <div class="chips" style="margin-bottom:6px"><button class="chip ${mode==="due"?"on":""}" data-m="due">Still learning</button><button class="chip ${mode==="all"?"on":""}" data-m="all">All cards</button></div>
      <div class="flash" id="fc"><div class="flash-in"><div class="face front">${c.sub?`<div class="eyebrow">${esc(c.sub)}</div>`:""}<div class="big" style="margin-top:8px">${esc(c.f)}</div><div class="muted small" style="margin-top:18px">Tap to flip</div></div><div class="face back"><div style="font-size:18px;line-height:1.5">${esc(c.bk)}</div></div></div></div>
      <div class="grid2"><button class="btn ghost" id="again">Again</button><button class="btn" id="got">Got it</button></div>`,"study");
      $("#fc").onclick=()=>$("#fc").classList.toggle("flip");
      $$(".chip[data-m]").forEach(x=>x.onclick=()=>{mode=x.dataset.m;run()});
      $("#again").onclick=()=>{S.cards[c.id]=0;save();cards.push(c);i++;draw()};
      $("#got").onclick=()=>{S.cards[c.id]=Math.min(4,box(c.id)+1);save();i++;draw()};
    };draw();
  };run();
}

/* ---------- TIMELINE ---------- */
const TL=[["931 BC","The kingdom divides","Israel (north) and Judah (south) split after Solomon.",0],["c. 760 BC","Amos & Hosea","Prophets to prosperous, idolatrous northern Israel.",1],["c. 740 BC","Isaiah's call","'In the year King Uzziah died' (Isaiah 6).",1],["734 BC","Syro-Ephraimite crisis","Ahaz is given the sign of Immanuel (Isaiah 7).",1],["722 BC","Samaria falls","Assyria destroys the northern kingdom.",0],["701 BC","Sennacherib's siege","God delivers Jerusalem under Hezekiah (Isaiah 36–37).",1],["640 BC","Josiah becomes king","Judah's last great reformer.",0],["627 BC","Jeremiah's call","13th year of Josiah (Jeremiah 1).",1],["622 BC","Book of the Law found","Josiah's reform (2 Kings 22–23).",0],["612 BC","Nineveh falls","Assyria collapses (Nahum).",0],["605 BC","Battle of Carchemish","Babylon rises, and Daniel is taken to Babylon (Daniel 1).",1],["597 BC","Second deportation","Jehoiachin and Ezekiel exiled.",1],["593 BC","Ezekiel's call","Vision of God's glory by the Chebar (Ezekiel 1).",1],["586 BC","Jerusalem destroyed","Temple burned. Lamentations is written.",1],["539 BC","Babylon falls","The writing on the wall (Daniel 5), and Cyrus takes the city.",1],["538 BC","Cyrus's decree","The exiles may return (Ezra 1; Isaiah 44:28).",0],["536 BC","Daniel's last vision","3rd year of Cyrus (Daniel 10–12).",1],["516 BC","Second temple finished","Under Zerubbabel, with Haggai and Zechariah.",0],["c. 430 BC","Malachi","The last OT prophet, then about 400 years of silence until John the Baptist.",1]];
function viewTimeline(){render(`${top("Prophets timeline","Kings · prophets · empires","#/study")}<div class="card"><div class="legend small muted" style="margin-bottom:12px"><i></i> prophet / Major-Prophet event</div><div class="timeline">${TL.map(([d,t,x,g])=>`<div class="tl ${g?"god":""}"><div class="eyebrow">${d}</div><b>${esc(t)}</b><div class="muted small">${esc(x)}</div></div>`).join("")}</div></div>`,"study")}

/* ---------- NOTES ---------- */
let noteQ="";
function viewNotes(){
  const hs=Object.entries(S.hl).map(([k,h])=>{const [b,c,v]=k.split("|");return {k,b,c:+c,v:+v,color:h.c,note:h.note,text:h.text,t:h.t}});
  const js=Object.entries(S.journal).map(([k,j])=>{const [b,c]=k.split("|");return {k,b,c:+c,...j}});
  const q=noteQ.toLowerCase();
  const hf=hs.filter(h=>!q||(h.b+" "+(h.note||"")+" "+(h.text||"")).toLowerCase().includes(q)).sort((a,b)=>(b.t||0)-(a.t||0));
  const jf=js.filter(j=>!q||(j.b+" "+[j.s,j.o,j.a,j.p].join(" ")).toLowerCase().includes(q)).sort((a,b)=>(b.t||0)-(a.t||0));
  render(`${top("Notes & highlights",`${hs.length} highlights · ${js.length} journals`)}
  <input id="nq" placeholder="Search your notes…" value="${esc(noteQ)}" style="margin-bottom:14px">
  ${jf.length?`<h3 style="margin:8px 0 10px">Journal</h3>${jf.map(j=>`<a class="card" style="display:block;text-decoration:none;color:inherit" href="#/read/${encodeURIComponent(j.b)}/${j.c}"><div class="eyebrow">${esc(j.b)} ${j.c}</div>${[["S",j.s],["O",j.o],["A",j.a],["P",j.p]].filter(x=>x[1]).map(([l,t])=>`<div style="margin-top:6px"><b>${l}:</b> ${esc(t)}</div>`).join("")}</a>`).join("")}`:""}
  ${hf.length?`<h3 style="margin:16px 0 10px">Highlights</h3>${hf.map(h=>`<a class="card" style="display:block;text-decoration:none;color:inherit;border-left:6px solid var(--hl-${h.color||"y"})" href="#/read/${encodeURIComponent(h.b)}/${h.c}"><div class="eyebrow">${esc(h.b)} ${h.c}:${h.v}</div><div class="scripture" style="font-size:16px;margin-top:4px">${esc(h.text||"")}</div>${h.note?`<div class="explain">✎ ${esc(h.note)}</div>`:""}</a>`).join("")}`:""}
  ${!hf.length&&!jf.length?`<div class="empty">${q?"No matches.":"Tap any verse while reading to highlight it or add a note. Journal entries appear here too."}</div>`:""}
  <div class="row wrap" style="margin-top:10px"><button class="btn ghost" id="exp">Export notes (.txt)</button></div>`,"notes");
  const nq=$("#nq");nq.oninput=()=>{noteQ=nq.value;const pos=nq.selectionStart;viewNotes();const n=$("#nq");n.focus();n.setSelectionRange(pos,pos)};
  $("#exp").onclick=()=>{
    let out=`Word Unfolded notes for ${S.name}, exported ${todayStr()}\n\n== JOURNAL ==\n`;
    js.sort((a,b)=>BY[a.b].i-BY[b.b].i||a.c-b.c).forEach(j=>{out+=`\n${j.b} ${j.c}\n`;[["Scripture",j.s],["Observation",j.o],["Application",j.a],["Prayer",j.p]].forEach(([l,t])=>{if(t)out+=`  ${l}: ${t}\n`})});
    out+="\n== HIGHLIGHTS ==\n";hs.sort((a,b)=>BY[a.b].i-BY[b.b].i||a.c-b.c||a.v-b.v).forEach(h=>{out+=`\n${h.b} ${h.c}:${h.v}  ${h.text||""}\n${h.note?"  Note: "+h.note+"\n":""}`});
    download(`word-unfolded-notes-${todayStr()}.txt`,out,"text/plain");
  };
}
function download(name,content,type){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

/* ---------- ME ---------- */
function viewMe(){
  const url=location.origin+location.pathname;
  render(`${top(S.name,user.mode==="cloud"?(user.email||"Signed in"):"Profile on this device")}
  <div class="grid2"><div class="card"><div class="eyebrow">Read</div><div class="stat">${Object.keys(S.read).length}</div><div class="muted small">of 1,189 chapters</div></div><div class="card"><div class="eyebrow">Streak</div><div class="stat">${streak()}</div><div class="muted small">days in a row</div></div></div>
  <div class="card stack"><h3>Invite someone into the Word</h3><p class="muted small" style="margin:0">Share the app. Each person signs in and gets their own plan, notes and progress.</p><div id="qr" style="display:grid;place-items:center;padding:8px;background:#fff;border-radius:14px;width:180px;height:180px;margin:4px auto"></div><div class="row"><button class="btn" id="share">Share link</button><button class="btn ghost" id="copy">Copy link</button></div></div>
  <div class="card stack"><h3>Plan</h3><div class="muted small">Finish by <b>${S.plan?parseDay(S.plan.end).toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"}):"not set"}</b> · ${S.plan?{canonical:"Genesis → Revelation",mixed:"Old + New together",ntfirst:"NT & Prophets first"}[S.plan.order]:""}</div><div class="row wrap"><a class="btn ghost sm" href="#/setup">Edit plan</a><button class="btn ghost sm" id="ics">Add daily reminder to calendar</button></div></div>
  <div class="card stack"><h3>Palette</h3>${themePicker()}</div>
  <div class="card stack"><h3>Backup</h3><p class="muted small" style="margin:0">${user.mode==="cloud"?"Your progress syncs to your account automatically. You can still download a copy.":"Your progress lives on this device. Download a backup to move it to another phone or browser."}</p><div class="row wrap"><button class="btn ghost sm" id="bk">Download backup</button><label class="btn ghost sm" style="cursor:pointer">Restore backup<input type="file" id="rs" accept=".json,application/json" hidden></label></div></div>
  <details class="card"><summary>About the translations & purple text</summary><div class="small" style="margin-top:10px;line-height:1.6">
   <p>The in-app text is the <b>World English Bible</b> (public domain), with the <b>KJV</b> as an option, loaded from bible-api.com. <b>NIV, ESV, NLT, AMPC and NKJV</b> are copyrighted, so their buttons open the same chapter on BibleGateway, where you can read them free.</p>
   <p><b>Purple text</b> marks where God is speaking in the Old Testament. It's detected automatically from quotation marks and phrases like "says the LORD," so it is very accurate in the prophets but not perfect. Always read the context. The KJV has no quotation marks, so its detection is rougher.</p>
   <p>Context notes follow mainstream evangelical scholarship. Where Christians differ (dates, interpretations of Daniel, Ezekiel's temple, Revelation), the study notes show the main views.</p></div></details>
  <button class="btn line block" id="out">Sign out</button>`,"me");
  wireThemes();
  const msg="I'm reading through the whole Bible with Word Unfolded: a plan, context for every book, word banks, quizzes and flashcards. Join me:";
  $("#share").onclick=()=>{if(navigator.share)navigator.share({title:"Word Unfolded",text:msg,url}).catch(()=>{});else{navigator.clipboard.writeText(msg+" "+url);toast("Link copied")}};
  $("#copy").onclick=()=>{navigator.clipboard.writeText(url).then(()=>toast("Link copied"))};
  loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js").then(()=>{const q=qrcode(0,"M");q.addData(url);q.make();$("#qr").innerHTML=q.createSvgTag({cellSize:4,margin:2,scalable:true})}).catch(()=>{$("#qr").style.display="none"});
  $("#ics").onclick=()=>{const d=todayStr().replace(/-/g,"");
    const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Word Unfolded//EN\r\nBEGIN:VEVENT\r\nUID:wu-${Date.now()}@wordunfolded\r\nDTSTAMP:${d}T000000Z\r\nDTSTART:${d}T070000\r\nDURATION:PT30M\r\nRRULE:FREQ=DAILY${S.plan?";UNTIL="+S.plan.end.replace(/-/g,"")+"T235959Z":""}\r\nSUMMARY:Bible reading (Word Unfolded)\r\nDESCRIPTION:Today's chapters: ${url}#/today\r\nBEGIN:VALARM\r\nTRIGGER:PT0M\r\nACTION:DISPLAY\r\nDESCRIPTION:Time in the Word\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
    download("bible-reading-reminder.ics",ics,"text/calendar");toast("Open the file to add a 7 AM daily reminder")};
  $("#bk").onclick=()=>download(`word-unfolded-backup-${todayStr()}.json`,JSON.stringify(S),"application/json");
  $("#rs").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||typeof d.read!=="object")throw 0;S=Object.assign(defaultState(S.name),d,{name:S.name});save();applyPrefs();toast("Backup restored");viewMe()}catch(err){toast("That file isn't a Word Unfolded backup")}};r.readAsText(f)};
  $("#out").onclick=logout;
}

/* ---------- router ---------- */
function route(){
  const h=decodeURIComponent(location.hash.slice(2)||"");const [p,a,b]=h.split("/");
  closeSheet();
  if(!user){if(FB)initFirebase().then(()=>{if(!user)viewLogin()});else viewLogin();return}
  if(!S.plan&&p!=="setup"){location.hash="#/setup";return}
  switch(p){
    case "setup":return viewSetup();
    case "bible":return viewBible();
    case "book":return viewBook(a);
    case "read":return viewRead(a,b);
    case "study":return viewStudy();
    case "exam":return viewExam(a);
    case "mini":return viewMini(a,b);
    case "cards":return viewCards(a);
    case "timeline":return viewTimeline();
    case "notes":return viewNotes();
    case "memory":return viewMemory();
    case "me":return viewMe();
    default:return viewToday();
  }
}
window.addEventListener("hashchange",route);

/* ---------- boot ---------- */
(function boot(){
  const act=LS.get("wu:active",null);
  if(act&&act.mode==="local"&&LS.get("wu:profiles",[]).some(p=>p.id===act.id)){user={id:act.id,name:act.name,mode:"local"};S=Object.assign(defaultState(act.name),LS.get("wu:state:"+act.id,{}));S.prefs=Object.assign(defaultState().prefs,S.prefs||{});applyPrefs()}
  if(FB)initFirebase().catch(e=>{console.warn("Firebase failed",e);toast("Couldn't reach the sign-in service")});
  route();
  if("serviceWorker" in navigator&&location.protocol==="https:")navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
window.__wu={godSegments,wordBank,orderList,buildQuiz};
})();
