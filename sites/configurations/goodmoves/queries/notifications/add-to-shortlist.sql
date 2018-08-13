CALL _addSubscriptionParameter(
  '{{@root.data.auth.email}}', 
  '{{@root.context.metaData.shortlistCampaignName}}', 
  'id', 
  '{{@root.request.params.query.id}}',
  'Shortlist',
  NULL
);
