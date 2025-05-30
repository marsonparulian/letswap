-- Backup existing data
CREATE TABLE IF NOT EXISTS _producers_backup AS SELECT * FROM producers;
CREATE TABLE IF NOT EXISTS _collections_backup AS SELECT * FROM collections;
CREATE TABLE IF NOT EXISTS _collection_items_backup AS SELECT * FROM collection_items;
