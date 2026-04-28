---
author: 예린
week: 1
title: Obsidian 노트를 링크드인 포스트로 자동 변환하기
tags: [Python, Anthropic SDK, pyperclip, python-dotenv]
summary: Obsidian 마크다운 노트를 Claude API로 링크드인 최적화 포스트로 자동 변환. 클립보드 자동 복사 포함.
---

## 핵심 인사이트

프롬프트에 **플랫폼 특성**을 명시하면 결과가 확 달라진다.

단순히 "링크드인 포스트 작성"이 아닌 "링크드인 알고리즘에 최적화된 포스트 — 첫 2줄이 후킹이어야 하고, 줄바꿈을 자주 써야 하며, 본문에 링크를 넣지 않아야 함" 이라고 컨텍스트를 추가했을 때 품질이 크게 향상됐다.

## 핵심 코드 구조

```python
import anthropic
import pyperclip
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic()

def convert_to_linkedin(note_content: str) -> str:
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""
아래 Obsidian 노트를 링크드인 포스트로 변환해줘.
규칙: 첫 2줄이 후킹, 줄바꿈 자주, 본문에 링크 없음, 1200~1500자, 해시태그 3~5개.

노트:
{note_content}
"""
        }]
    )
    return message.content[0].text

if __name__ == "__main__":
    import sys
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        note = f.read()
    result = convert_to_linkedin(note)
    pyperclip.copy(result)
    print("✅ 클립보드에 복사됐습니다!")
    print(result)
```

## 배운 것

- `python-dotenv`로 환경변수 관리 — 모든 Python 프로젝트 기본값으로 쓸 것
- `pyperclip.copy()` 한 줄로 클립보드 복사 — 사용성이 크게 올라감
- 플랫폼별 프롬프트 컨텍스트의 중요성
