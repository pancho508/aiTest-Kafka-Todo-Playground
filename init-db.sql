-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY,
  correlation_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on correlation_id for faster lookups
CREATE INDEX idx_todos_correlation_id ON todos(correlation_id);

-- Create index on created_at for time-based queries
CREATE INDEX idx_todos_created_at ON todos(created_at);
