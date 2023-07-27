const lark = require('@larksuiteoapi/node-sdk');
const { APP_ID, APP_SECRET, ROOT_DIR } = require('./config');
const axios = require('axios');

module.exports = {
    /**
     * 上传图片获取图片 img_key
     * @param {String} img_url 
     * @returns {String}
     */
    upload_img: async function (img_url) {

        const img_data = (await axios({
            url: img_url,
            method: 'get',
            responseType: 'stream'
        })).data;

        const client = new lark.Client({
            appId: APP_ID,
            appSecret: APP_SECRET,
            appType: lark.AppType.SelfBuild,
            domain: lark.Domain.Feishu
        });
        const resp = await client.im.image.create({
            data: {
                image_type: "message",
                image: img_data
            }
        })
        return resp.image_key;
    }
}