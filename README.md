### 🎬 Cinema MERN App with MySQL

- **Backend**: Node.js + Express, Sequelize MySQL, JWT, bcrypt, RBAC (Role-Based Access Control), Joi, pagination/sorting
- **Frontend**: React (Vite + React Router), pages: Home, Login, Register, Movies, Movie Details + Reservations, My Reservations, Admin panel
- **Database**: XAMPP MySQL on 3306, root user without password

### Structure

```bash
server/
  src/
    config/        # env + db (Sequelize)
    middleware/    # auth (JWT), role (RBAC), validate (Joi)
    models/        # Sequelize models (timestamps + underscored)
    controllers/   # business logic
    routes/        # Express routes (auth, movies, halls, screenings, reservations)
    server.js
  sql/
    schema.sql     # table creation (quoted reserved words npr. halls.`rows`)
    seed.sql       # initial data (filmovi, sale, projekcije)
  .env             # see example below

client/
  src/
    api.js                 # axios instance with Authorization header
    pages/
      Home.jsx
      Login.jsx
      Register.jsx
      Movies.jsx
      MovieDetails.jsx     # screening selection + seat map + reservation
      MyReservations.jsx   # logged-in user's reservations
      Admin.jsx            # tabs: Movies, Halls, Screenings
      AdminMovies.jsx
      AdminHalls.jsx
      AdminScreenings.jsx
    main.jsx               # routes + Protected wrapper
```


### Setup

#### 1) Database (XAMPP / phpMyAdmin)
1. Start MySQL in XAMPP (port 3306)
2. In phpMyAdmin, create the database `bioskop_db`
3. Import in order:
   - `server/sql/schema.sql`
   - `server/sql/seed.sql`

**Admin account** is automatically created when the backend starts:  
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

### Quick Test

1. Log in as **admin**: `admin@admin.com / admin123`.  
2. Open **/admin**:
   - Movies: add/edit/delete movie
   - Halls: add hall
   - Screenings: create screening
3. Open **/movies** → movie → select screening → click seats → Reserve  
4. Open **/reservations** – you should see your reservation


### API Routes (with Roles)

### Auth
- `POST /api/auth/register` – `{ email, password }`
- `POST /api/auth/login` – `{ email, password }` → `{ token, user }`

### Movies (public list, admin CRUD)
- `GET /api/movies?page=&limit=&sort=&order=` – pagination + sort (`id|title|duration_min|rating|createdAt|updatedAt`)
- `GET /api/movies/:id`
- **ADMIN:** `POST /api/movies`, `PUT /api/movies/:id`, `DELETE /api/movies/:id`

### Halls (admin)
- `GET /api/halls` (list of all)  
- **ADMIN:** `POST /api/halls`, `PUT /api/halls/:id`, `DELETE /api/halls/:id`

### Screenings
- `GET /api/screenings?movie_id=` (if `movie_id` is not provided, returns all)  
- **ADMIN:** `POST /api/screenings`, `PUT /api/screenings/:id`, `DELETE /api/screenings/:id`

### Reservations (user)
- **USER:** `GET /api/reservations/mine`
- **USER:** `POST /api/reservations`  
  Body:
  ```json
  {
    "screening_id": 1,
    "seats": [ { "row_no": 3, "seat_no": 5 }, { "row_no": 3, "seat_no": 6 } ]
  }
  ```
  - If a seat is already taken, returns 409 and a list of problematic seats:
    ```json
    { "message":"Seats taken", "seats":[{"row_no":3,"seat_no":5}] }
    ```
