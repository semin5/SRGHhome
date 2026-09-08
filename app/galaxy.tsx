'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, type Points } from 'three';

export function Galaxy(){
 const {size}=useThree();
 const galaxy=useRef<Points>(null);
 // Fill both landscape and portrait viewports while preserving a three-dimensional spiral.
 const aspect=size.width/size.height;
 const {positions,sizes,brightness}=useMemo(()=>{
 let seed=7182;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const count=15000,positions=new Float32Array(count*3),sizes=new Float32Array(count),brightness=new Float32Array(count);
 for(let i=0;i<count;i++){
 const background=i<420;const core=i>=420&&i<2600;
 const r=core?Math.pow(random(),1.6)*2.5:.3+Math.pow(random(),.7)*13;
 const angle=(i%3)*Math.PI*2/3+r*.64+(random()-.5)*(core?6.28:.48+r*.045);
 positions[i*3]=background?(random()-.5)*48:Math.cos(angle)*r;
 positions[i*3+1]=background?(random()-.5)*30:Math.sin(angle)*r*.68+(random()-.5)*.6;
 positions[i*3+2]=background?-5-random()*20:Math.sin(angle)*r*.28+(random()-.5)*1.5;
 sizes[i]=background?1+random()*2:core?2+random()*5:1.4+random()*3.8;
 brightness[i]=background?.3+random()*.65:core?.55+random()*.45:.22+random()*.65;
 }
 return {positions,sizes,brightness};
 },[]);
 useFrame(({pointer,clock},delta)=>{if(!galaxy.current)return;const portrait=aspect<1;const t=Math.min(delta*1.7,1);const rotationX=(portrait?-.82:-.96)+pointer.y*.12;const rotationY=(portrait?.08:-.14)+pointer.x*.16;const rotationZ=(portrait?.58:-.42)+Math.sin(clock.elapsedTime*.16)*.045+pointer.x*.05;galaxy.current.rotation.x+=(rotationX-galaxy.current.rotation.x)*t;galaxy.current.rotation.y+=(rotationY-galaxy.current.rotation.y)*t;galaxy.current.rotation.z+=(rotationZ-galaxy.current.rotation.z)*t;galaxy.current.position.x+=(pointer.x*.5-galaxy.current.position.x)*t;galaxy.current.position.y+=(-pointer.y*.3+Math.sin(clock.elapsedTime*.22)*.07-galaxy.current.position.y)*t});
 return <points ref={galaxy} position={[0,0,0]} rotation={[aspect<1?-.82:-.96,aspect<1?.08:-.14,aspect<1?.58:-.42]} scale={aspect<1?1.82:Math.max(1.58,aspect/1.32)} frustumCulled={false}>
 <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/><bufferAttribute attach="attributes-pointSize" args={[sizes,1]}/><bufferAttribute attach="attributes-brightness" args={[brightness,1]}/></bufferGeometry>
 <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}
 vertexShader={`attribute float pointSize;attribute float brightness;varying float alpha;void main(){vec4 viewPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*viewPosition;gl_PointSize=clamp(pointSize*32.0/-viewPosition.z,1.0,10.0);alpha=brightness;}`}
 fragmentShader={`varying float alpha;void main(){float r=length(gl_PointCoord-vec2(.5));float glow=exp(-r*r*20.0)*(1.0-smoothstep(.35,.5,r));gl_FragColor=vec4(vec3(1.0),glow*alpha);}`}/>
 </points>;
}
