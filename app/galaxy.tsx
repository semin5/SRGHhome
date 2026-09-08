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
 const count=41300,positions=new Float32Array(count*3),sizes=new Float32Array(count),brightness=new Float32Array(count),colors=new Float32Array(count*3);
 for(let i=0;i<count;i++){
 const background=i<12000;const bulge=i>=12000&&i<17400;const bar=i>=17400&&i<21100;
 let px=0,py=0,pz=0,r=0;
 if(background){px=(random()-.5)*62;py=(random()-.5)*58+3;pz=-1-random()*7}
 else if(bulge){r=Math.pow(random(),2.25)*4.2;const a=random()*Math.PI*2;px=Math.cos(a)*r*1.22;py=Math.sin(a)*r*.72;pz=(random()-.5)*2.7*Math.max(.25,1-r/5)}
 else if(bar){const u=(random()-.5)*9.2,v=(random()-.5)*(1.15-Math.abs(u)*.075),a=.24;px=u*Math.cos(a)-v*Math.sin(a);py=u*Math.sin(a)+v*Math.cos(a);pz=(random()-.5)*.85}
 else{r=.7+Math.pow(random(),.68)*13.8;const arm=(i%4)*Math.PI/2;const a=arm+r*.48+(random()-.5)*(.34+r*.018);px=Math.cos(a)*r;py=Math.sin(a)*r*.66+(random()-.5)*.38;pz=(random()-.5)*1.05*Math.max(.3,1-r/18)}
 positions[i*3]=px;positions[i*3+1]=py;positions[i*3+2]=pz;
 sizes[i]=background?1.7+random()*3.8:bulge?2.6+random()*6.4:bar?2.1+random()*5.2:1.5+random()*4.6;
 brightness[i]=background?.48+random()*.72:bulge?.7+random()*.58:bar?.52+random()*.58:.3+random()*.82;
 const hue=random();let red=.62,green=.78,blue=1;
 if(background){if(hue<.72){red=.58+random()*.25;green=.72+random()*.22;blue=1}else if(hue<.93){red=.9+random()*.1;green=.9+random()*.1;blue=1}else{red=1;green=.48+random()*.25;blue=.35+random()*.3}}
 else if(bulge){red=1;green=.78+random()*.22;blue=.52+random()*.34}
 else if(bar){red=1;green=.68+random()*.28;blue=.42+random()*.38}
 else if(hue<.46){red=.28+random()*.28;green=.68+random()*.27;blue=1}
 else if(hue<.7){red=.68+random()*.25;green=.78+random()*.2;blue=1}
 else if(hue<.86){red=.55+random()*.24;green=.36+random()*.28;blue=1}
 else if(hue<.96){red=1;green=.24+random()*.3;blue=.58+random()*.3}
 else{red=.25+random()*.2;green=.86+random()*.14;blue=1}
 colors[i*3]=red;colors[i*3+1]=green;colors[i*3+2]=blue;
 }
 return {positions,sizes,brightness,colors};
 },[]);
 const backdrop=useMemo(()=>{let seed=9461;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const count=14000,positions=new Float32Array(count*3),sizes=new Float32Array(count),brightness=new Float32Array(count),colors=new Float32Array(count*3);for(let i=0;i<count;i++){positions[i*3]=(random()-.5)*72;positions[i*3+1]=(random()-.5)*50;positions[i*3+2]=-3-random()*14;sizes[i]=1.2+random()*3.2;brightness[i]=.32+random()*.62;const warm=random()>.92;colors[i*3]=warm?1:.62+random()*.24;colors[i*3+1]=warm?.58+random()*.24:.75+random()*.2;colors[i*3+2]=warm?.48+random()*.24:1}return{positions,sizes,brightness,colors}},[]);
 useFrame(({pointer,clock},delta)=>{if(!galaxy.current)return;const portrait=aspect<1;const t=Math.min(delta*1.7,1);const rotationX=(portrait?-1.01:-1.17)+pointer.y*.09;const rotationY=(portrait?.06:-.1)+pointer.x*.13;const rotationZ=(portrait?.48:-.56)+Math.sin(clock.elapsedTime*.16)*.04+pointer.x*.045;galaxy.current.rotation.x+=(rotationX-galaxy.current.rotation.x)*t;galaxy.current.rotation.y+=(rotationY-galaxy.current.rotation.y)*t;galaxy.current.rotation.z+=(rotationZ-galaxy.current.rotation.z)*t;galaxy.current.position.x+=(pointer.x*.46-galaxy.current.position.x)*t;galaxy.current.position.y+=(-pointer.y*.25+Math.sin(clock.elapsedTime*.22)*.06-galaxy.current.position.y)*t});
 return <><points frustumCulled={false}>
 <bufferGeometry><bufferAttribute attach="attributes-position" args={[backdrop.positions,3]}/><bufferAttribute attach="attributes-pointSize" args={[backdrop.sizes,1]}/><bufferAttribute attach="attributes-brightness" args={[backdrop.brightness,1]}/><bufferAttribute attach="attributes-starColor" args={[backdrop.colors,3]}/></bufferGeometry>
 <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} vertexShader={`attribute float pointSize;attribute float brightness;attribute vec3 starColor;varying float alpha;varying vec3 color;void main(){vec4 viewPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*viewPosition;gl_PointSize=clamp(pointSize*28.0/-viewPosition.z,1.0,7.0);alpha=brightness;color=starColor;}`} fragmentShader={`varying float alpha;varying vec3 color;void main(){float r=length(gl_PointCoord-vec2(.5));float glow=exp(-r*r*18.0);float edge=1.0-smoothstep(.38,.5,r);gl_FragColor=vec4(mix(color,vec3(1.0),exp(-r*r*100.0)*.65),glow*edge*alpha);}`}/>
 </points><points ref={galaxy} position={[0,0,0]} rotation={[aspect<1?-1.01:-1.17,aspect<1?.06:-.1,aspect<1?.48:-.56]} scale={aspect<1?1.9:Math.max(1.68,aspect/1.28)} frustumCulled={false}>
 <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions,3]}/><bufferAttribute attach="attributes-pointSize" args={[sizes,1]}/><bufferAttribute attach="attributes-brightness" args={[brightness,1]}/><bufferAttribute attach="attributes-starColor" args={[colors,3]}/></bufferGeometry>
 <shaderMaterial transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false}
 vertexShader={`attribute float pointSize;attribute float brightness;attribute vec3 starColor;varying float alpha;varying vec3 color;void main(){vec4 viewPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*viewPosition;gl_PointSize=clamp(pointSize*34.0/-viewPosition.z,1.0,12.0);alpha=brightness;color=starColor;}`}
 fragmentShader={`varying float alpha;varying vec3 color;void main(){float r=length(gl_PointCoord-vec2(.5));float halo=exp(-r*r*11.0);float core=exp(-r*r*105.0);float edge=1.0-smoothstep(.39,.5,r);vec3 glow=mix(color,vec3(1.0),core*.82);gl_FragColor=vec4(glow,(halo*.76+core*1.15)*edge*alpha);}`}/>
 </points></>;
}
