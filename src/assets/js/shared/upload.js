let oldContent = [];

function handleProgress(event, progressSelector) {
    var percent = 0;
    var position = event.loaded || event.position;
    var total = event.total;
    if (event.lengthComputable) {
        percent = Math.ceil(position / total * 100);
    }
    $(progressSelector + ' .progress-bar').css('width', percent + '%');
    $(progressSelector + ' .status').text(percent + '%');
    if (percent === 100) {
        let old = oldContent.find(_ => _.id === progressSelector); 
        if (old) {
            setTimeout(() => {
                $(progressSelector).html(old.html);
                oldContent.splice(oldContent.findIndex(_ => _.id === progressSelector), 1);
            }, 200);
        }
    }
}

const upload = new function () {
    let obj = {};

    obj.form = (route, formSelector, progressSelector, callback) => {
        oldContent.push({
            id: progressSelector,
            html: $(progressSelector).html()
        });
        $(progressSelector).html(`<div class="progress-bar"></div><h5 class="status"></h5>`);
        network.upload(route, formSelector, () => {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress', e => handleProgress(e, progressSelector), false);
            }
            return myXhr;
        }, res => {
            callback(res);
        }, true);
    }

    return obj;
};
