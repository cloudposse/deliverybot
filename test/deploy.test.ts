import * as factory from "./factory";
import { deploy } from "../src/deploy";
import Octokit from "@octokit/rest";

describe("deploy", () => {
  jest.setTimeout(30000);
  let probot: factory.Probot;

  afterEach(() => {
    factory.cleanAll();
    factory.store.clear();
  });

  beforeEach(() => {
    probot = factory.probot();
    factory.token();
    factory.permission({ admin: true });
    factory.repo().persist();
    factory.gitCommit().persist();
    factory.gitRef().persist();
  });

  test("creates a deployment", async () => {
    const isDeployed = factory.deploy({
      ref: "refs/heads/featureA",
      task: "deploy",
      transient_environment: false,
      production_environment: true,
      environment: "production",
      auto_merge: true,
      required_contexts: ["continuous-integration/travis-ci/push"],
      description: "A test environment based on Docker",
      payload: { target: "production" }
    });
    factory.config({ valid: true });

    const github = new Octokit({ auth: "test" });

    await deploy(github, probot.logger, factory.store, {
      owner: "Codertocat",
      repo: "Hello-World",
      ref: "refs/heads/featureA",
      sha: "0000000000000000000000000000000000000000",
      target: "production"
    });
    expect(isDeployed.isDone()).toBe(true);
  });

  test("creates a deployment with a task", async () => {
    const isDeployed = factory.deploy({
      ref: "refs/heads/featureA",
      task: "foobar",
      transient_environment: false,
      production_environment: true,
      environment: "production",
      auto_merge: true,
      required_contexts: ["continuous-integration/travis-ci/push"],
      description: "A test environment based on Docker",
      payload: { target: "production" }
    });
    factory.config({ valid: true });

    const github = new Octokit({ auth: "test" });

    await deploy(github, probot.logger, factory.store, {
      owner: "Codertocat",
      repo: "Hello-World",
      ref: "refs/heads/featureA",
      sha: "0000000000000000000000000000000000000000",
      target: "production",
      task: "foobar"
    });
    expect(isDeployed.isDone()).toBe(true);
  });

  test("creates a deployment with force", async () => {
    const isDeployed = factory.deploy({
      ref: "refs/heads/featureA",
      task: "foobar",
      transient_environment: false,
      production_environment: true,
      environment: "production",
      auto_merge: true,
      required_contexts: [],
      description: "A test environment based on Docker",
      payload: { target: "production" }
    });
    factory.config({ valid: true });

    const github = new Octokit({ auth: "test" });

    await deploy(github, probot.logger, factory.store, {
      owner: "Codertocat",
      repo: "Hello-World",
      ref: "refs/heads/featureA",
      sha: "0000000000000000000000000000000000000000",
      target: "production",
      task: "foobar",
      force: true,
    });
    expect(isDeployed.isDone()).toBe(true);
  });
});
