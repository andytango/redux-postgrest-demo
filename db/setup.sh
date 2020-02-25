#!/usr/bin/env bash

psql postgres://postgres:secret@localhost:5432/postgres --file ./db/ddl.sql