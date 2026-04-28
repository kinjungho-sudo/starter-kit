---
member: 민준
week: 1
title: Chrome 뉴스 요약 확장 프로그램
date: "2026-04-28"
url: https://github.com/minjun-build/news-summary-ext
stack: [Chrome Extension, manifest v3, Claude API]
---

### 결과물

뉴스 헤드라인을 자동으로 요약해주는 Chrome 확장 프로그램을 만들었습니다.

- GitHub: https://github.com/minjun-build/news-summary-ext
- 기능: 선택한 텍스트를 Claude API로 3줄 요약

### 만든 과정 및 삽질

Chrome extension manifest v3 문법이 v2랑 달라서 처음에 계속 로드가 안 됐어요.
Claude에게 에러 메시지를 그대로 붙여넣었더니 바로 원인을 짚어줬습니다.
API 키를 background.js에 하드코딩했다가 Claude가 경고해줘서 chrome.storage로 옮겼습니다.

### 인사이트

- Chrome extension은 manifest 버전이 핵심. v3 기준으로 찾아야 함
- AI에게 에러 메시지 전체를 주는 게 가장 빠른 디버깅 방법
- 보안은 나중에 생각하지 말고 처음부터 — Claude가 잡아줬지만 스스로 습관 들여야 함

### 다시 한다면?

처음부터 v3 문서만 참고할 것. 구글링하면 v2 예제가 많이 나와서 헷갈렸습니다.
