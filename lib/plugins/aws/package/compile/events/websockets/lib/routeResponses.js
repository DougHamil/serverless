'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

module.exports = {
  compileRouteResponses() {
    this.validated.events.forEach(event => {
      if (!event.routeResponse) {
        return;
      }

      const websocketsRouteResponseLogicalId = this.provider.naming
        .getWebsocketsRouteResponseLogicalId(event.route);

      const websocketsRouteLogicalId = this.provider.naming
        .getWebsocketsRouteLogicalId(event.route);

      _.merge(this.serverless.service.provider.compiledCloudFormationTemplate.Resources, {
        [websocketsRouteResponseLogicalId]: {
          Type: 'AWS::ApiGatewayV2::RouteResponse',
          Properties: {
            ApiId: {
              Ref: this.websocketsApiLogicalId,
            },
            RouteId: {
              Ref: websocketsRouteLogicalId,
            },
            RouteResponseKey: event.routeResponse.key,
          },
        },
      });
    });

    return BbPromise.resolve();
  },
};
