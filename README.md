### Bioskop MERN sa MySQL

- **Backend**: Node.js + Express, Sequelize MySQL, JWT, bcrypt, RBAC, Joi, paginacija/sort  
- **Frontend**: React (Vite + React Router), stranice: Home, Login, Register, Movies, Movie Details + rezervacije, My Reservations, Admin panel  
- **Baza**: XAMPP MySQL na 3306, root bez lozinke

### Struktura

```bash
server/
  src/
    config/        # env + db (Sequelize)
    middleware/    # auth (JWT), role (RBAC), validate (Joi)
    models/        # Sequelize modeli (timestamps + underscored)
    controllers/   # poslovna logika
    routes/        # Express rute (auth, movies, halls, screenings, reservations)
    server.js
  sql/
    schema.sql     # kreiranje tabela (quoted reserved words npr. halls.`rows`)
    seed.sql       # osnovni podaci (filmovi, sale, projekcije)
  .env             # vidi primer ispod

client/
  src/
    api.js                 # axios instance sa Authorization header-om
    pages/
      Home.jsx
      Login.jsx
      Register.jsx
      Movies.jsx
      MovieDetails.jsx     # izbor projekcije + mapa sedista + rezervacija
      MyReservations.jsx   # rezervacije ulogovanog korisnika
      Admin.jsx            # tabovi: Filmovi, Sale, Projekcije
      AdminMovies.jsx
      AdminHalls.jsx
      AdminScreenings.jsx
    main.jsx               # rute + Protected wrapper
```


### Setup

#### 1) Baza (XAMPP / phpMyAdmin)
1. Pokreni MySQL u XAMPP-u (port 3306)
2. U phpMyAdmin kreiraj bazu `bioskop_db`
3. Importuj redom:
   - `server/sql/schema.sql`
   - `server/sql/seed.sql`

**Admin nalog** se automatski kreira pri startu backend-a:  
**Email:** `admin@admin.com` &nbsp; **Lozinka:** `admin123`

#### 2) Backend
```bash
cd server
npm i
cp .env.example .env
npm run dev
```

### 3) Frontend
```bash
cd client
npm i
npm run dev
```

### Brzi test

1. Uloguj se kao **admin**: `admin@admin.com / admin123`.  
2. Otvori **/admin**:
   - Filmovi: dodaj/izmeni/obrisi film
   - Sale: dodaj salu
   - Projekcije: napravi projekciju
3. Otvori **/movies** → film → izaberi projekciju → klikni sedista → Rezervisi  
4. Otvori **/reservations** – trebalo bi da vidis svoju rezervaciju


### API rute (sa ulogama)

### Auth
- `POST /api/auth/register` – `{ email, password }`
- `POST /api/auth/login` – `{ email, password }` → `{ token, user }`

### Filmovi (public list, admin CRUD)
- `GET /api/movies?page=&limit=&sort=&order=` – paginacija + sort (`id|title|duration_min|rating|createdAt|updatedAt`)
- `GET /api/movies/:id`
- **ADMIN:** `POST /api/movies`, `PUT /api/movies/:id`, `DELETE /api/movies/:id`

### Sale (admin)
- `GET /api/halls` (lista svih)  
- **ADMIN:** `POST /api/halls`, `PUT /api/halls/:id`, `DELETE /api/halls/:id`

### Projekcije
- `GET /api/screenings?movie_id=` (ako `movie_id` nije prosledjen, vraca sve)  
- **ADMIN:** `POST /api/screenings`, `PUT /api/screenings/:id`, `DELETE /api/screenings/:id`

### Rezervacije (user)
- **USER:** `GET /api/reservations/mine`
- **USER:** `POST /api/reservations`  
  Body:
  ```json
  {
    "screening_id": 1,
    "seats": [ { "row_no": 3, "seat_no": 5 }, { "row_no": 3, "seat_no": 6 } ]
  }
  ```
  - Ako je neko sediste vec zauzeto, vraca 409 i listu problematicnih sedista:
    ```json
    { "message":"Seats taken", "seats":[{"row_no":3,"seat_no":5}] }
    ```
