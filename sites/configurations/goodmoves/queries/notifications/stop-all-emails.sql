UPDATE subscriptions
SET active = 0
WHERE 
  campaign IN ('{{@root.context.metaData.emailCampaignName}}', '{{@root.context.metaData.shortlistCampaignName}}') AND
  email = '{{@root.data.auth.email}}';

