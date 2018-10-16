CALL _getTest(
  {{{mysqlEscape @root.request.params.campaign}}},
  {{{mysqlEscape @root.request.params.email}}},
  {{{mysqlEscape (default @root.request.params.query.override @root.request.params.email)}}},
  {{{default (mysqlEscape @root.request.params.query.lastsent) "NULL"}}}
);
