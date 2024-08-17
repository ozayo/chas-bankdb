import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise"; // MySQL2 modülünü dahil ediyoruz.

const app = express();
const PORT = 3001;

let db;

// Veritabanı bağlantısını asenkron olarak kurmak için bir fonksiyon tanımlıyoruz.
async function initializeDatabaseConnection() {
    db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bank",
        port: 8889
    });

    // Tabloları oluştur
    await db.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS accounts (
            id INT PRIMARY KEY AUTO_INCREMENT,
            userId INT,
            amount DECIMAL(10, 2),
            FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);

    await db.execute(`
        CREATE TABLE IF NOT EXISTS sessions (
            userId INT,
            token VARCHAR(6) NOT NULL,
            active BOOLEAN,
            FOREIGN KEY (userId) REFERENCES users(id)
        )
    `);
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize the database connection
initializeDatabaseConnection().then(() => {
    // Kullanıcı ekleme (kayıt) rotası
    app.post("/users", async (req, res) => {
        const { createUsername, createPassword } = req.body;

        // Şifre geçerlilik kontrolü
        const validPassword = /(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+/.test(createPassword);

        // Kullanıcı adının mevcut olup olmadığını kontrol et
        const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [createUsername]);

        if (rows.length === 0 && validPassword) {
            const newUserId = Math.floor(Math.random() * 1000000);
            await db.execute("INSERT INTO users (id, username, password) VALUES (?, ?, ?)", [newUserId, createUsername, createPassword]);
            await db.execute("INSERT INTO accounts (userId, amount) VALUES (?, ?)", [newUserId, 0]);
            res.status(201).send("User created");
        } else if (rows.length > 0) {
            res.status(409).send("Username already in use");
        } else {
            res.status(400).send("Password must contain at least one uppercase letter, one number, and one symbol");
        }
    });

    // Kullanıcı giriş (login) rotası
    app.post("/sessions", async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await db.execute("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);

    if (rows.length > 0) {
        const user = rows[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Mevcut aktif oturumları pasif hale getirme
        await db.execute("UPDATE sessions SET active = false WHERE userId = ? AND active = true", [user.id]);

        // Yeni oturum oluşturma
        await db.execute("INSERT INTO sessions (userId, token, active) VALUES (?, ?, ?)", [user.id, otp, true]);

        res.status(200).json({ userId: user.id, token: otp });
    } else {
        res.status(401).send("Wrong username or password");
    }
});

    // Hesap bakiyesi görüntüleme rotası
    app.post("/me/accounts", async (req, res) => {
        const { token } = req.body;

        const [sessionRows] = await db.execute("SELECT * FROM sessions WHERE token = ? AND active = true", [token]);
        if (sessionRows.length > 0) {
            const session = sessionRows[0];
            const [accountRows] = await db.execute("SELECT * FROM accounts WHERE userId = ?", [session.userId]);
            if (accountRows.length > 0) {
                res.status(200).json({ amount: accountRows[0].amount });
            } else {
                res.status(404).send("Account not found");
            }
        } else {
            res.status(404).send("Session not found");
        }
    });

    // Para yatırma rotası
    app.post("/me/accounts/transactions/deposit", async (req, res) => {
    const { token, amount } = req.body;
    const numericAmount = parseFloat(amount);

    const [sessionRows] = await db.execute("SELECT * FROM sessions WHERE token = ? AND active = true", [token]);
    if (sessionRows.length > 0) {
        const session = sessionRows[0];
        const [accountRows] = await db.execute("SELECT * FROM accounts WHERE userId = ?", [session.userId]);
        if (accountRows.length > 0) {
            const newAmount = parseFloat(accountRows[0].amount) + numericAmount;
            await db.execute("UPDATE accounts SET amount = ? WHERE userId = ?", [newAmount.toFixed(2), session.userId]);
            res.status(200).send(newAmount.toFixed(2).toString());
        } else {
            res.status(404).send("Account not found");
        }
    } else {
        res.status(404).send("Session not found");
    }
});

    // Para çekme rotası
    app.post("/me/accounts/transactions/withdraw", async (req, res) => {
    const { token, amount } = req.body;
    const numericAmount = parseFloat(amount);

    const [sessionRows] = await db.execute("SELECT * FROM sessions WHERE token = ? AND active = true", [token]);
    if (sessionRows.length > 0) {
        const session = sessionRows[0];
        const [accountRows] = await db.execute("SELECT * FROM accounts WHERE userId = ?", [session.userId]);
        if (accountRows.length > 0) {
            const currentAmount = parseFloat(accountRows[0].amount);
            if (currentAmount >= numericAmount) {
                const newAmount = currentAmount - numericAmount;
                await db.execute("UPDATE accounts SET amount = ? WHERE userId = ?", [newAmount.toFixed(2), session.userId]);
                res.status(200).send(newAmount.toFixed(2).toString());
            } else {
                res.status(400).send("Insufficient balance");
            }
        } else {
            res.status(404).send("Account not found");
        }
    } else {
        res.status(404).send("Session not found");
    }
});

    // Server'ı başlat
    app.listen(PORT, () => {
        console.log("Started backend on port", PORT);
    });
}).catch((err) => {
    console.error("Veritabanı bağlantısı kurulamadı:", err);
});
