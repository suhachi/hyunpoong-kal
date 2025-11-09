/**
 * 간단한 테스트용 App 컴포넌트
 * 기본 렌더링만 확인
 */

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #D61C1C 0%, #F37021 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        maxWidth: '600px',
        width: '100%',
        color: '#2E1C10'
      }}>
        <h1 style={{ color: '#D61C1C', marginTop: 0 }}>
          ✅ React 앱이 정상 작동합니다!
        </h1>
        
        <div style={{
          padding: '20px',
          background: '#d4edda',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <p><strong>현풍닭칼국수 PWA</strong></p>
          <p>기본 React 렌더링이 성공적으로 완료되었습니다.</p>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => window.location.href = '/test-app.html'}
            style={{
              background: '#D61C1C',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              margin: '5px'
            }}
          >
            테스트 페이지로 이동
          </button>
          
          <button 
            onClick={() => alert('App.tsx 정상 작동 중!')}
            style={{
              background: '#F37021',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              margin: '5px'
            }}
          >
            테스트 클릭
          </button>
        </div>
        
        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd',
          fontSize: '14px',
          color: '#666'
        }}>
          <p><strong>다음 단계:</strong></p>
          <ol>
            <li>이 화면이 보이면 React가 정상 작동하는 것입니다</li>
            <li>브라우저 콘솔(F12)에서 에러가 있는지 확인하세요</li>
            <li>App.tsx를 원래대로 복구하여 테스트하세요</li>
          </ol>
        </div>
        
        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }}>
          © 2024 KS컴퍼니 (사업자번호: 553-17-00098)<br>
          대표: 석경선 / 공동대표: 배종수
        </div>
      </div>
    </div>
  );
}
