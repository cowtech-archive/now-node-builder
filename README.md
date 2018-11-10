# @cowtech/now-node-server

[![Package Version](https://img.shields.io/npm/v/@cowtech/now-node-server.svg)](https://npmjs.com/package/@cowtech/now-node-server)
[![Dependency Status](https://img.shields.io/gemnasium/github.com/cowtech/now-node-server.svg)](https://gemnasium.com/github.com/cowtech/now-node-server)

CowTech Now v2 Node.js server builder.

https://github.com/cowtech/now-node-server

# Usage

First, read Now [documentation](https://zeit.co/docs/v2/deployments/builders/overview#how-to-use-builders) thoroughly, then modify your `now.json` like this:

```javascript
{
    "builds": [
        { "src": "date.js", "use": "@cowtech/now-node-server" }
    ]
}
```

## Contributing to miele

- Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet.
- Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it.
- Fork the project.
- Start a feature/bugfix branch.
- Commit and push until you are happy with your contribution.
- Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.

## Copyright

Copyright (C) 2018 and above Shogun <shogun@cowtech.it>.

Licensed under the MIT license, which can be found at https://choosealicense.com/licenses/mit.
