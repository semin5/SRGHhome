'use client';
import { useState, useEffect, useRef, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { Vector3, type Mesh } from 'three';
import { ArrowUpRight, Server, MessageCircle, BookOpen, Activity, FileText, LifeBuoy, RotateCcw, Plus, Minus, Grid2X2, Orbit } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { services, type Service } from './services';
const icons = [Server, MessageCircle, BookOpen, Activity, FileText, LifeBuoy];
class SceneBoundary extends Component<{children:ReactNode; fallback:ReactNode},{failed:boolean}> {
 state={failed:false}; static getDerivedStateFromError(){return {failed:true};} render(){return this.state.failed?this.props.fallback:this.props.children;}
}
function Planet({service,index,onSelect,reduced}:{service:Service;index:number;onSelect:(s:Service)=>void;reduced:boolean}){
 const ref=useRef<Mesh>(null); const [hover,setHover]=useState(false); const Icon=icons[index];
 useFrame((state,delta)=>{if(ref.current){const size=hover?1.12:1;ref.current.scale.lerp(new Vector3(size,size,size),Math.min(delta*7,1));if(!reduced)ref.current.position.y=service.position[1]+Math.sin(state.clock.elapsedTime*.45+index)*.09;}});
 return <group position={[service.position[0],0,service.position[2]]}>
 <mesh ref={ref} position={[0,service.position[1],0]} onPointerOver={()=>setHover(true)} onPointerOut={()=>setHover(false)} onClick={()=>onSelect(service)}><sphereGeometry args={[service.radius,48,48]}/><meshStandardMaterial color={service.color} roughness={.28} metalness={.05}/></mesh>
 {index===0&&<mesh position={[0,service.position[1],0]} rotation={[1.18,.2,-.3]}><torusGeometry args={[service.radius*1.5,.018,12,100]}/><meshStandardMaterial color="#a9c7fa"/></mesh>}
 <Html center position={[0,service.position[1]-service.radius-.4,.2]}><button className="planet-label" onClick={()=>onSelect(service)} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}><span><Icon size={14}/>{service.name}<ArrowUpRight size={12}/></span><small>{service.english}</small></button></Html>
 </group>;
}
function Camera({zoom,reduced}:{zoom:number;reduced:boolean}) {useFrame(({camera,pointer,size},delta)=>{camera.position.lerp(new Vector3(reduced?0:pointer.x*.65,reduced?0:pointer.y*.35,zoom*Math.max(1,1.65/(size.width/size.height))),Math.min(1,delta*3));camera.lookAt(0,0,0);});return null;}
function Universe({onSelect,zoom,reduced}:{onSelect:(s:Service)=>void;zoom:number;reduced:boolean}){
 return <Canvas camera={{position:[0,0,16],fov:43}} dpr={[1,1.5]} fallback={<p className="fallback">3D를 사용할 수 없습니다. 아래 서비스 바로가기를 이용해 주세요.</p>}>
 <ambientLight intensity={1.7}/><directionalLight position={[-5,8,10]} intensity={3}/><Camera zoom={zoom} reduced={reduced}/>
 {[3.5,5.8,8].map((r,i)=><Line key={r} points={Array.from({length:129},(_,j)=>{const a=j/128*Math.PI*2;return [Math.cos(a)*r,Math.sin(a)*r*.38,-2-i*.4] as [number,number,number];})} color="#e6eaf0" lineWidth={1}/>)}
 {Array.from({length:45},(_,i)=><mesh key={i} position={[Math.sin(i*127.1)*10,Math.cos(i*73.7)*5,-3-(i%4)]}><sphereGeometry args={[i%5===0?.027:.013,6,6]}/><meshBasicMaterial color={['#c5d8fc','#e3e7eb','#f6df9b','#d8e8dc'][i%4]}/></mesh>)}
 {services.map((s,i)=><Planet key={s.id} service={s} index={i} onSelect={onSelect} reduced={reduced}/>)}
 </Canvas>;
}
export default function Home(){
 const [selected,setSelected]=useState<Service|null>(null);const [zoom,setZoom]=useState(16); const [view,setView]=useState<'space'|'list'>('space'); const [reduced,setReduced]=useState(false); const stage=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(window.innerWidth<700)setView('list');const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(q.matches);update();q.addEventListener('change',update);return()=>q.removeEventListener('change',update);},[]);
 useEffect(()=>{const el=stage.current;if(!el||view!=='space')return;const wheel=(e:WheelEvent)=>{e.preventDefault();setZoom(z=>Math.max(13,Math.min(22,z+e.deltaY*.007)));};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);},[view]);
 const select=(s:Service)=>{if(s.url){window.location.assign(s.url);}else setSelected(s);};
 const list=<div className="service-grid">{services.map((s,i)=>{const Icon=icons[i];return <button key={s.id} className="service-card" onClick={()=>select(s)}><Icon style={{color:s.color}} size={26}/><strong>{s.name}</strong><p>{s.description}</p><span>서비스 보기 <ArrowUpRight size={14}/></span></button>})}</div>;
 return <main>
 <header className="header"><a href="/" className="brand" aria-label="SRGH 홈"><span className="brand-colors"><b>S</b><b>R</b><b>G</b><b>H</b></span><span className="brand-divider"/> <span>IT Universe</span></a><div className="header-right"><span>우리의 업무를 연결하는 공간</span><span className="team-badge">IT</span></div></header>
 <section className="intro"><div className="eyebrow"><span/>SRGH IT WORKSPACE</div><h1>작은 연결, <span>무한한 가능성.</span></h1><p>필요한 서비스를 발견하고, 당신의 업무로 바로 이어지세요.</p></section>
 <section className="workspace" aria-label="IT 서비스 탐색"><div className="workspace-toolbar"><span className="section-label">나의 업무 우주 <span>06</span></span><div className="view-controls"><button aria-pressed={view==='space'} onClick={()=>setView('space')}><Orbit size={15}/>우주 보기</button><button aria-pressed={view==='list'} onClick={()=>setView('list')}><Grid2X2 size={15}/>목록 보기</button></div></div>
 {view==='space'?<div className="space-stage" ref={stage}><SceneBoundary fallback={list}><Universe zoom={zoom} reduced={reduced} onSelect={select}/></SceneBoundary><div className="central-brand" aria-hidden="true"><span className="central-mark"><i>I</i><i>T</i><i> </i><i>T</i><i>E</i><i>A</i><i>M</i></span><span>함께 연결되는 우리</span></div><div className="stage-bottom"><span>마우스로 둘러보고 · 스크롤로 가까이</span><div className="zoom-controls"><button aria-label="축소" disabled={zoom>=22} onClick={()=>setZoom(z=>Math.min(22,z+1.5))}><Minus size={17}/></button><button aria-label="시점 초기화" onClick={()=>setZoom(16)}><RotateCcw size={15}/></button><button aria-label="확대" disabled={zoom<=13} onClick={()=>setZoom(z=>Math.max(13,z-1.5))}><Plus size={17}/></button></div></div></div>:list}
 </section>
 <nav className="shortcuts" aria-label="서비스 바로가기"><span>바로가기</span>{services.map((s,i)=>{const Icon=icons[i];return <button key={s.id} onClick={()=>select(s)}><Icon size={17} style={{color:s.color}}/>{s.name}</button>})}</nav>
 <footer><span><span className="footer-dot"/>SRGH · IT Team</span><span>더 단순하게 연결하고, 더 큰 일에 집중하세요.</span><span>IT Universe</span></footer>
 <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="service-dialog"><span className="dialog-status">연결 준비 중</span><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.description}</DialogDescription><p className="dialog-note">서비스 주소가 아직 등록되지 않았습니다.<br/>주소가 연결되면 이곳에서 바로 이동할 수 있어요.</p></DialogContent></Dialog>
 </main>;
}

