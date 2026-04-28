---
author: 민준
week: 1
title: Chrome Extension manifest v3에서 API 키를 안전하게 관리하는 법
tags: [Chrome Extension, manifest v3, chrome.storage, 보안]
summary: manifest v3에서 API 키 하드코딩을 피하고 chrome.storage.sync로 안전하게 관리하는 방법.
---

## 문제

background.js에 API 키를 하드코딩하면 Extension 소스를 압축 해제하는 것만으로 키가 노출된다.

```js
// ❌ 절대 하지 말 것
const API_KEY = "sk-ant-...";
```

## 해결: chrome.storage.sync 활용

```js
// options.js (옵션 페이지에서 키 입력받기)
document.getElementById('save').addEventListener('click', () => {
  const key = document.getElementById('apiKey').value;
  chrome.storage.sync.set({ apiKey: key }, () => {
    console.log('API 키 저장됨');
  });
});

// background.js (키 불러오기)
chrome.storage.sync.get(['apiKey'], async (result) => {
  const apiKey = result.apiKey;
  if (!apiKey) {
    console.error('API 키가 설정되지 않았습니다.');
    return;
  }
  // 이후 API 호출
});
```

## manifest.json 설정

```json
{
  "manifest_version": 3,
  "permissions": ["storage", "activeTab"],
  "options_page": "options.html"
}
```

## 핵심 인사이트

보안은 나중에 추가하는 게 아니라 처음부터 설계에 포함해야 한다. Claude Code가 하드코딩을 발견하고 경고해줬지만, 직접 체크리스트를 만들어 습관화하는 게 더 확실하다.
