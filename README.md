# 🏛️ Insan's Web Gallery - INSAN

## 📌 Project Overview

비디오 디렉터 **여인산**의 브랜드와 작업물을 전시한 웹입니다.

기존 유튜브, 비메오등의 웹에서 할 수 없었던 디렉터 개인에 대한 브랜딩과 인터렉티브한 애니메이션을 제공합니다.

## 🛠️ Tech Stack

- **Frontend:**

  - <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white"><img src="https://img.shields.io/badge/18.2.0-404040?style=for-the-badge">
  - <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"><img src="https://img.shields.io/badge/13.4.19-404040?style=for-the-badge">
  - <img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"><img src="https://img.shields.io/badge/5.0.4-404040?style=for-the-badge">
  - <img src="https://img.shields.io/badge/Tailwind CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"><img src="https://img.shields.io/badge/3.3.1-404040?style=for-the-badge">

- **Backend / Database:**
  - <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"><img src="https://img.shields.io/badge/5.2.0-404040?style=for-the-badge">
  - <img src="https://img.shields.io/badge/Pscale-000000?style=for-the-badge&logo=planetscale&logoColor=white"><img src="https://img.shields.io/badge/0.154.0-404040?style=for-the-badge">

## 🌐 Hosted URL

이 프로젝트는 <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">을 통해 호스팅되었습니다.

**_Link_** : **[Insan Web Link](https://1nsan.com)**

## 📁 Project Structure

```
 ┃
 ┣━━ 📂components
 ┣━━ 📂fonts
 ┣━━ 📂libs
 ┃   ┣━━ 📂client
 ┃   ┃   ┣━━ 📜useDelete.ts
 ┃   ┃   ┣━━ 📜useInfiniteScroll.ts
 ┃   ┃   ┃  .
 ┃   ┃   ┃  .
 ┃   ┃   ┃  .
 ┃   ┃   ┗ 📜utils.ts
 ┃   ┗ 📂server
 ┃       ┣━━ 📜client.ts
 ┃       ┣━━ 📜withHandler.ts
 ┃       ┗━━ 📜withSession.ts
 ┣━━ 📂pages
 ┃   ┣━━ 📂api
 ┃   ┃   ┣━━ 📂work
 ┃   ┃   ┃   ┣━━ 📜index.ts
 ┃   ┃   ┃   ┣━━ 📜list.ts
 ┃   ┃   ┃   ┣━━ 📜own.ts
 ┃   ┃   ┃   ┗━━ 📜write.ts
 ┃   ┃   ┣━━ 📜admin.ts
 ┃   ┃   ┗━━ 📜email.ts
 ┃   ┣━━ 📂work
 ┃   ┃   ┣━━ 📜delete.tsx
 ┃   ┃   ┣━━ 📜index.tsx
 ┃   ┃   ┗━━ 📜write.tsx
 ┃   ┣━━ 📜403.tsx
 ┃   ┣━━ 📜404.tsx
 ┃   ┣━━ 📜about.tsx
 ┃   ┣━━ 📜contact.tsx
 ┃   ┣━━ 📜enter.tsx
 ┃   ┣━━ 📜exit.tsx
 ┃   ┣━━ 📜index.tsx
 ┃   ┣━━ 📜_app.tsx
 ┃   ┗━━ 📜_document.tsx
 ┣━━ 📂styles
 ┗━━ 📜middleware.ts
```

## 💡 Key Features

사용자의 추가적인 업로드없이 YouTube, Vimeo API로부터 영상들을 받아와

타 플랫폼에 퍼져있는 자신의 영상물들을 한 페이지에서 전시하고, 관리할 수 있습니다.

작업물의 세부페이지에는 각 플랫폼으로의 링크가 있으며, 각 링크는 디렉터의 작품들로 연결됩니다.

인스타그램, 메일 등을 통해 디렉터와 직접연락할 수 있는 수단을 제공합니다.

그리고 화려한 애니메이션은 덤이랄까?

## 🔒 License

This project is licensed under the MIT License

## 📅 Version History

- **Version 0.1.0 (2023-08-26):**

  - **_Initial Release_** 이제 사용자가 [**링크**](https://www.1nsan.com)로 서비스에 접근 가능

  ***

- **Version 0.2.0 (2024-01-04):**

  - **_/work_** 페이지에서 사용자들이 최신 업데이트된 비디오를 가장 위에서 확인할 수 있도록 비디오 정렬 방식을 오름차순에서 내림차순으로 변경
  - **_/work_** 페이지의 각 비디오의 타이틀 요소 중앙정렬로 변경
  - **_/about_** 페이지에서 일부 요소가 모바일 크기에서 화면 오른쪽으로 나가는 이슈 수정
  - Tag 버튼의 DOP라벨을 D.O.P라벨로 변경

  ***

- **Version 0.3.0 (2024-08-26):**

  - **_/work_** 로그인 - 로그아웃을 글로벌 메뉴 내의 버튼으로 처리할 수 있도록 기능 추가
  - **_/enter_** 인간다운 UI로 변경
  - **_/exit_** 글로벌 메뉴의 Logout 버튼으로 기능 대체
  - PC 환경에서 기존 스크롤 바를 대체하는 자체적인 스크롤 바 추가
  - pscale에서 vercel postgres로 DB 마이그레이션

  ***

- **Version 0.3.1 (2024-08-26):**

  - 확장 메뉴를 열었을 때 스크롤을 잠그고 스크롤 바 숨김
  - 확장 메뉴를 열었을 때 로고 버튼 숨김

  ***

- **Version 0.4.1 (2024-08-27):**

  - **_/work/write_, _/work/delete_** 버튼을 클릭해 리스트 방식의 레이아웃으로 스위칭 가능

  ***

- **Version 0.4.2 (2024-08-28):**

  - 모바일 기종 인식 정규식 개선

  ***

- **Version 0.4.3 (2024-09-02):**

  - **_/work_** 같은 영상이 중복으로 렌더링 되는 버그 수정

  ***

- **Version 0.5.0 (2024-09-14):**

  - **_/work/write_, _/work/delete_**

    **추가**

    - Film / Short 카테고리 각 동영상 카드에 gif 썸네일의 유무를 알리는 Thumb 뱃지 추가
    - 추가하기 페이지에서도 클릭으로 동영상을 등록할 수 있도록 기능 추가

    **수정**

    - 카테고리 버튼의 반복적인 클릭이 현재 리스트를 초기화하지 않도록 수정
    - 현재 등록된 리스트를 확인할 수 있는 버튼의 라벨을 Videos로 수정
    - 제목이 없는 비디오도 리스트에 등록될 수 있도록 수정
    - 등록된 비디오 목록을 다시 클릭하여 원래의 보기로 돌아올 때, 등록된 비디오의 갯수가 0개이면 작동하지 않는 버그 수정

  ***

- **Version 0.5.1 (2024-09-15):**

  - 로그인된 상태에서 확장메뉴 Admin 버튼 클릭 시 로그인 페이지로 리다이렉트되던 버그 수정

  ***

- **Version 0.5.2 (2024-09-18):**

  - 로그인 / 로그아웃 후 로딩 중에 사용자가 백그라운드 오버레이 뒤의 영역을 클릭할 수 없도록 수정

  ***

- **Version 0.6.0 (2024-09-20):**

  - **_/work_, _/work/write_, _/work/delete_, _/enter_** 로그인 / 로그아웃, 비디오 등록 / 삭제 기능 수행시 응답 속도 개선
  - **_/work/write_**
    - Animated Thumbnail 뱃지의 라벨 수정 Thumb => Gif
    - list view 스위칭 시 스크롤로 데이터 불러오기가 안 되던 이슈 수정
  - **_/work/delete_** 비디오들이 내림차순으로 정렬되도록 수정
  - outsource 비디오 등록 시 film카테고리로 저장되던 이슈 수정

  ***

- **Version 0.6.01 (2024-09-20):**

  - **_/enter_** 로그인 성공 후 리다이렉트가 완료될 때 까지 보이는 로딩 인디케이터 추가
  - **_/enter_** 로그인 성공 시 메세지 한글로 변경

  ***

- **Version 0.7.0 (2024-10-17):**

  - **_/work/sort_** sort페이지 추가, 정렬 순서를 직접 입력하거나, 드래그앤 드롭으로 수정 가능
  - **_/work/write_, _/work/delete_, _/work/sort_** 관리자 페이지 간의 이동 방법을 로컬 네비게이션으로 변경, 네비게이션 내에 로그아웃 기능 추가
  - **_/work_** 이제 작업물들이 sort페이지에서 수정한 정렬 순서의 역순으로 표시됨
