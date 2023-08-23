

/**
 * 卡片交互事件
 * @param {URLPreviewRequest} params 
 * @returns {URLPreviewResponse}
 */
module.exports = async function (params) {

    // console.log(params);
    let action_payload = params.action_payload;
    if (action_payload) {
        action_payload = Buffer.from(action_payload, 'base64').toString('utf8');
    }
    console.log(action_payload);

    // 在这里补充业务代码

    // return 200
    return {
        status: {
            status_code: 200,
            status_message: 'success'
        }
    };
}