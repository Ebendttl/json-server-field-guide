# Windows PowerShell verification checklist

Every PowerShell code block in this guide was **not executed in WSL**. The
following checklist should be verified on a Windows machine with PowerShell.

## Quickstart

- [ ] `Invoke-RestMethod http://localhost:3000/posts` — returns JSON array
- [ ] `Invoke-RestMethod http://localhost:3000/posts/1` — returns single record
- [ ] `Invoke-RestMethod http://localhost:3000/profile` — returns profile object
- [ ] POST with `Invoke-RestMethod -Method Post` — creates a record, returns generated id
- [ ] PATCH with `Invoke-RestMethod -Method Patch` — updates only sent fields
- [ ] DELETE with `Invoke-RestMethod -Method Delete` — returns 200

## Build a mock API guide

- [ ] `Invoke-RestMethod "http://localhost:3000/tasks?status=open"` — filters correctly
- [ ] `Invoke-RestMethod "http://localhost:3000/tasks?status=open&priority:gte=2"` — combined filter
- [ ] `Invoke-RestMethod "http://localhost:3000/tasks?status:ne=done"` — ne operator
- [ ] `Invoke-RestMethod "http://localhost:3000/tasks?_sort=-priority,title"` — multi-key sort
- [ ] `Invoke-RestMethod "http://localhost:3000/tasks?_page=2&_per_page=2"` — pagination object
- [ ] `Invoke-RestMethod "http://localhost:3000/tasks?status=open&_sort=-priority&_page=1&_per_page=2"` — combined
- [ ] `Invoke-RestMethod "http://localhost:3000/tasks/3?_embed=project"` — embed parent
- [ ] `Invoke-RestMethod "http://localhost:3000/projects/2?_embed=tasks"` — embed children

## Notes

- PowerShell's `&` in query strings may need quoting. Double-check that the
  entire URL is wrapped in double quotes.
- `Invoke-RestMethod` automatically parses JSON, so the output appears as a
  PowerShell object rather than raw JSON text.
- Test on both Windows PowerShell 5.1 and PowerShell 7+ if possible.
