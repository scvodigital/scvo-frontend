CALL _toggleSubscriptionActiveState(
  {{{mysqlEscape @root.data.auth.email}}}, 
  {{{mysqlEscape @root.context.metaData.emailCampaignName}}}, 
  {{{mysqlEscape @root.request.body.name}}}
);
