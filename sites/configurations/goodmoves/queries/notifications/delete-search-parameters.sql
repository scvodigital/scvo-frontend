DELETE FROM subscriptionParameters
WHERE 
  campaign = '{{@root.context.metaData.emailCampaignName}}' AND
  email = '{{@root.data.auth.email}}' AND
  name = '{{{@root.request.body.name}}}';
