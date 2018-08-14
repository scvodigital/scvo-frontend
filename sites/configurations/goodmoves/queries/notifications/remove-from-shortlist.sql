CALL _removeSubscriptionParameter(
  '{{@root.data.auth.email}}', 
  '{{@root.context.metaData.shortlistCampaignName}}', 
  'Shortlist', 
  'id', 
  '{{@root.request.params.query.id}}'
);
