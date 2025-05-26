-- Purpose: Create tables for tracking user's collection interests
-- Date: 2025-05-26

-- Create user_colls table to track which collections a user is active in
CREATE TABLE user_colls (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, collection_id)
);

-- Create user_coll_items table to track individual items a user wants or is offering
CREATE TABLE user_coll_items (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES collection_items(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('WANT', 'OFFERING')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, item_id, type)
);

-- Create indexes for better query performance
CREATE INDEX idx_user_colls_user_id ON user_colls(user_id);
CREATE INDEX idx_user_colls_collection_id ON user_colls(collection_id);
CREATE INDEX idx_user_coll_items_user_id ON user_coll_items(user_id);
CREATE INDEX idx_user_coll_items_item_id ON user_coll_items(item_id);
CREATE INDEX idx_user_coll_items_type ON user_coll_items(type);

-- Function to automatically maintain user_colls entries when items are added
CREATE OR REPLACE FUNCTION sync_user_colls() RETURNS TRIGGER AS $$
BEGIN
    -- When a user adds an item (want or offering), ensure they are marked as active in that collection
    INSERT INTO user_colls (user_id, collection_id)
    SELECT DISTINCT 
        NEW.user_id,
        ci.collection_id
    FROM collection_items ci
    WHERE ci.id = NEW.item_id
    ON CONFLICT (user_id, collection_id) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to keep user_colls in sync when items are added
CREATE TRIGGER sync_user_colls_on_item_insert
    AFTER INSERT ON user_coll_items
    FOR EACH ROW
    EXECUTE FUNCTION sync_user_colls();
