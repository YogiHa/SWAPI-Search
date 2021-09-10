* SWAPI-Search

CLI node app allows fetching associated information on all SW objects, even from partial string input!

For running on your local machine

```
npm run search **YOUR PARTIAL SW STRING**
```

After running this script, a first prompt should appear with a first optional match in the first non-empty category.
The user can decide if fetch for that name, seek for other options in the category (if available...), or break the second loop and keep looking for results in the next categories.

The main downside of working directly with API without mapping the data earlier in any kind of implementation (beyond the obvious performance cost...) is expressed with scalability issues like sorting accords parameters (full string match vs partial, match at string beginning either end...), synonymous, common typos, etc...