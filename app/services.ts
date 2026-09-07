export type WorkItem={id:string;name:string;english:string;description:string;position:[number,number,number]};
export const workItems:WorkItem[]=[
{id:'medical',name:'의료정보',english:'Medical Information',description:'의료 현장의 정보 흐름과 업무 시스템을 안정적으로 연결합니다.',position:[-3.8,1.9,0]},
{id:'access',name:'출입통제',english:'Access Control',description:'안전한 출입 환경과 권한 체계를 운영합니다.',position:[3.9,1.5,-.5]},
{id:'server',name:'서버',english:'Server',description:'핵심 서비스가 멈추지 않도록 인프라를 관리합니다.',position:[-3.2,-1.6,.6]},
{id:'network',name:'통신',english:'Communication',description:'조직 안팎의 안정적인 연결과 통신 환경을 책임집니다.',position:[3.3,-1.7,.2]},
{id:'development',name:'개발',english:'Development',description:'필요한 도구를 만들고 업무 경험을 개선합니다.',position:[.2,.1,-1]}
];
