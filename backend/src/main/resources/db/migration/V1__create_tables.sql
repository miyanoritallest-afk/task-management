CREATE TABLE boards (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE columns (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id    UUID        NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name        VARCHAR(50) NOT NULL,
    position    INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE cards (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    column_id   UUID         NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
    title       VARCHAR(100) NOT NULL,
    description TEXT,
    due_date    DATE,
    priority    VARCHAR(10)  NOT NULL DEFAULT 'none'
                    CHECK (priority IN ('high', 'medium', 'low', 'none')),
    color       VARCHAR(20),
    position    INTEGER      NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_columns_board_id ON columns(board_id);
CREATE INDEX idx_columns_position ON columns(board_id, position);
CREATE INDEX idx_cards_column_id  ON cards(column_id);
CREATE INDEX idx_cards_position   ON cards(column_id, position);
