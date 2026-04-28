---
member: 예린
week: 1
title: Obsidian → 링크드인 자동 변환기
date: "2026-04-28"
url: https://github.com/yerin-lab/obs2linkedin
stack: [Python, Anthropic SDK, python-dotenv, pyperclip]
---

### 결과물

Obsidian 노트를 자동으로 링크드인 포스트 형식으로 변환해주는 Python 스크립트를 만들었습니다.

- GitHub: https://github.com/yerin-lab/obs2linkedin
- 입력: .md 파일 경로 / 출력: 링크드인 최적화 텍스트 (클립보드 복사까지)

### 만든 과정 및 삽질

처음엔 GPT API를 쓰려 했는데 팀에서 Claude 쓰기로 했으니 Anthropic SDK로 바꿨습니다.
Python 환경변수 로딩을 `os.environ` 대신 `python-dotenv`로 처리하는 법을 이번에 처음 제대로 배웠어요.
Claude에게 "링크드인 알고리즘에 최적화된 포스트"를 써달라고 했을 때 훨씬 퀄리티가 높아졌습니다.

### 인사이트

- 프롬프트에 **플랫폼 특성**을 명시하면 결과가 확 달라진다
- `python-dotenv` 는 모든 Python 프로젝트에서 기본으로 쓰는 게 좋겠다
- 클립보드 자동 복사(pyperclip) 하나로 사용성이 엄청 올라감

### 다시 한다면?

Obsidian frontmatter의 다양한 형식을 미리 파악하고 파서를 짰을 것 같아요. 현재는 단순 텍스트만 처리합니다.
