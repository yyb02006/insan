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

- **Version 0.2.0 (2024-01-04):**

  - **_/work_** 페이지에서 사용자들이 최신 업데이트된 비디오를 가장 위에서 확인할 수 있도록 비디오 정렬 방식을 오름차순에서 내림차순으로 변경
  - **_/work_** 페이지의 각 비디오의 타이틀 요소 중앙정렬로 변경
  - **_/about_** 페이지에서 일부 요소가 모바일 크기에서 화면 오른쪽으로 나가는 이슈 수정
  - Tag 버튼의 DOP라벨을 D.O.P라벨로 변경

- **Version 0.3.0 (2024-08-26):**

  - **_/work_** 로그인 - 로그아웃을 글로벌 메뉴 내의 버튼으로 처리할 수 있도록 기능 추가
  - **_/enter_** 인간다운 UI로 변경
  - **_/exit_** 글로벌 메뉴의 Logout 버튼으로 기능 대체
  - PC 환경에서 기존 스크롤 바를 대체하는 자체적인 스크롤 바 추가
  - pscale에서 vercel postgres로 DB 마이그레이션

- **Version 0.3.1 (2024-08-26):**

  - 확장 메뉴를 열었을 때 스크롤을 잠그고 스크롤 바 숨김
  - 확장 메뉴를 열었을 때 로고 버튼 숨김

- **Version 0.4.1 (2024-08-27):**

  - **_/work/write_, _/work/delete_** 버튼을 클릭해 리스트 방식의 레이아웃으로 스위칭 가능
