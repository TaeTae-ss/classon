# project-Class:On

## 공통 규칙
| 구분           | 규칙                   | 예시                                |
| ------------ | -------------------- | --------------------------------- |
| 패키지          | 소문자                  | `reservation`                     |
| 클래스          | PascalCase           | `ReservationController`           |
| Entity       | Entity 접미사 사용 X      | `Reservation`                     |
| DTO          | Entity + DTO         | `ReservationDTO`                  |
| Mapper       | Entity + Mapper      | `ReservationMapper`               |
| Repository   | Entity + Repository  | `ReservationRepository`           |
| Service      | Entity + Service     | `ReservationService`              |
| ServiceImpl  | Entity + ServiceImpl | `ReservationServiceImpl`          |
| 등록           | `register`           | `registerReservation()`           |
| 단건 조회        | `getOne`             | `getOneReservation()`             |
| 목록 조회        | `getList`            | `getListReservation()`            |
| 수정           | `modify`             | `modifyReservation()`             |
| 삭제           | `remove`             | `removeReservation()`             |
| DTO → Entity | `toEntity`           | `toEntity()`                      |
| Entity → DTO | `toDTO`              | `toDTO()`                         |
| 변수           | camelCase            | `rsvNo`                           |
| DB 컬럼        | UPPER_SNAKE_CASE     | `RSV_NO`                          |
| 상수           | UPPER_SNAKE_CASE     | `DEFAULT_COUNT`                   |
| Enum         | UPPER_SNAKE_CASE     | `CONFIRMED`                       |
| API          | `/api/{entity}`      | `/api/reservation`                |
| 등록 API       | POST                 | `POST /api/reservation`           |
| 조회 API       | GET                  | `GET /api/reservation/{rsvNo}`    |
| 수정 API       | PUT                  | `PUT /api/reservation/{rsvNo}`    |
| 삭제 API       | DELETE               | `DELETE /api/reservation/{rsvNo}` |
| 날짜           | LocalDate            | `schDate`                         |
| 날짜+시간        | LocalDateTime        | `rsvCreatedAt`                    |
| Boolean      | is/has               | `isFavorite`                      |
| Git Branch   | feature/{기능}         | `feature/reservation`             |


## 브랜치 명명 규칙

### 이름 앞글자2개_뒤는 자유
ex)sg_user
<br> ts_reservation

서비스 네이밍 컨벤션
---

| 방식    | 메서드명     |
|-------|----------|
| 등록    | register |
| 단건 조회 | getOne   |
| 목록 조회 | getList  |
| 수정    | modify   |
| 삭제    | remove   |

ex)
---

| 방식    | 메서드명     |
|-------|----------|
| 등록    | registerReservation() |
| 단건 조회 | getReservation()   |
| 목록 조회 | getListReservation()  |
| 수정    | modifyReservation()   |
| 삭제    | removeReservation()   |