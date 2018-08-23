/*
  {{{stringify @root.request.body}}}
*/
CALL _log(
  {{~#with @root.request.body.event-data}}
    {{{stringify id}}},
    {{{stringify message.headers.message-id}}},
    {{{stringify tags.[0]}}},
    {{{stringify recipient}}},
    {{#compare event "failed"~}}
      {{{stringify (concat "failed-" severity)}}},
    {{else}}
      {{{stringify event}}},
    {{/~compare}}
    {{{stringify log-level}}},
    {{#compare event "delivered"~}}
      {{{stringify storage.url}}}
    {{else}}
      {{~#compare event "failed"~}}
        {{{stringify delivery-status.code}}}
      {{else}}
        {{~#compare event "clicked"~}}
          {{{stringify url}}}
        {{~/compare~}}
      {{~/compare~}}
    {{~/compare}}
  {{~/with}}
  {{~#with @root.request.body.signature~}}
    {{{stringify timestamp}}},
    {{{stringify token}}},
    {{{stringify signature}}} 
  {{~/with}}
);
