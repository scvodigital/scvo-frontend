/*
  {{{stringify @root.request.body}}}
*/
{{#if @root.request.body.event-data}}
CALL _log(
  {{~#with @root.request.body.event-data}}
    {{{stringify id}}}, -- uid
    {{{stringify message.headers.message-id}}}, -- messageId
    {{{stringify tags.[0]}}}, -- campaign
    {{{stringify recipient}}}, -- email
    {{#compare event "failed"}}
      {{{stringify (concat "failed-" severity)}}}
    {{else}}
      {{{stringify event}}}
    {{/compare}}, -- event
    {{{stringify (default log-level "none")}}}, -- logLevel
    {{#compare event "delivered"~}}
      {{{stringify (default storage.url "")}}}
    {{else}}
      {{#compare event "failed"~}}
        {{{stringify (default delivery-status.code 999)}}}
      {{else}}
        {{#compare event "clicked"~}}
          {{{stringify (default url "https://url.not/found-in?data=from#webhook")}}}
        {{else}}
          ''
        {{/compare}}
      {{/compare}}
    {{/compare}}, -- other
  {{/with}}
  {{#with @root.request.body.signature~}}
    {{{stringify timestamp}}}, -- timestamp
    {{{stringify token}}}, -- token
    {{{stringify signature}}} -- signature
  {{/with}}
);
{{else}}
SET @query=false;
{{/if}}
