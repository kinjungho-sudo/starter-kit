---
member: 수아
week: 1
title: 하루 만에 포트폴리오 사이트 배포
date: "2026-04-28"
url: https://sua-portfolio.vercel.app
stack: [HTML, Tailwind CSS, Vercel]
---

### 결과물

Claude Code와 Vercel을 연결해 포트폴리오 사이트를 하루 만에 배포했습니다.

- 배포 URL: https://sua-portfolio.vercel.app
- 기술 스택: HTML, Tailwind CSS, Vercel

### 만든 과정 및 삽질

처음에는 Next.js로 시작하려 했는데 빌드 에러가 계속 나서 결국 순수 HTML로 갈아탔습니다.
Claude Code에 디자인 시안을 텍스트로 설명했더니 바로 코드를 짜줘서 놀랐어요.
가장 오래 걸린 건 Vercel 도메인 연결이었는데 DNS 설정을 잘못 이해하고 있었습니다.

### 인사이트

- Claude Code는 "이런 느낌으로 만들어줘"라는 추상적 요청도 잘 받아들인다
- 처음부터 복잡한 프레임워크 쓰지 말고, 빠르게 결과 보고 싶으면 HTML부터 시작
- Vercel 배포는 생각보다 훨씬 쉬웠다. `vercel --yes` 한 줄로 끝

### 다시 한다면?

디자인 시스템을 먼저 정하고 시작할 것 같아요. 컴포넌트 중간에 색상을 바꾸려니 전체를 다 고쳐야 해서 시간이 많이 걸렸습니다.
