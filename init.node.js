const Database = require('better-sqlite3')

const DB_FILE = 'db/ocr_results.sqlite'

const db = new Database(DB_FILE, { verbose: console.log })

db.exec(`
  CREATE TABLE "authors" (
    "id"	INTEGER NOT NULL,
    "name"	TEXT NOT NULL UNIQUE,
    "birth_date"	TEXT,
    "death_date"	TEXT,
    PRIMARY KEY("id" AUTOINCREMENT)
  );

  CREATE TABLE "journals" (
    "id"	TEXT NOT NULL,
    "start_date"	TEXT,
    "end_date"	TEXT,
    "author_id"	INTEGER,
    PRIMARY KEY("id")
  );

  CREATE TABLE "pages" (
    "id"	INTEGER NOT NULL,
    "journal_id"	TEXT NOT NULL,
    "text"	TEXT,
    "start_date"	TEXT,
    "end_date"	TEXT,
    "locked"	INTEGER DEFAULT 0,
    "completed"	INTEGER DEFAULT 0,
    PRIMARY KEY("id","journal_id")
  );

  CREATE TABLE "results" (
    "id"	INTEGER,
    "journal_id"	TEXT NOT NULL,
    "image"	TEXT NOT NULL,
    "model_name"	TEXT NOT NULL,
    "json_response"	TEXT DEFAULT '{}',
    "input_tokens"	INTEGER DEFAULT 0,
    "output_tokens"	INTEGER DEFAULT 0,
    "thought_tokens"	INTEGER DEFAULT 0,
    "text"	TEXT NOT NULL,
    "created_at"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY("id" AUTOINCREMENT),
    UNIQUE("journal_id","image","model_name")
  )
`)

db.close()