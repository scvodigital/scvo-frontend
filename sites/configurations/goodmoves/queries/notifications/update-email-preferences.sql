{{#if @root.data.auth ~}}
CALL _setSubscriptionDays(
  {{{mysqlEscape @root.data.auth.email}}},
  {{{mysqlEscape @root.context.metaData.emailCampaignName}}},
  '
    {{~#if @root.request.body.sunday}}1{{/if~}}
    {{~#if @root.request.body.monday}}2{{/if~}}
    {{~#if @root.request.body.tuesday}}3{{/if~}}
    {{~#if @root.request.body.wednesday}}4{{/if~}}
    {{~#if @root.request.body.thursday}}5{{/if~}}
    {{~#if @root.request.body.friday}}6{{/if~}}
    {{~#if @root.request.body.saturday}}7{{/if~}}
  '
);
{{else}}
SET @query=false;
{{/if ~}}