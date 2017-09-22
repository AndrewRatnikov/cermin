$(function() {

    const uploadAvatar = {
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$uploadAvatarInput = $('#upload-avatar');
            this.$modalChangeAvatar = $('#change-avatar');
            this.$changeAvatarForm = this.$modalChangeAvatar.find('form');
            this.$changePersonalDataPopup = $('#change-personal-data');
            this.$changePersonalDataForm = this.$changePersonalDataPopup.find('form');
        },
        bindEvents: function () {
            this.$uploadAvatarInput.on('change', this.setValueToInput.bind(this));
            this.$uploadAvatarInput.on('click', this.delErrorBlock.bind(this));
            this.$modalChangeAvatar.on('hidden.bs.modal', this.clearInputValue.bind(this));
            this.$changeAvatarForm.on('submit', this.sendNewAvatar.bind(this));
            this.$changePersonalDataForm.on('submit', this.sendPersonalData.bind(this));
        },
        delErrorBlock: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
        },
        setValueToInput: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
            const filename = this.$uploadAvatarInput.prop('files')[0].name;
            this.$changeAvatarForm.find('[type="text"]').val(filename);
        },
        clearInputValue: function (event) {
            this.$changeAvatarForm.find('.alert').remove();
            this.$changeAvatarForm.find('input').val('');
        },
        sendNewAvatar: function (event) {
            event.preventDefault();
            const url = this.$changeAvatarForm.attr('action');
            const files = this.$uploadAvatarInput.prop('files');
            const modalBody = this.$changeAvatarForm.find('.modal-body');
            if (!files.length) {
                const err = '<p class="alert alert-danger">No files were upload</p>';
                modalBody.prepend(err);
                return;
            }
            const formData = new FormData();
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
                success: function(result){
                    if (result.success) return document.location.reload(true);
                    const err = '<p class="alert alert-danger">' + result.error + '</p>';
                    modalBody.prepend(err);
                }
            });
        },
        sendPersonalData: function(event) {
            event.preventDefault();
            const url = this.$changePersonalDataForm.attr('action');
            const data = this.$changePersonalDataForm.serialize();
            const modalBody = this.$changePersonalDataForm.find('.modal-body');
            $.post(url, data, function(result) {
                if (result.success) return document.location.reload(true);
                const err = '<p class="alert alert-danger">' + result.error + '</p>';
                modalBody.prepend(err);
            });
        }
    };
    uploadAvatar.init();

});