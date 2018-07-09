INSERT INTO subscriptions (campaign, email, name) VALUES ('fundingscotland-saved-searches', '{{data.auth.email}}', '{{default request.params.query.name "My Search"}}')
  ON DUPLICATE KEY UPDATE name = '{{default request.params.query.name "My Search"}}';
