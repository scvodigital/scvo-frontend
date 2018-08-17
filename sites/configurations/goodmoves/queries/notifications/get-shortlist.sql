CALL _getSubscriptionParameters(
  {{{mysqlEscape @root.data.auth.email}}}, 
  {{{mysqlEscape @root.context.metaData.shortlistCampaignName}}}, 
  'Shortlist'
);
