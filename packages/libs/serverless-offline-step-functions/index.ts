import path from 'path';
import AWS from 'aws-sdk';
import stepFunctionsLocal from 'stepfunctions-local';
import * as Serverless from 'serverless';

interface Config {
  port: number;
  accountId: string;
  functions: Record<string, string>;
}

interface StateMachineState {
  Type: string;
  Next?: string;
  Resource: any;
  [key: string]: any;
}

interface StateMachineDefinition {
  StartAt: string;
  States: Record<string, StateMachineState>;
}

interface StateMachines {
  [name: string]: {
    name?: string;
    events: Array<any>;
    definition: StateMachineDefinition;
  };
}

interface StepFunctions {
  stateMachines: StateMachines | {};
  activities: Array<any>;
}

class ServerlessPlugin {
  serverless: Serverless;

  provider: ReturnType<Serverless['getProvider']>;

  region: string;

  stepFunctionsLocal: typeof stepFunctionsLocal;

  hooks: Record<string, () => Promise<void> | void>;

  config: Config;

  stage: Serverless.Options['stage'];

  stepFunctionsApi?: AWS.StepFunctions;

  stepFunctions?: StepFunctions;

  stateMachines?: StateMachines;

  lambdaEndpoint: string;

  stepFunctionEndpoint: string;

  constructor(serverless: Serverless) {
    this.serverless = serverless;

    this.provider = this.serverless.getProvider('aws');
    this.region = this.provider.getRegion();
    this.stage = this.provider.getStage();

    this.stepFunctionsLocal = stepFunctionsLocal;

    const config =
      this.serverless.service.custom?.['serverless-offline-step-functions'] ||
      {};

    config.accountId = config.accountId || '123456789012';
    config.port = config.port || 5003;

    this.config = config;

    process.env.AWS_ACCESS_KEY_ID =
      process.env.AWS_ACCESS_KEY_ID ||
      (AWS.config.credentials && AWS.config.credentials.accessKeyId) ||
      'fake';
    process.env.AWS_SECRET_ACCESS_KEY =
      process.env.AWS_SECRET_ACCESS_KEY ||
      (AWS.config.credentials && AWS.config.credentials.secretAccessKey) ||
      'fake';

    const serverlessOfflineConfig = this.serverless.service.custom?.[
      'serverless-offline'
    ];

    const host = serverlessOfflineConfig?.host;
    const lambdaPort = serverlessOfflineConfig?.lambdaPort;

    this.lambdaEndpoint = `http://${host}:${lambdaPort}`;
    this.stepFunctionEndpoint = `http://${host}:${this.config.port}`;

    if (process.env.NODE_ENV === 'development') {
      this.hooks = {};
    } else {
      this.hooks = {
        'offline:start': this.startHandler.bind(this),
        'offline:start:init': this.startHandler.bind(this),
        'offline:start:end': this.endHandler.bind(this),
      };
    }
  }

  async startHandler() {
    await this.yamlParse();

    this.startStepFunctionsLocal();

    this.stepFunctionsApi = new AWS.StepFunctions({
      endpoint: this.stepFunctionEndpoint,
      region: this.region,
      accessKeyId: AWS.config.credentials?.accessKeyId || 'fake',
      secretAccessKey: AWS.config.credentials?.secretAccessKey || 'fake',
    });

    this.stateMachines = this.stepFunctions?.stateMachines;

    if (!this.stateMachines) {
      this.serverless.cli.log('No state machines found, skipping creation.');
      return;
    }

    // Create state machines for each one defined in serverless.yml.
    await Promise.all(
      Object.keys(this.stateMachines).map((stateMachineId) =>
        this.createStateMachine(stateMachineId)
      )
    );
  }

  startStepFunctionsLocal() {
    this.serverless.cli.log('Starting stepfunctions-local');

    this.stepFunctionsLocal.start({
      port: this.config.port,
      lambdaEndpoint: this.lambdaEndpoint,
      lambdaRegion: this.region,
      ecsRegion: this.region,
      region: this.region,
      stripLambdaArn: true,
    });
  }

  async endHandler() {
    this.serverless.cli.log('Stopping stepfunctions-local');

    this.stepFunctionsLocal.stop();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async createStateMachine(stateMachineName: string) {
    this.serverless.cli.log(`Creating state machine ${stateMachineName}`);

    if (!this.stateMachines) {
      throw new Error('State machines are not yet initialized');
    }

    const name = this.stateMachines[stateMachineName].name || stateMachineName;

    const params = {
      name: name.replace(/\${opt:stage}/g, this.stage!),
      definition: JSON.stringify(
        this.buildStateMachine(this.stateMachines[stateMachineName].definition)
      ),
      roleArn: `arn:aws:iam::${this.config.accountId}:role/service-role/MyRole`,
    };

    if (!this.stepFunctionsApi) {
      throw new Error('AWS step functions API is not running');
    }

    const response = await this.stepFunctionsApi
      .createStateMachine(params)
      .promise();

    this.serverless.cli.log(`Successfully created ${response.stateMachineArn}`);

    return response;
  }

  buildStateMachine(
    stateMachineDefinition: StateMachineDefinition
  ): StateMachineDefinition {
    const stateMachine = stateMachineDefinition;

    if (stateMachine.States) {
      stateMachine.States = this.buildStates(stateMachine.States);
    }

    return stateMachine;
  }

  buildStates(
    states: StateMachineDefinition['States']
  ): StateMachineDefinition['States'] {
    const stateNames = Object.keys(states);
    stateNames.forEach((stateName) => {
      const state = states[stateName];
      if (state.Resource) {
        states[stateName] = this.buildStateArn(state, stateName);
      }

      if (state.Branches) {
        state.Branches.map((branch: any) => {
          branch.States = this.buildStates(branch.States);
          return branch;
        });
      }
    });

    return states;
  }

  buildStateArn(
    state: StateMachineState,
    stateName: string
  ): StateMachineState {
    if (state.Type === 'Task') {
      const functionName = this.config.functions?.[stateName];

      if (!functionName) {
        throw new Error(`Unspecified function name for state: ${stateName}`);
      }

      state.Resource = `arn:aws:lambda:${this.region}:${this.config.accountId}:function:${this.serverless.service.service}-${this.stage}-${functionName}`;
    } else {
      throw new Error(`Unsupported resource type: ${state.Type}`);
    }

    return state;
  }

  async yamlParse() {
    const { servicePath } = this.serverless.config;
    if (!servicePath) {
      return;
    }

    const serverlessYmlPath = path.join(
      servicePath,
      this.serverless.service.serviceFilename || 'serverless.yml'
    );

    const parsedYaml = await this.serverless.yamlParser.parse(
      serverlessYmlPath
    );

    this.stepFunctions = {
      stateMachines: parsedYaml.stepFunctions.stateMachines || {},
      activities: parsedYaml.stepFunctions.activities || [],
    };
  }
}

module.exports = ServerlessPlugin;
