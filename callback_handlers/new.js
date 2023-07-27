const parser = require('../parser/zh_parser');
const fs = require('fs');

const lark = require('../lark_sdk');

/**
 * 当用户发送信息后，如果命中 URL 规则，开放平台回向开发者推送 NEW 事件，告知开发者去准备预览数据。
 * 开发者可以通过 preview_token 来区分某次预览，这样 GET 请求中可以直接根据 preview_token 来获取预览数据并返还给开放平台
 * 
 * 如果你的预览数据获取不需要很长时间，比如毫秒级就可以返回，那 NEW 请求直接返回 status_code:200，然后响应 GET 请求返回预览数据即可
 * 
 * @param {URLPreviewRequest} params 
 * @returns {URLPreviewResponse}
 */
module.exports = async function (params) {

    // 这里是异步获取预览数据的示意，如果你的预览数据获取需要比较长的时间，那可以在接收到 NEW 事件后就开始准备数据

    const data = await parser(params.url);
    console.log(data);

    // 注意：
    // 如果你的预览不用区分千人千面，即针对同一个 URL，所有人看到的预览是一样的
    // 这种情况可以不用使用预览 token，直接识别 URL，根据 URL 做缓存就行

    const preview_token = params.preview_token;
    const cached_file = `${require('../config').HTML_CACHE_DIR}/${preview_token}.json`;
    if (data.book_name) {
        fs.writeFileSync(cached_file, JSON.stringify({
            status: {
                status_code: 200,
                status_message: 'success'
            },
            preview: {
                title: data.book_name,
                expired_at: 0,
                preview_card: {
                    card_id: 'AAqqb0mgN8pDe',
                    version_name: '1.0.1',
                    card_url: {
                        url: params.url
                    },
                    variables: {
                        book_name: data.book_name,
                        book_intro: data.book_intro,
                        user: data.user,
                        user_desc: data.user_desc,
                        book_img: await lark.upload_img(data.img_url),
                        user_img: await lark.upload_img(data.user_avatar)
                    }
                }
            }
        }))
    }

    // 如果你的预览数据获取不需要很长时间，比如毫秒级就可以返回，那 NEW 请求直接返回如下信息，然后响应 GET 请求返回预览数据即可
    // 如果 NEW 请求无响应，后续 GET 请求不会推送
    return {
        status: {
            status_code: 200,
            status_message: 'success'
        }
    };
}