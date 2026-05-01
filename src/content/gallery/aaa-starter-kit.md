---
title: AAA 스터디 사이트
maker: 정호
link: https://aaa-site-red.vercel.app
type: external
created: "2026-05-01"
description: AI 빌더 스터디 AAA의 결과물 아카이브·갤러리·인사이트·대시보드를 담은 팀 사이트.
tags: ["astro", "tailwind", "vercel", "study"]
agents:
  - Claude Code
skills:
  - frontend-design
features:
  - Astro 6 (Content Collections, SSG)
  - Tailwind CSS v4
  - Vercel 자동 배포
  - 마크다운 기반 콘텐츠 관리
  - 사이드바 레이아웃
spec_summary: "Astro 스타터킷을 Claude Code로 확장. 마크다운 파일만 추가하면 페이지가 자동 생성되는 구조."
spec_stack:
  - "Astro 6 + Tailwind CSS v4"
  - "Node.js 22 / Vercel (정적 배포)"
  - "콘텐츠: src/content/*.md (Astro Content Collections)"
  - "GitHub push → Vercel 자동 빌드·배포"
spec_how:
  - "Claude Code + frontend-design Skill 사용"
  - "aaa-starter-kit 기존 코드를 컨텍스트로 제공"
  - "원하는 페이지/기능을 말로 요청 → Claude가 직접 파일 생성·수정"
spec_steps:
  - "aaa-starter-kit 레포 포크 또는 클론"
  - "npm install → npm run dev로 로컬 확인"
  - "Vercel 연결 후 GitHub 레포 import"
  - "Claude Code에 원하는 페이지/기능 요청"
  - "src/content/ 폴더에 마크다운 파일 추가하면 콘텐츠 자동 반영"
spec_notes:
  - "Content Collections 스키마(config.ts)를 먼저 정의해야 타입 오류 없음"
  - "Tailwind v4는 설정 파일 없이 vite 플러그인으로 동작 (v3와 다름)"
  - "갤러리·아카이브 등 반복 콘텐츠는 마크다운 추가만으로 확장 가능"
---
