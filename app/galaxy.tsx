'use client';
import { useMemo } from 'react';
import { AdditiveBlending } from 'three';

// Seeded particles stay stable across renders and form a real three-dimensional spiral.
export function Galaxy(){
 const {positions,sizes,brightness}=useMemo(()=>{
 let seed=7182;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const count=2600,positions=new Float32Array(count*3),sizes=new Float32Array(count),brightness=new Float32Array(count);
 for(let i=0;i<count;i++){
  const background=i<180;const r=.2+Math.pow(random(),.65)*7;
  const angle=(i%3)*Math.PI*2/3+r*.9+(random()-.5)*(.35+r*.045);
  positions[i*3]=background?(random()-.5)*38:Math.cos(angle)*r;
  positions[i*3+1]=background?(random()-.5)*18:Math.sin(angle)*r*.34+(random()-.5)*.18;
  positions[i*3+2]=background?-3-random()*18:-7+Math.sin(angle)*r*.35+(random()-.5)*.65;
  sizes[i]=background?1.2+random()*2.2:1+random()*2.4;
  brightness[i]=background?.2+random()*.55:.025+random()*.14;
 }
 return {positions,sizes,brightness};
 },[]);
 return <points rotation={[0,0,-.25]} frustumCulled={false}>
 <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/><bufferAttribute attach="attributes-pointSize" args={[sizes,1]}/><bufferAttribute attach="attributes-brightness" args={[brightness,1]}/></bufferGeometry>
 <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending}
 vertexShader={`attribute float pointSize; attribute float brightness; varying float alpha; void main(){vec4 viewPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*viewPosition;gl_PointSize=clamp(pointSize*24.0/-viewPosition.z,1.0,6.0);alpha=brightness;}`}
 fragmentShader={`varying float alpha; void main(){float distanceToCenter=length(gl_PointCoord-vec2(.5));float glow=1.0-smoothstep(.0,.5,distanceToCenter);gl_FragColor=vec4(vec3(1.0),glow*alpha);}`}/>
 </points>;
}
