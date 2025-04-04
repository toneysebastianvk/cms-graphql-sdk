const {
  ContentClient,
  StagingEnvironmentFactory,
} = require("dc-delivery-sdk-js");

const HUB_NAME = "uasandbox";
class AmplienceSDK {
  client;
  constructor() {}

  async init(preview, timestamp) {
    if (!preview) {
      this.client = new ContentClient({
        hubName: HUB_NAME,
      });
    } else {
      const factory = new StagingEnvironmentFactory(
        "uowk0qxoku001ufatmmwkv1fe.staging.bigcontent.io"
      );
      const stagingEnvironmentAtTimestamp = await factory.generateDomain({
        ...(!!timestamp && { timestamp }),
      });
      this.client = new ContentClient({
        hubName: HUB_NAME,
        stagingEnvironment: stagingEnvironmentAtTimestamp,
      });
    }
  }

  async getModule({ deliveryKey, page, productid }) {
    let content = undefined;
    if (page === "pdp" && productid) {
      const filterContent = await this.client
        .filterByContentType("https://quadratic.amplience.com/content/pdp")
        .filterBy("/productSelector", productid)
        .page(1)
        .request({
          format: "inlined",
          depth: "all",
        });
      content = filterContent?.responses?.[0]?.content;
    }
    if (!!deliveryKey) {
      const data = await this.client.getContentItemByKey(deliveryKey);
      content = data?.body;
    }
    return content;
  }
}

module.exports = {
  AmplienceSDK,
};
