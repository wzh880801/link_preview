interface URLPreviewRequest {
    action_payload: object,
    creator: {
        tenant_id: String,
        user_id: String
    },
    host_name: String,
    locale: String,
    messenger_context: {
        chat_id: String,
        message_id: String,
        observer: UserMeta,
        owner: UserMeta,
        parent_id: "",
        plat_form: Number,
        root_id: "",
        scenario: Number
    },
    method: Number,
    observer: UserMeta,
    path: String,
    preview_token: String,
    url: String
}

interface UserMeta {
    tenant_id: String,
    user_id: String
}

interface URLPreviewResponse {
    status: {
        status_code: Number,
        status_message: String
    },
    preview: {
        title: String,
        expired_at: Number,
        version: Number,
        inline_image_key: String,
        preview_card: {
            card_id: String,
            version_name: String,
            card_url: {
                url: String,
                ios: String,
                andriod: String,
                pc: String,
                web: String
            },
            variables: {
                [key: string]: string
            },
            actions: {
                [key: string]: URLPreviewAction
            }

        }
    }
}

interface URLPreviewAction {

}