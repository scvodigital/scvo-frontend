CALL _toggleSubscriptionActiveState(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.shortlistCampaignName}}}, 
  'Shortlist'
);
