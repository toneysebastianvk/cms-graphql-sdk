const {
  ContentClient,
  StagingEnvironmentFactory,
} = require("dc-delivery-sdk-js");

const HUB_NAME = "uasandbox";
class AmplienceSDK {
  client;
  constructor() {}

  async init(preview) {
    if (!preview) {
      this.client = new ContentClient({
        hubName: HUB_NAME,
      });
    } else {
      const factory = new StagingEnvironmentFactory(
        "uowk0qxoku001ufatmmwkv1fe.staging.bigcontent.io"
      );
      const stagingEnvironmentAtTimestamp = await factory.generateDomain({
        //timestamp: 1742495400000,
      });
      this.client = new ContentClient({
        hubName: HUB_NAME,
        stagingEnvironment: stagingEnvironmentAtTimestamp,
      });
    }
  }

  async getModule(deliveryKey) {
    const content = await this.client.getContentItemByKey(deliveryKey);
    return content.body;
  }
}

module.exports = {
  AmplienceSDK,
};
