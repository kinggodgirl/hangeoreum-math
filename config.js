// 한 걸음 수학 · 서버 설정
// Supabase 대시보드 → Project Settings → API 에서 두 값을 복사해 따옴표 안에 넣으세요.
// 비워 두면 '체험 모드'로 동작해요. (로그인과 교사 화면이 이 기기 안에서만 흉내 내며 동작)
// (선택) calcNow: 'pi'처럼 기초 연산 칸 id를 넣으면 홈·오늘의 계산 맨 앞에 그 칸이 먼저 나와요(다 익히면 자동으로 빠져요).
//   넣지 않으면 지금 배우는 차시의 바탕 계산 중 아직 별이 없는 칸이 저절로 맨 앞에 와요. 예) calcNow: 'signmul',
window.HG_CONFIG = {
  supabaseUrl: 'https://zlwelfgvfbacmpeqwnkx.supabase.co',
  supabaseAnonKey: 'sb_publishable_V_wfXqbWJO7cjZmGAUeuOg_yFJmasqu'   // Publishable key (sb_publishable_...) 또는 예전 anon 키(eyJ...)
};
