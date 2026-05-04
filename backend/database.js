const path = require('path');
const fs = require('fs');
const os = require('os');

let dbInstance = null;
let initSqlJsLib = null;

async function getInitSqlJs() {
  if (!initSqlJsLib) {
    initSqlJsLib = require('sql.js');
  }
  return initSqlJsLib;
}

// Wrapper class to provide an async-like API over sql.js synchronous DB
class DbWrapper {
  constructor(sqlDb) {
    this._db = sqlDb;
  }

  // Run a query (INSERT, UPDATE, DELETE)
  async run(sql, params = []) {
    this._db.run(sql, params);
    // Get last insert rowid
    const result = this._db.exec('SELECT last_insert_rowid() as id');
    const lastID = result.length > 0 ? result[0].values[0][0] : 0;
    // Get changes count
    const changesResult = this._db.exec('SELECT changes() as cnt');
    const changes = changesResult.length > 0 ? changesResult[0].values[0][0] : 0;
    persistDb();
    return { lastID, changes };
  }

  // Execute raw SQL (for schema creation etc.)
  async exec(sql) {
    this._db.run(sql);
    persistDb();
  }

  // Get a single row
  async get(sql, params = []) {
    const stmt = this._db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
      const columns = stmt.getColumnNames();
      const values = stmt.get();
      stmt.free();
      const row = {};
      columns.forEach((col, i) => {
        row[col] = values[i];
      });
      return row;
    }
    stmt.free();
    return undefined;
  }

  // Get all rows
  async all(sql, params = []) {
    const stmt = this._db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    while (stmt.step()) {
      const columns = stmt.getColumnNames();
      const values = stmt.get();
      const row = {};
      columns.forEach((col, i) => {
        row[col] = values[i];
      });
      rows.push(row);
    }
    stmt.free();
    return rows;
  }
}

function getDbPath() {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
  return isProd
    ? path.join(os.tmpdir(), 'applianceai.sqlite')
    : path.join(__dirname, '..', 'database.sqlite');
}

function persistDb() {
  if (!dbInstance) return;
  try {
    const data = dbInstance._db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(getDbPath(), buffer);
  } catch (err) {
    console.warn('Could not persist DB:', err.message);
  }
}

async function initDb() {
  if (dbInstance) return dbInstance;

  const initSqlJs = await getInitSqlJs();
  const SQL = await initSqlJs();

  const dbPath = getDbPath();
  console.log('Initializing DB at path:', dbPath);

  let rawDb;
  try {
    if (fs.existsSync(dbPath)) {
      const fileBuffer = fs.readFileSync(dbPath);
      rawDb = new SQL.Database(fileBuffer);
      console.log('Loaded existing database from disk');
    } else {
      rawDb = new SQL.Database();
      console.log('Created new in-memory database');
    }
  } catch (err) {
    console.warn('Could not load DB from disk, creating fresh:', err.message);
    rawDb = new SQL.Database();
  }

  // Create tables
  rawDb.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  rawDb.run(`
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
    )
  `);

  rawDb.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      appliance_name TEXT,
      brand TEXT,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, appliance_name),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('DB schema setup complete');

  // Persist initial state
  try {
    const data = rawDb.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (err) {
    console.warn('Could not persist DB to disk:', err.message);
  }

  dbInstance = new DbWrapper(rawDb);
  return dbInstance;
}

async function getDb() {
  if (!dbInstance) {
    await initDb();
  }
  return dbInstance;
}

module.exports = { initDb, getDb };
