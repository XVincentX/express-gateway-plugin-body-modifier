# express-gateway-plugin-body-modifier

## Warn

This policy has been modified and it's not included in Express Gateway core. Check that out!

## Introduction

This plugin for [Express Gateway](https://express-gateway.io) makes it possible rewrite request and response body before
these get proxied to the target `serviceEndpoint` or returned back to the client

## Installation

Simply type from your shell environment:

```bash
eg plugin install express-gateway-plugin-body-modifier
```

## Quick start

1. Make sure the plugin is listed in [system.config.yml file](https://www.express-gateway.io/docs/configuration/system.config.yml/).
This is done automatically for you if you used the command above.

2. Add the configuration keys to [gateway.config.yml file](https://www.express-gateway.io/docs/configuration/gateway.config.yml/).

```yaml
policies:
  - body-modifier:
      action:
        request:
          add:
          - name: fullname
            value: req.body.name + ' ' + req.body.surname
          remove:
          - name
          - surname
        response:
          add:
          - name: createdBy
            value: res.body.fullname
          remove:
          - uselessParam
```

## Want to make your own plugin?

Just check out our [plugin development guide](https://www.express-gateway.io/docs/plugins/).
We can't wait to see your custom stuff in the Gateway!
