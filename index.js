const jsonParser = require('express').json();
const urlEncoded = require('express').urlencoded({ extended: true });
const { PassThrough } = require('stream');

const plugin = {
  version: '1.0.0',
  policies: ['body-modifier'],
  init: function (pluginContext) {
    pluginContext.registerPolicy({
      name: 'body-modifier',
      schema: {
        $id: 'http://express-gateway.io/schemas/policies/body-modifier.json',
        type: 'object',
        definitions: {
          addRemove: {
            type: 'object',
            properties: {
              add: {
                type: ['array'],
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    value: { type: 'string' }
                  }
                },
                default: []
              },
              remove: {
                type: ['array'],
                items: {
                  type: 'string'
                },
                default: []
              }
            }
          }
        },
        properties: {
          request: { '$ref': '#/definitions/addRemove' },
          response: { '$ref': '#/definitions/addRemove' }
        }
      },
      policy: params => {

        const transformBody = (transformSpecs, egContext, body) => {
          transformSpecs.add.forEach(addParam => { body[addParam.name] = egContext.run(addParam.value); });
          transformSpecs.remove.forEach(removeParam => { delete body[removeParam]; });

          return body;
        };

        return (req, res, next) => {
          jsonParser(req, res, (err) => {
            if (err) return next(err);

            urlEncoded(req, res, (err) => {
              if (err) return next(err);

              if (params.request) {
                const bodyData = JSON.stringify(transformBody(params.request, req.egContext, req.body));
                req.headers['content-length'] = Buffer.byteLength(bodyData);
                req.egContext.requestStream = new PassThrough();
                req.egContext.requestStream.write(bodyData);
              }

              if (params.response) {
                const _write = res.write;
                res.write = (data) => {
                  try {
                    const body = transformBody(params.response, req.egContext, JSON.parse(data));
                    const bodyData = JSON.stringify(body);

                    res.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    _write.call(res, bodyData);
                  } catch (e) {
                    _write.call(res, data);
                  }
                };
              }
            });
          });
          next();
        };
      }
    });
  }
}

module.exports = plugin;