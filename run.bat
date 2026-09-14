@echo off
chcp 65001 >nul
set PGCLIENTENCODING=UTF8
psql -U postgres -f init-db.sql