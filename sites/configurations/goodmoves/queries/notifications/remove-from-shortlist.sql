DELETE FROM subscriptionParameters
WHERE
  campaign = '{{@root.context.metaData.shortlistCampaignName}}' AND
  email = '{{@root.data.auth.email}}' AND 
  name = '{{@root.context.metaData.shortlistCampaignName}}' AND 
  value = '{{@root.request.params.query.id}}';

