#!/usr/bin/env bash
# sync-content.sh — vault 공개 폴더 → Astro 사이트 콘텐츠 동기화
# 화이트리스트 방식: 아래 명시된 폴더만 복사 (비공개 폴더 절대 포함 안 됨)
#
# 사용법: bash sync-content.sh
# 실행 위치: aaa-site/ 폴더에서 실행

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT="${SCRIPT_DIR}/../aaa-vault"  # 실제 vault 레포 경로로 수정
SITE="${SCRIPT_DIR}"
CONTENT_DIR="${SITE}/src/content"

# ──────────────────────────────────────────────────────────
# 공개 폴더 ↔ Astro 컬렉션 매핑
# 형식: "vault폴더:astro컬렉션"
# ──────────────────────────────────────────────────────────
declare -A MAPPING=(
  ["00_missions"]="missions"
  ["01_gallery"]="gallery"
  ["02_skill_insight"]="insights"
  ["90_analysis/weekly"]="analysis"
  ["90_analysis/members"]="members"
)

# 비공개 폴더 (동기화 금지)
# 01_meetings/  — 회의록
# 92_status/    — 출석/벌금 현황
# 99_meta/      — 운영 가이드, 멤버 목록
# 99_templates/ — 템플릿

echo "Vault → Site 동기화 시작"
echo "  Vault: ${VAULT}"
echo "  Site:  ${CONTENT_DIR}"
echo ""

if [ ! -d "${VAULT}" ]; then
  echo "오류: vault 폴더를 찾을 수 없습니다: ${VAULT}"
  echo "sync-content.sh 상단의 VAULT 경로를 실제 vault 레포 경로로 수정하세요."
  exit 1
fi

for vault_folder in "${!MAPPING[@]}"; do
  collection="${MAPPING[$vault_folder]}"
  src="${VAULT}/${vault_folder}"
  dst="${CONTENT_DIR}/${collection}"

  if [ -d "${src}" ]; then
    mkdir -p "${dst}"
    # 파일명 특수문자(?, %, (, )) → 언더스코어 치환 후 복사
    find "${src}" -maxdepth 1 -name "*.md" | while read -r file; do
      filename=$(basename "${file}")
      safe_name=$(echo "${filename}" | tr '?%()' '____')
      cp "${file}" "${dst}/${safe_name}"
    done
    count=$(find "${dst}" -name "*.md" | wc -l | tr -d ' ')
    echo "  [OK] ${vault_folder} -> ${collection}/ (${count}개 파일)"
  else
    echo "  [SKIP] ${vault_folder} 폴더 없음"
  fi
done

echo ""
echo "동기화 완료. 다음 단계:"
echo "  cd ${SITE} && npm run build"
