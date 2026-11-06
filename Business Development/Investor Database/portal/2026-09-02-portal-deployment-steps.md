# Investor Registry Portal

Live as of 2026-09-02. Nothing to deploy or authorize.

## Links

**You (Admin)**
https://script.google.com/macros/s/AKfycbyIi93aLUkGPGbkblnGqyru8qIlOS6Y1XjIM54yqAxoOKdePBh71sPOss58nfoZ63EJ/exec?key=c55d5bf00eb8fcfc7abf

**Greg Ives**
https://script.google.com/macros/s/AKfycbyIi93aLUkGPGbkblnGqyru8qIlOS6Y1XjIM54yqAxoOKdePBh71sPOss58nfoZ63EJ/exec?key=839f35047ae481b0eaa0

**Jakob Hedger**
https://script.google.com/macros/s/AKfycbyIi93aLUkGPGbkblnGqyru8qIlOS6Y1XjIM54yqAxoOKdePBh71sPOss58nfoZ63EJ/exec?key=de8f1d957da87ca0e47b

**Neil Dutta**
https://script.google.com/macros/s/AKfycbyIi93aLUkGPGbkblnGqyru8qIlOS6Y1XjIM54yqAxoOKdePBh71sPOss58nfoZ63EJ/exec?key=bd002c5955ceea67f5ff

Always use your own link above. The bare URL without a key shows "link not valid."

## Sharing

Send each partner their link. They sign in with any Google account and are in. No approval screens.

## Revoking

Open the Sheet `Investor_Registry_DB`, Partners tab, clear that partner's `access_key`. Their link stops working immediately. To let them back in, put a new random key in the cell and send them the new link.

Never share the Sheet itself.

## Who can do what

| | You | Partner |
|---|---|---|
| View, filter, export CSV | Yes | Yes |
| Add notes, edit entities and contacts, add entities, link contacts to entities | Yes | Yes |
| Resolve or add review flags | Yes | Yes |
| Tick relationship boxes | All columns | Own column only |
| Delete a contact (reason required, archived) | Yes | Yes |
| Delete an entity (reason required, archived), restore deleted records, add a partner | Yes | No |

Every change is stamped with the person's name. Activity log button (top right) shows the full log, filterable by person and action, plus the Deleted records archive.

## Updates

Data loads (new exports, flip reports): I write straight into the Sheet. No redeploy.
Portal changes (UI or logic): I update the script and redeploy. The links do not change.
