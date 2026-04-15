CREATE TYPE "user_role" AS ENUM (
  'USER',
  'TEACHER',
  'ADMIN'
);

CREATE TYPE "classroom_status" AS ENUM (
  'OPEN',
  'CLOSED',
  'ARCHIVED'
);

CREATE TYPE "question_type" AS ENUM (
  'MULTIPLE_CHOICE',
  'SHORT_ANSWER',
  'FILL_IN_BLANK'
);

CREATE TYPE "attendance_status" AS ENUM (
  'PRESENT',
  'ABSENT',
  'EXCUSED_ABSENT',
  'LATE'
);

CREATE TYPE "test_status" AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'ENDED'
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "google_id" text UNIQUE,
  "email" varchar UNIQUE NOT NULL,
  "name" varchar NOT NULL,
  "avatar_url" text,
  "role" user_role NOT NULL DEFAULT 'USER',
  "is_active" boolean DEFAULT true,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "classrooms" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "teacher_id" uuid NOT NULL,
  "name" varchar NOT NULL,
  "status" classroom_status NOT NULL DEFAULT 'OPEN',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "enrollments" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "student_id" uuid NOT NULL,
  "classroom_id" uuid NOT NULL,
  "enrolled_at" timestamp DEFAULT now()
);

CREATE TABLE "class_periods" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "classroom_id" uuid NOT NULL,
  "start_at" timestamp,
  "end_at" timestamp,
  "lesson_content" text,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "attendance_record" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "period_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "status" attendance_status NOT NULL DEFAULT 'PRESENT',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "posts" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "classroom_id" uuid NOT NULL,
  "author_id" uuid NOT NULL,
  "content" text NOT NULL,
  "pin_order" int,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "comments" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "post_id" uuid NOT NULL,
  "author_id" uuid NOT NULL,
  "parent_comment_id" uuid,
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "question_folders" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "name" varchar NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "questions" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "type" question_type NOT NULL,
  "prompt" text NOT NULL,
  "options" JSONB NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "folder_questions" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "folder_id" uuid NOT NULL,
  "question_id" uuid NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE "tests" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "classroom_id" uuid NOT NULL,
  "title" varchar NOT NULL,
  "description" text,
  "start_at" timestamp NOT NULL,
  "deadline" timestamp NOT NULL,
  "duration_minutes" int NOT NULL,
  "status" test_status NOT NULL DEFAULT 'DRAFT',
  "published_at" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "test_questions" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "question_id" uuid NOT NULL,
  "test_id" uuid NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE "test_question_snapshots" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "test_id" uuid NOT NULL,
  "question_data" JSONB NOT NULL
);

CREATE TABLE "test_attempts" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "test_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "started_at" timestamp NOT NULL DEFAULT now(),
  "submitted_at" timestamp,
  "score" decimal,
  "feedback" JSONB
);

CREATE TABLE "submission_record" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "attempt_id" uuid NOT NULL,
  "question_id" uuid NOT NULL,
  "choice" int,
  "is_correct" boolean,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE "saved_words" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "user_id" uuid NOT NULL,
  "word_id" uuid NOT NULL,
  "mastery_level" int DEFAULT 1,
  "next_review_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "flash_card_decks" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "user_id" uuid NOT NULL,
  "title" varchar NOT NULL DEFAULT 'Deck',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "deck_words" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "deck_id" uuid NOT NULL,
  "saved_word_id" uuid NOT NULL,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE "english_dictionary" (
  "id" uuid PRIMARY KEY DEFAULT uuidv7(),
  "word" varchar NOT NULL,
  "data" JSONB NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE INDEX ON "users" ("email");

CREATE INDEX ON "users" ("google_id");

CREATE UNIQUE INDEX ON "enrollments" ("student_id", "classroom_id");

CREATE INDEX ON "class_periods" ("classroom_id");

CREATE INDEX ON "attendance_record" ("period_id");

CREATE INDEX ON "posts" ("classroom_id");

CREATE INDEX ON "comments" ("post_id");

CREATE INDEX ON "folder_questions" ("folder_id");

CREATE INDEX ON "tests" ("classroom_id", "status");

CREATE INDEX ON "test_question_snapshots" ("test_id");

CREATE UNIQUE INDEX ON "test_attempts" ("test_id", "student_id");

CREATE INDEX ON "saved_words" ("user_id", "next_review_at");

CREATE UNIQUE INDEX ON "saved_words" ("user_id", "word_id");

CREATE UNIQUE INDEX ON "english_dictionary" ("word");

ALTER TABLE "classrooms" ADD FOREIGN KEY ("teacher_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "enrollments" ADD FOREIGN KEY ("student_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "enrollments" ADD FOREIGN KEY ("classroom_id") REFERENCES "classrooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "class_periods" ADD FOREIGN KEY ("classroom_id") REFERENCES "classrooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "attendance_record" ADD FOREIGN KEY ("period_id") REFERENCES "class_periods" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "attendance_record" ADD FOREIGN KEY ("student_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "posts" ADD FOREIGN KEY ("classroom_id") REFERENCES "classrooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "posts" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comments" ADD FOREIGN KEY ("post_id") REFERENCES "posts" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comments" ADD FOREIGN KEY ("author_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "comments" ADD FOREIGN KEY ("parent_comment_id") REFERENCES "comments" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "folder_questions" ADD FOREIGN KEY ("folder_id") REFERENCES "question_folders" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "folder_questions" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "tests" ADD FOREIGN KEY ("classroom_id") REFERENCES "classrooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_questions" ADD FOREIGN KEY ("question_id") REFERENCES "questions" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_questions" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_question_snapshots" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_attempts" ADD FOREIGN KEY ("test_id") REFERENCES "tests" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "test_attempts" ADD FOREIGN KEY ("student_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "submission_record" ADD FOREIGN KEY ("attempt_id") REFERENCES "test_attempts" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "submission_record" ADD FOREIGN KEY ("question_id") REFERENCES "test_question_snapshots" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "saved_words" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "saved_words" ADD FOREIGN KEY ("word_id") REFERENCES "english_dictionary" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "flash_card_decks" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "deck_words" ADD FOREIGN KEY ("deck_id") REFERENCES "flash_card_decks" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "deck_words" ADD FOREIGN KEY ("saved_word_id") REFERENCES "saved_words" ("id") ON DELETE CASCADE DEFERRABLE INITIALLY IMMEDIATE;
