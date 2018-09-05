{{#if @root.data.auth ~}}
CALL _addSubscriptionParameters(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.emailCampaignName}}},
  {{{mysqlEscape (
    querystringify (obj)
      keywords=@root.request.params.query.keywords
      salary_min=@root.request.params.query.salary_min
      salary_max=@root.request.params.query.salary_max
      regions=(sort @root.request.params.query.regions)
      roles=(sort @root.request.params.query.roles)
      sectors=(sort @root.request.params.query.sectors)
      working_patterns=(sort @root.request.params.query.working_patterns)
      distance=@root.request.params.query.distance
      lat=@root.request.params.query.lat
      lng=@root.request.params.query.lng
      location=@root.request.params.query.location
    )
  }}},
  {{{mysqlEscape @root.request.body.name}}},
  {{#if @root.request.body.subscribe}}1{{else}}0{{/if}}
);
{{else}}
SET @query=false;
{{/if ~}}