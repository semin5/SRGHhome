import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'SRGH · IT Universe',description:'업무일지, 메신저, 서버관리와 모니터링을 연결하는 SRGH IT팀의 업무 공간.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
