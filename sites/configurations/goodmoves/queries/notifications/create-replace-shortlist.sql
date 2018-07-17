INSERT INTO subscriptions (campaign, email, name, days, subscribed) 
VALUES ('{{context.metaData.shortlistCampaignName}}', '{{data.auth.email}}', '{{context.metaData.shortlistCampaignName}}', '1234567', 0) 
  ON DUPLICATE KEY UPDATE name = '{{context.metaData.shortlistCampaignName}}';
