UPDATE subscriptions
SET subscribed = CASE WHEN subscribed = 1 THEN 0 ELSE 1 END
WHERE
  campaign = '{{@root.context.metaData.shortlistCampaignName}}' AND
  email = '{{@root.data.auth.email}}' AND
  name = '{{{@root.context.metaData.shortlistCampaignName}}}';