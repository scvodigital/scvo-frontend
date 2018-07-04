INSERT INTO recipients (email, name) VALUES ('{{data.auth.email}}', '{{data.auth.email}}') 
  ON DUPLICATE KEY UPDATE name = '{{data.auth.email}}';
