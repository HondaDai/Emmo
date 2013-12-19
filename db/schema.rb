# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20131219182308) do

  create_table "friendships", force: true do |t|
    t.integer  "user_id"
    t.integer  "friend_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "friendships", ["user_id", "friend_id"], name: "index_friendships_on_user_id_and_friend_id", unique: true

  create_table "records", force: true do |t|
    t.datetime "time"
    t.text     "note"
    t.decimal  "money"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "owner_id"
    t.integer  "payer_id"
    t.integer  "recorder_id"
    t.integer  "tag"
  end

  add_index "records", ["owner_id", "money"], name: "index_records_on_owner_id_and_money", unique: true
  add_index "records", ["owner_id", "payer_id"], name: "index_records_on_owner_id_and_payer_id", unique: true
  add_index "records", ["owner_id", "recorder_id"], name: "index_records_on_owner_id_and_recorder_id", unique: true
  add_index "records", ["owner_id", "time"], name: "index_records_on_owner_id_and_time", unique: true

  create_table "users", force: true do |t|
    t.string   "name"
    t.string   "email"
    t.string   "password_digest"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "remember_token"
    t.integer  "friend_id"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["remember_token"], name: "index_users_on_remember_token"

end
