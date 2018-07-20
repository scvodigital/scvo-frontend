SELECT 
  p.`value` AS id,
  s.subscribed
FROM 
  subscriptions s 
  JOIN subscriptionParameters p ON s.email = p.email AND s.campaign = p.campaign
WHERE 
  s.email = '{{data.auth.email}}' AND
  s.campaign = '{{context.metaData.shortlistCampaignName}}' AND
  p.`parameter` = 'id';
