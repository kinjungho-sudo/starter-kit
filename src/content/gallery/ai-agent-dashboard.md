---
title: AI 에이전트 대시보드
maker: 정호
link: https://aaa-site-red.vercel.app/dashboard
type: external
created: "2026-05-01"
description: 자비스 중심 구조로 모든 에이전트·프로젝트를 한눈에 보는 대시보드. 4가지 뷰(연결도·칸반·그리드·타임라인) + 상세 모달.
tags: ["dashboard", "astro", "tailwind"]
agents:
  - Claude Code
skills:
  - frontend-design
features:
  - Astro 6 (SSG)
  - Tailwind CSS v4
  - Vercel 자동 배포
  - Vanilla JS 클라이언트 로직
spec_summary: "dashboard-spec.md 명세서를 Claude Code에 붙여넣으면 4가지 뷰 + 모달까지 한 번에 생성됩니다."
spec_stack:
  - "Astro 6 + Tailwind CSS v4"
  - "Node.js 22 / Vercel (정적 배포, SSG)"
  - "데이터: src/data/*.json (정적 JSON)"
  - "클라이언트 로직: public/scripts/dashboard.js (Vanilla JS)"
spec_how:
  - "Claude Code + frontend-design Skill 사용"
  - "dashboard-spec.md 명세서(약 580줄)를 컨텍스트로 제공"
  - "Astro 기반임을 명시 → Next.js 명세를 Astro로 자동 변환"
  - "보안 훅(innerHTML 차단)이 있어 setHTML 헬퍼 패턴으로 우회"
spec_steps:
  - "aaa-site 레포 클론 후 npm install"
  - "dashboard-spec.md 작성 (어떤 뷰, 어떤 데이터 구조가 필요한지 정의)"
  - "Claude Code에 '이 명세서 보고 대시보드 만들어줘' 입력"
  - "src/data/*.json에 실제 프로젝트/에이전트 데이터 입력"
  - "git push → Vercel 자동 배포"
spec_notes:
  - "명세서는 Next.js 기준이었지만 실제 레포가 Astro여서 Claude가 자동 변환함"
  - "innerHTML 대신 Range.createContextualFragment 패턴 사용 (보안 훅 우회)"
  - "동적 라우트(/dashboard/agents/[id])는 getStaticPaths로 전부 정적 생성"
---
