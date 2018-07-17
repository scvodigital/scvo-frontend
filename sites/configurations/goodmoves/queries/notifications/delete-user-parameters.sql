DELETE FROM subscriptionParameters 
WHERE 
  email = '{{data.auth.email}}' AND
  campaign IN ('{{context.metaData.emailCampaignName}}', '{{context.metaData.shortlistCampaignName}}');
