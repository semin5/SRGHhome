'use client';
import { useState, useEffect, useRef, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { AdditiveBlending, Vector3, type Group } from 'three';
import { ArrowUpRight, ArrowDown, ArrowLeft, Grid2X2, Server, MessageCircle, BookOpen, Activity, FileText, LifeBuoy } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { services, type Service } from './services';
import { Galaxy } from './galaxy';
const icons=[Server,MessageCircle,BookOpen,Activity,FileText,LifeBuoy];
const headlines=['안정적인 업무의\n시작점.','대화가 흐르면,\n업무도 이어집니다.','오늘의 기록이\n내일의 방향으로.','보이지 않는 흐름을\n한눈에.','함께 쌓은 지식,\n필요한 순간에.','막히는 순간,\n함께 해결합니다.'];
const tags=[['서버','인프라','운영 관리'],['팀 대화','협업','소식 공유'],['업무 기록','진행 상황','일일 정리'],['시스템 상태','주요 지표','운영 모니터링'],['업무 가이드','기술 문서','팀 지식'],['장애 문의','업무 지원','문제 해결']];
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<span className="scene-fallback">서비스는 하단 메뉴에서 선택할 수 있습니다.</span>:this.props.children}}
function ServiceLight({service,index,active,reduced,onChoose}:{service:Service;index:number;active:number;reduced:boolean;onChoose:(i:number)=>void}){
 const group=useRef<Group>(null);const [hover,setHover]=useState(false);const target=useRef(new Vector3());const scale=useRef(new Vector3());
 useFrame(({clock,size},delta)=>{if(!group.current)return;const mobile=size.width<700;const focused=active===index+1;const hidden=active>0&&!focused;
 target.current.set(focused?(mobile?0:3.3):service.position[0]*(mobile?.48:1.15),focused?(mobile?-1.7:0):service.position[1]*(mobile?1.15:1.35),focused?1:service.position[2]);
 if(!reduced)target.current.y+=Math.sin(clock.elapsedTime*.35+index)*.07;
 group.current.position.lerp(target.current,reduced?1:Math.min(delta*3.5,1));const s=hidden?.001:focused?2.8:hover?1.35:1;scale.current.setScalar(s);group.current.scale.lerp(scale.current,reduced?1:Math.min(delta*4,1));
 });
 return <group ref={group} position={[service.position[0],service.position[1]-1.8,service.position[2]]}>
 <mesh onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)} onClick={e=>{e.stopPropagation();onChoose(index+1)}}>
 <planeGeometry args={[1.7,1.7]}/>
 <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}
 vertexShader={`varying vec2 lightUv; void main(){lightUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`}
 fragmentShader={`varying vec2 lightUv;void main(){vec2 p=lightUv-.5;float r=length(p);float halo=exp(-r*12.0)*.42;float core=exp(-r*r*1800.0);float rays=(exp(-abs(p.x)*200.0)*exp(-abs(p.y)*16.0)+exp(-abs(p.y)*200.0)*exp(-abs(p.x)*16.0))*.4;gl_FragColor=vec4(vec3(1.0),min(1.0,halo+core+rays));}`}/>
 </mesh> {active===0&&<Html center position={[0,-.45,.1]} zIndexRange={[5,0]}><button className="planet-label" onClick={()=>onChoose(index+1)}>{service.name}<ArrowUpRight size={11}/></button></Html>}
 </group>;
}
function Camera({active,reduced}:{active:number;reduced:boolean}){const target=useRef(new Vector3());useFrame(({camera,pointer,size},delta)=>{target.current.set(reduced?0:pointer.x*.85,reduced?0:pointer.y*.4,(active?13.5:16)*Math.max(1,.85/(size.width/size.height)));camera.position.lerp(target.current,reduced?1:Math.min(delta*2.5,1));camera.lookAt(0,0,0)});return null}
export default function Home(){
 const [active,setActive]=useState(0);const [reduced,setReduced]=useState(false);const [selected,setSelected]=useState<Service|null>(null);const [allOpen,setAllOpen]=useState(false);const root=useRef<HTMLDivElement>(null!);const scroll=useRef<HTMLDivElement>(null);const sections=useRef<(HTMLElement|null)[]>([]);const nav=useRef<HTMLElement>(null);
 const go=(index:number)=>{sections.current[index]?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});};
 const open=(service:Service)=>{if(service.url)window.location.assign(service.url);else{setAllOpen(false);setSelected(service)}};
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update)},[]);
 useEffect(()=>{const jump=()=>{const match=location.hash.match(/^#sec0([1-7])$/);if(match)sections.current[Number(match[1])-1]?.scrollIntoView({behavior:'instant'})};jump();window.addEventListener('hashchange',jump);const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting&&entry.intersectionRatio>=.55){const index=Number((entry.target as HTMLElement).dataset.index);setActive(index);history.replaceState(null,'',`#sec0${index+1}`)}}},{root:scroll.current,threshold:[.55]});sections.current.forEach(s=>{if(s)observer.observe(s)});return()=>{observer.disconnect();window.removeEventListener('hashchange',jump)}},[]);
 useEffect(()=>{const item=nav.current?.children[active] as HTMLElement|undefined;if(item&&nav.current)nav.current.scrollTo({left:item.offsetLeft-nav.current.clientWidth/2+item.clientWidth/2,behavior:reduced?'instant':'smooth'})},[active,reduced]);
 return <div ref={root} className="experience">
 <a className="skip-link" href="#service-navigation">서비스 메뉴로 건너뛰기</a>
 <div className="universe"><SceneBoundary><Canvas eventSource={root} eventPrefix="client" camera={{position:[0,0,16],fov:43}} dpr={[1,1.5]} fallback={<span/>}><color attach="background" args={['#000']}/><ambientLight intensity={.16}/><directionalLight position={[-3,7,4]} intensity={2.3}/><directionalLight position={[5,-2,-3]} intensity={2}/><pointLight position={[6,-2,4]} intensity={5}/><Camera active={active} reduced={reduced}/><Galaxy/>{services.map((s,i)=><ServiceLight key={s.id} service={s} index={i} active={active} reduced={reduced} onChoose={i=>active===i?open(services[i-1]):go(i)}/>)}</Canvas></SceneBoundary></div>
 <header className="header"><a href="#sec01" onClick={e=>{e.preventDefault();go(0)}} className="brand"><strong>SRGH<span className="brand-period">.</span></strong><span>IT UNIVERSE</span></a><div className="header-actions"><span className="team-label">IT TEAM WORKSPACE</span><button onClick={()=>setAllOpen(true)}><Grid2X2 size={16}/>전체 서비스</button></div></header>
 <main ref={scroll} className="section-scroll" tabIndex={0} aria-label="스크롤로 업무 서비스 둘러보기" onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(['ArrowDown','PageDown','ArrowUp','PageUp','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?6:Math.max(0,Math.min(6,active+(['ArrowDown','PageDown'].includes(e.key)?1:-1))))}}}>
 <section id="sec01" data-index={0} ref={el=>{sections.current[0]=el}} className="full-section home-section"><h1 className="sr-only">SRGH IT Universe — 업무 서비스 은하</h1></section>
 {services.map((s,i)=>{const Icon=icons[i];return <section key={s.id} id={`sec0${i+2}`} data-index={i+1} ref={el=>{sections.current[i+1]=el}} className={`full-section detail-section ${active===i+1?'is-active':''}`}><div className="detail-copy"><p className="eyebrow"><span>{String(i+1).padStart(2,'0')}</span> / {s.english.toUpperCase()}</p><h2>{s.name}</h2><p className="section-headline">{headlines[i]}</p><p className="description">{s.description}</p><button className="launch-button" onClick={()=>open(s)}>서비스 바로가기<ArrowUpRight size={17}/></button><div className="topic-tags">{tags[i].map(t=><span key={t}>{t}</span>)}</div></div><div className="planet-caption"><Icon size={17}/><span>{s.english}</span><span className="caption-line"/><small>SRGH / {String(i+1).padStart(2,'0')}</small></div></section>})}
 </main>
 <aside className="page-position" aria-label="현재 섹션"><span>{String(active+1).padStart(2,'0')}</span><i/><span>07</span></aside>
 <div className="bottom-bar"><span className="bottom-credit">SRGH · IT TEAM</span><button className="scroll-cue" onClick={()=>go(active===6?0:active+1)} aria-label={active===6?'처음으로':'다음 서비스'}>{active===6?<ArrowLeft size={15}/>:<ArrowDown size={16}/>}<span>{active===6?'BACK TO HOME':'SCROLL TO EXPLORE'}</span></button><span className="bottom-note">SIX SERVICES. ONE SPACE.</span></div>
 <nav id="service-navigation" ref={nav} className="fixed-nav" aria-label="서비스 섹션">{['HOME',...services.map(s=>s.name)].map((name,i)=><a key={name} href={`#sec0${i+1}`} aria-current={active===i?'location':undefined} onClick={e=>{e.preventDefault();go(i)}}><small>{i===0?"✦":String(i).padStart(2,"0")}</small><span>{name}</span></a>)}</nav>
 <Dialog open={allOpen} onOpenChange={setAllOpen}><DialogContent className="all-services"><DialogTitle>전체 서비스</DialogTitle><DialogDescription>필요한 업무 서비스로 바로 이동하세요.</DialogDescription><div className="service-grid">{services.map((s,i)=>{const Icon=icons[i];return <button key={s.id} onClick={()=>open(s)}><Icon size={24}/><strong>{s.name}</strong><small>{s.english}</small><ArrowUpRight size={14}/></button>})}</div></DialogContent></Dialog>
 <Dialog open={!!selected} onOpenChange={value=>{if(!value)setSelected(null)}}><DialogContent className="service-dialog"><span className="dialog-status">연결 준비 중</span><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription><p className="dialog-note">서비스 주소가 아직 등록되지 않았습니다.<br/>주소가 연결되면 여기에서 바로 이동할 수 있어요.</p></DialogContent></Dialog>
 </div>;
}
