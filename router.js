
const head_handler = require('./callback_handlers/head');
const new_handler = require('./callback_handlers/new');
const get_handler = require('./callback_handlers/get');
const del_handler = require('./callback_handlers/del');
const act_handler = require('./callback_handlers/act');

/**
 * 卡片请求方法
 */
const METHOD_ENUM = {
    /**
     * 消息输入框粘贴 URL 时获取精简预览（标题信息等），无生命周期
     */
    HEAD: 1,

    /**
     * 用户发消息的时候，系统推送事件，通知开发者准备预览数据
     */
    NEW: 2,

    /**
     * 用户查看消息时，系统推送事件，向开发者拉取预览数据
     */
    GET: 3,

    /**
     * 消息撤回时，系统推送事件，告知开发者预览撤销，开发者可根据这个事件做回收操作，如文档撤销授权等
     */
    DEL: 4,

    /**
     * 用户点击卡片上的某个交互式组件时，系统推送事件，向开发者传送上下文信息，开发者可根据上下文信息进行下一步相关的业务逻辑
     */
    ACT: 5
}

/**
 * 这是一个路由分发器
 * 识别预览请求中的 method 字段，然后分发给不同的 handler 进行处理
 * @param {URLPreviewRequest} params 
 * @returns {URLPreviewResponse}
 */
module.exports = async function (params) {

    const keys = Object.keys(METHOD_ENUM);
    for (let i = 0; i < keys.length; i++) {
        if (params.method === METHOD_ENUM[keys[i]]) {
            console.log(`event_type=${keys[i]}`);
            break;
        }
    }

    switch (params.method) {
        case METHOD_ENUM.HEAD:
            return await head_handler(params);
        case METHOD_ENUM.NEW:
            return await new_handler(params);
        case METHOD_ENUM.GET:
            return await get_handler(params);
        case METHOD_ENUM.DEL:
            return await del_handler(params);
        case METHOD_ENUM.ACT:
            return await act_handler(params);
        default:
            return await head_handler(params);
    }
}