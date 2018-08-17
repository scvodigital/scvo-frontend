CALL _getSubscriptions(
  {{{mysqlEscape @root.data.auth.email}}}, 
  {{{mysqlEscape @root.context.metaData.emailCampaignName}}}, 
  NULL
);
