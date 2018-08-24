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
    {{#compare event "failed"~}}
      {{{stringify (concat "failed-" severity)}}}
    {{else}}
      {{{stringify event}}}
    {{~/compare}}, -- event
    {{{stringify log-level}}}, -- logLevel
    {{#compare event "delivered"~}}
      {{{stringify storage.url}}}
    {{else}}
      {{~#compare event "failed"~}}
        {{{stringify delivery-status.code}}}
      {{else}}
        {{~#compare event "clicked"~}}
          {{{stringify url}}}
        {{else}}
          ''
        {{~/compare~}}
      {{~/compare~}}
    {{~/compare}}, -- other
  {{~/with}}
  {{~#with @root.request.body.signature~}}
    {{{stringify timestamp}}}, -- timestamp
    {{{stringify token}}}, -- token
    {{{stringify signature}}} -- signature
  {{~/with}}
);
{{else}}
SET @query=false;
{{/if}}
