'use client';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, type Points } from 'three';

export function Galaxy(){
 const {size}=useThree();
 const galaxy=useRef<Points>(null);
 // Fill both landscape and portrait viewports while preserving a three-dimensional spiral.
 const aspect=size.width/size.height;
 const {positions,sizes,brightness,colors}=useMemo(()=>{
 let seed=7182;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const count=26000,positions=new Float32Array(count*3),sizes=new Float32Array(count),brightness=new Float32Array(count),colors=new Float32Array(count*3);
 for(let i=0;i<count;i++){
 const background=i<700;const bulge=i>=700&&i<7200;const ring=i>=7200&&i<15000;
 const angle=random()*Math.PI*2;
 let r=0;
 if(bulge)r=Math.pow(random(),2.35)*4.8;
 else if(ring)r=5.2+(random()-.5)*1.45+Math.sin(angle*3)*.28;
 else r=1.8+Math.pow(random(),.62)*13.5;
 positions[i*3]=background?(random()-.5)*48:Math.cos(angle)*r*(bulge?1.25:1);
 positions[i*3+1]=background?(random()-.5)*30:Math.sin(angle)*r*(bulge?.72:.48)+(random()-.5)*(bulge?.45:.22);
 positions[i*3+2]=background?-5-random()*20:(random()-.5)*(bulge?2.8:1.05)*Math.max(.2,1-r/18);
 sizes[i]=background?1+random()*2.3:bulge?2.5+random()*6.8:ring?2+random()*5.5:1.3+random()*3.6;
 brightness[i]=background?.3+random()*.65:bulge?.65+random()*.6:ring?.55+random()*.58:.22+random()*.7;
 const hue=random();let red=.36,green=.72,blue=1;
 if(background){red=hue>.88?1:.55;green=hue>.88?.4:.78;blue=hue>.88?.65:1}
 else if(bulge){red=1;green=.62+random()*.36;blue=.32+random()*.5}
 else if(ring){red=hue<.52?.18:1;green=hue<.52?.75+random()*.25:.22+random()*.3;blue=hue<.52?1:.72+random()*.28}
 else if(hue<.48){red=.25;green=.55+random()*.35;blue=1}
 else if(hue<.78){red=.62+random()*.25;green=.34+random()*.25;blue=1}
 else{red=1;green=.25+random()*.3;blue=.55+random()*.3}
 colors[i*3]=red;colors[i*3+1]=green;colors[i*3+2]=blue;
 }
 return {positions,sizes,brightness,colors};
 },[]);
 useFrame(({pointer,clock},delta)=>{if(!galaxy.current)return;const portrait=aspect<1;const t=Math.min(delta*1.7,1);const rotationX=(portrait?-1.2:-1.36)+pointer.y*.07;const rotationY=(portrait?.06:-.1)+pointer.x*.11;const rotationZ=(portrait?.58:-.42)+Math.sin(clock.elapsedTime*.16)*.035+pointer.x*.04;galaxy.current.rotation.x+=(rotationX-galaxy.current.rotation.x)*t;galaxy.current.rotation.y+=(rotationY-galaxy.current.rotation.y)*t;galaxy.current.rotation.z+=(rotationZ-galaxy.current.rotation.z)*t;galaxy.current.position.x+=(pointer.x*.42-galaxy.current.position.x)*t;galaxy.current.position.y+=(-pointer.y*.2+Math.sin(clock.elapsedTime*.22)*.05-galaxy.current.position.y)*t});
 return <points ref={galaxy} position={[0,0,0]} rotation={[aspect<1?-1.2:-1.36,aspect<1?.06:-.1,aspect<1?.58:-.42]} scale={aspect<1?2.08:Math.max(1.84,aspect/1.18)} frustumCulled={false}>
 <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/><bufferAttribute attach="attributes-pointSize" args={[sizes,1]}/><bufferAttribute attach="attributes-brightness" args={[brightness,1]}/><bufferAttribute attach="attributes-starColor" args={[colors,3]}/></bufferGeometry>
 <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}
 vertexShader={`attribute float pointSize;attribute float brightness;attribute vec3 starColor;varying float alpha;varying vec3 color;void main(){vec4 viewPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*viewPosition;gl_PointSize=clamp(pointSize*34.0/-viewPosition.z,1.0,12.0);alpha=brightness;color=starColor;}`}
 fragmentShader={`varying float alpha;varying vec3 color;void main(){float r=length(gl_PointCoord-vec2(.5));float halo=exp(-r*r*13.0);float core=exp(-r*r*85.0);float edge=1.0-smoothstep(.38,.5,r);gl_FragColor=vec4(mix(color,vec3(1.0),core*.72),(halo*.7+core)*edge*alpha);}`}/>
 </points>;
}
