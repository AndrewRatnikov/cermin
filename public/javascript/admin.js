$(function() {

    var uploadAvatar = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$uploadAvatarInput = $('#upload-avatar');
            this.$modalChangeAvatar = $('#change-avatar');
            this.$changeAvatarForm = this.$modalChangeAvatar.find('form');
        },
        bindEvents: function () {
            this.$uploadAvatarInput.on('change', this.setValueToInput.bind(this));
            this.$uploadAvatarInput.on('click', this.delErrorBlock.bind(this));
            this.$modalChangeAvatar.on('hidden.bs.modal', this.clearInputValue.bind(this));
            this.$changeAvatarForm.on('submit', this.sendNewAvatar.bind(this));
        },
        delErrorBlock: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
        },
        setValueToInput: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
            var filename = this.$uploadAvatarInput.prop('files')[0].name;
            this.$changeAvatarForm.find('[type="text"]').val(filename);
        },
        clearInputValue: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
            this.$changeAvatarForm.find('input').val('');
        },
        sendNewAvatar: function (event) {
            event.preventDefault();
            var url = this.$changeAvatarForm.attr('action');
            var files = this.$uploadAvatarInput.prop('files');
            var modalBody = this.$changeAvatarForm.find('.modal-body');
            if (!files.length) {
                var err = '<p class="alert alert-danger">No files were upload</p>';
                modalBody.prepend(err);
                return;
            }
            var formData = new FormData();
            $.each(files, function(key, value) {
                formData.append('uploadAvatar', value);
            });
            $.ajax({
                url: url,
                dataType: 'json',
                cache: false,
                contentType: false,
                processData: false,
                data: formData,
                type: 'post',
                success: function(){
                    document.location.reload(true);
                },
                error: function (jqxhr) {
                    var error = JSON.parse(jqxhr.responseText).error;
                    var err = '<p class="alert alert-danger">' + error + '</p>';
                    modalBody.prepend(err);
                }
            });
        }
    };
    uploadAvatar.init();

});