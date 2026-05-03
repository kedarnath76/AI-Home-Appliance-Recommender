const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const os = require('os');

let dbPromise = null;

async function initDb() {
  if (!dbPromise) {
    const isProd = process.env.NODE_ENV === 'production';
    const dbPath = isProd 
      ? path.join(os.tmpdir(), 'database.sqlite')
      : path.join(__dirname, 'database.sqlite');

    console.log('Initializing DB at path:', dbPath);
    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then(async (db) => {
      console.log('DB Connection successful, running schema setup...');
      await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          category TEXT,
          budget INTEGER,
          room_size TEXT,
          energy_pref TEXT,
          brand_pref TEXT,
          usage_pattern TEXT,
          city TEXT,
          recommendations TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS wishlist (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          appliance_name TEXT,
          brand TEXT,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, appliance_name),
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

async function getDb() {
  if (!dbPromise) {
    await initDb();
  }
  return dbPromise;
}

module.exports = { initDb, getDb };
