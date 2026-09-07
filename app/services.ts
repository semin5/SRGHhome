export type Service={id:string;name:string;english:string;description:string;color:string;position:[number,number,number];radius:number;url:string|null};
// 실제 서비스 주소가 준비되면 url에 https:// 주소를 입력하세요.
export const services:Service[]=[
{id:'server',name:'서버관리',english:'Infrastructure',description:'서버와 인프라를 한곳에서 관리하세요.',color:'#4285f4',position:[-4.5,1.4,0],radius:.55,url:null},
{id:'messenger',name:'메신저',english:'SRGHtalk',description:'동료와 대화하고 팀의 소식을 나누세요.',color:'#34a853',position:[4.4,1.25,-.5],radius:.47,url:null},
{id:'worklog',name:'업무일지',english:'Worklog',description:'오늘의 업무와 진행 상황을 기록하세요.',color:'#fbbc04',position:[-3.55,-1.3,1],radius:.43,url:null},
{id:'monitoring',name:'모니터링',english:'Monitoring',description:'시스템의 상태와 주요 지표를 확인하세요.',color:'#ea4335',position:[3.5,-1.5,.5],radius:.51,url:null},
{id:'docs',name:'IT 문서',english:'Knowledge',description:'업무에 필요한 가이드와 기술 문서를 찾아보세요.',color:'#7b8fd9',position:[.45,2.05,-1.7],radius:.29,url:null},
{id:'support',name:'장애접수',english:'Help desk',description:'불편한 점을 알리고 IT팀의 도움을 받으세요.',color:'#5c9ead',position:[-.3,-2.55,-1.5],radius:.28,url:null}
];
