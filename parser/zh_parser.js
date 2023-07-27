const axios = require('axios');
const fs = require('fs');
const { parse_id } = require('../common');
const { HTML_CACHE_DIR } = require('../config');

if (!fs.existsSync(HTML_CACHE_DIR)) {
    fs.mkdirSync(HTML_CACHE_DIR);
}

/**
 * 
 * @param {String} url_str 
 * @returns {{img_url:String, book_name:String, book_intro:String, user_avatar:String, user:String, user_desc:String}}
 */
module.exports = async function (url_str) {

    if (!url_str) {
        return;
    }

    const id = parse_id(url_str);
    if (!id) {
        return;
    }

    let html_str = '';

    const file_path = `${HTML_CACHE_DIR}/${id}.html`;
    if (fs.existsSync(file_path)) {
        html_str = fs.readFileSync(file_path, 'utf-8');
    }
    else {
        const resp = await axios({
            url: url_str,
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
            }
        })
        html_str = resp.data;
        fs.writeFileSync(file_path, resp.data);
    }
    const regex = /<img\W*?class="BookItem-cover-nXTWb" src="(?<img_url>.+?)"\/>.+?<div\W*?class="BookItem-title-nTgtT">(?<book_name>.+?)<\/div><div\W*?class="BookItem-intro-99f5B">(?<book_intro>.+?)<\/div>.*?<div\W*?class="Image-module-imageWrapper-fVufG Avatar-image-gfh4X" src="(?<user_avatar>.+?)"\W*?.+?<\/div>.+?<div\W*?class="UserCell-name-v4DpM">.+?>(?<user>.+?)<\/a>.+?<div\W*?class="UserCell-desc-psxDa">(?<user_desc>.+?)<\/div>/gm;
    const mats = regex.exec(html_str);
    if (mats.length) {
        Object.keys(mats.groups).forEach(k => {
            console.log(`${k}\t${mats.groups[k]}`)
        })

        return mats.groups;
    }
}