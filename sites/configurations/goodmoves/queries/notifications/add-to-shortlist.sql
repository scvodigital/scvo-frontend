CALL _addSubscriptionParameter(
  {{{mysqlEscape @root.data.auth.email}}}, 
  {{{mysqlEscape @root.context.metaData.shortlistCampaignName}}}, 
  {{{mysqlEscape id}}}, 
  {{{mysqlEscape @root.request.params.query.id}}},
  'Shortlist',
  NULL
);
