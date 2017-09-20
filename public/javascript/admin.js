$(function() {

    var uploadAvatar = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.uploadAvatarInput = $('#upload-avatar');
            this.modalChangeAvatar = $('#change-avatar');
        },
        bindEvents: function () {
            this.uploadAvatarInput.on('change', this.setValueToInput);
            this.modalChangeAvatar.on('hidden.bs.modal', this.clearInputValue);
        },
        setValueToInput: function (event) {
            $(this).parents('.input-group').find('[type="text"]').val(this.files[0].name);
        },
        clearInputValue: function (event) {
            $(this).find('input').val('');
        }
    };
    uploadAvatar.init();

});