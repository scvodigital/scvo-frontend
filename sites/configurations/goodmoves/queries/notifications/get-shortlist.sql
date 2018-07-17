SELECT `value` AS id 
FROM subscriptionParameters  
WHERE 
  email = '{{data.auth.email}}' AND
  campaign = '{{context.metaData.shortlistCampaignName}}' AND
  `parameter` = 'id';
