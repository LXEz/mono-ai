//import { AzureMonitorOpenTelemetryOptions, useAzureMonitor } from '@azure/monitor-opentelemetry';
//import { Resource } from '@opentelemetry/resources';
import * as dotenv from 'dotenv';

dotenv.config();

(() => {
  //const options: AzureMonitorOpenTelemetryOptions = {
  //  azureMonitorExporterOptions: {
  //    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  //  },
  //  resource: new Resource({
  //    'service.name': process.env.PACKAGE_NAME,
  //    'service.namespace': process.env.ENVIRONMENT || 'local',
  //    'service.instance.id': process.env.WEBSITE_INSTANCE_ID || os.hostname(),
  //  }),
  //  samplingRatio: 1.0,
  //  enableLiveMetrics: process.env.NODE_ENV === 'production',
  //};

  //useAzureMonitor(options);
})();
