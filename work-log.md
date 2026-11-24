2026-11-24 / 현재 폴더의 Markdown 문서 구조 파악 / prompt.txt, work-log.md / 명세·디자인·작업 지침을 읽어 프로젝트 구조를 요약했다.
2026-11-24 / 손님 1명 등장 및 주문 표시 프로토타입 / index.html, style.css, game.js, prompt.txt, work-log.md / Phaser 도형과 텍스트만으로 손님과 고정 주문서를 표시해 단일 MVP 항목을 구현했다.
2026-11-24 / 플레이 가능한 버블티 매장 프로토타입 완성 / index.html, style.css, game.js, game-data.js, prompt.txt, work-log.md / 2개 레벨의 주문 제조·전달·보상·대기열·성공 및 실패 흐름을 고정 수치로 구현했다.
2026-11-25 / VS Code Go Live 미표시 원인 확인 / prompt.txt, work-log.md / 화면 상태에서 Live Server 확장이 설치되어 있지 않음을 확인했다.
2026-11-25 / VS Code Go Live 미표시 재확인 / prompt.txt, work-log.md / Live Server 확장 창이 열려 있고 VS Code 상태 표시줄이 숨겨져 있음을 확인했다.
2026-11-25 / Phaser 검은 화면 수정 / game.js, prompt.txt, work-log.md / CDN은 정상 응답하므로 WebGL 호환성 문제를 피하기 위해 Canvas 렌더러로 전환했다.
2026-11-25 / Phaser 장면 생성 오류 수정 / game.js, work-log.md / 브라우저 콘솔의 Arc API 오류에 맞춰 지원되지 않는 setLineWidth 호출을 setStrokeStyle로 교체했다.
2026-11-25 / MVP 구현 상태 점검 / prompt.txt, work-log.md / 명세의 MVP 항목을 현재 코드와 대조해 완료·부분 완료·미구현을 구분했다.
2026-11-25 / 화면 기준 명세 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 협의에 따라 MVP 화면 기준을 PC 가로형으로 통일했다.
2026-11-25 / MVP 레벨 수 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 협의에 따라 프로토타입 기본 진행 구조를 3개 레벨로 확장했다.
2026-11-25 / MVP 레벨 규칙 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 3개 레벨의 시간·목표 매출·주문 수·레시피를 명세화했다.
2026-11-25 / MVP 레시피 규칙 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 레시피별 제조 순서와 난이도 증가 단계를 명세화했다.
2026-11-25 / 성장·성공·실패 규칙 명세화 / spec (1).md, prompt.txt, work-log.md / 사용자 협의에 따라 매장 업그레이드·시급·승진·누적 진행과 매출·만족도 기반 성공 및 실패 조건을 반영했다.
2026-11-25 / MVP 승진 범위 조정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 3개 MVP 레벨을 알바 초반 구간으로 한정하고 실제 승진을 이후 신규 레벨로 분리했다.
2026-11-25 / 시급 보상 방식 확정 / spec (1).md, prompt.txt, work-log.md / 주문마다 시급 보너스를 즉시 지급해 업그레이드 효과와 보상 피드백을 강화하도록 명세화했다.
2026-11-25 / MVP 매장 업그레이드 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 초기 시급 보너스와 선택형 업그레이드 3종의 비용·효과를 명세화했다.
2026-11-25 / 업그레이드 구매 시점 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 업그레이드를 레벨 종료 결과 화면에서 구매하고 다음 레벨부터 적용하도록 명세화했다.
2026-11-25 / 매출·보유 돈 계산 기준 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 목표 매출은 음료 판매가만, 업그레이드용 보유 돈은 판매가와 시급 보너스 합계로 계산하도록 명세화했다.
2026-11-25 / 만족도 감소 기준 확정 / prompt.txt, work-log.md / 사용자 승인에 따라 만족도 3 시작과 오입력 1회당 만족도 1 감소 규칙을 확정했다.
2026-11-25 / 개별 손님 만족도 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 손님별 만족도와 한 명의 만족도 0에도 실패하는 규칙을 명세화했다.
2026-11-25 / 대기열 만족도 감소 규칙 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 대기 손님만 20초마다 만족도가 1 감소하도록 명세화했다.
2026-11-25 / 손님 순차 등장 방식 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 첫 손님 이후의 대기 손님을 시간 간격으로 순차 등장시키도록 명세화했다.
2026-11-25 / 레벨별 손님 등장 시점 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 3개 레벨의 손님 등장 시점을 초 단위로 명세화했다.
2026-11-25 / 대기열 손님 선택 규칙 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 제조 전 자유 선택과 제조 시작 후 주문 전환 제한 규칙을 명세화했다.
2026-11-25 / MVP 음료 판매가 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 모든 MVP 음료의 판매가를 10코인으로 통일하고 목표 매출과 주문 수의 대응을 명시했다.
2026-11-25 / 실패 후 업그레이드 구매 규칙 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 레벨 실패 결과 화면에서도 누적 보상으로 업그레이드를 구매할 수 있도록 명세화했다.
2026-11-25 / 경험치 보상 규칙 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 주문 성공당 경험치 5를 지급하고 MVP 승진 진행도 표시용으로 누적하도록 명세화했다.
2026-11-25 / 게임 피드백 표시 방식 확정 / spec (1).md, prompt.txt, work-log.md / 사용자 승인에 따라 HUD와 손님 카드에 표시할 진행·성장·대기 정보를 명세화했다.
2026-11-25 / MVP 작업 목록 재작성 / tasks.md, work-log.md / 최신 명세와 현재 구현을 대조해 완료 기반 기능과 검증 가능한 후속 작업을 분리했다.
2026-11-25 / 레벨 1 데이터 명세 반영 / stageData.js, config.js, game-data.js, game.js, tasks.md, prompt.txt, work-log.md / 첫 미완료 작업을 완료하고 스테이지·공통 규칙 수치를 데이터 파일로 분리했다.
2026-11-25 / 레벨 2 순차 손님 등장 구현 / game.js, tasks.md, prompt.txt, work-log.md / 레벨 데이터의 등장 시점에 따라 손님을 추가하고 주문 공백 상태를 처리했다.
2026-11-25 / 빠른 주문 처리 시 손님 조기 등장 / game.js, prompt.txt, work-log.md / 현재 등장한 주문을 모두 처리하면 다음 예약 손님을 즉시 대기열에 추가하도록 조정했다.
2026-11-25 / 레벨 3 및 직접 시작 주소 구현 / config.js, game-data.js, game.js, tasks.md, prompt.txt, work-log.md / 망고티 5단계 레시피와 레벨 3 데이터 흐름을 반영하고 URL 쿼리로 스테이지를 직접 시작하게 했다.
2026-11-25 / 스테이지 주문 구성 조정 / stageData.js, spec (1).md, tasks.md, prompt.txt, work-log.md / 사용자 의도에 따라 스테이지 2를 두 메뉴·두 손님으로 조정하고 스테이지 3의 세 메뉴 순환 구성을 명시했다.
